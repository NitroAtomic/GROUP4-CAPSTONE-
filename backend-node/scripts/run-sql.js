// scripts/run-sql.js
// IamAtomic — Group 4 Capstone 2, SE-AWARE backend
//
// Pinapatakbo yung isang .sql file gamit yung mismong koneksyon ng app.
//
//   npm run db:migrate sql/06-payment.sql
//
// Bakit hindi na lang Workbench: yung Aiven ay may sariling CA, kaya
// kailangan pa ng cert bago makakonekta -- at nalutas na yun ng
// config/db.js. Dito na lang dumadaan para hindi na ulitin yung setup.
//
// Ligtas ulitin: yung "existing na" na mga error (nadagdag nang column,
// nagawa nang key) ay nilalaktawan at ibinabalita, hindi ipinapatigil.

const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

// Mga error na ibig sabihin ay "nagawa na dati", hindi "may sira".
const ALREADY_DONE = new Set([
  'ER_DUP_FIELDNAME',   // nadagdag na yung column
  'ER_DUP_KEYNAME',     // nagawa na yung index
  'ER_TABLE_EXISTS_ERROR',
]);

/* Hinahati ang file sa mga pangungusap.

   Dati `sql.split(';')` lang ito, at mali yun: may tanong sa 05 na may
   tuldok-kuwit sa loob mismo ng teksto --

     'Spear phishers only target executives; entry-level contractors...'

   -- kaya nahahati yung INSERT sa gitna ng salita, at ER_PARSE_ERROR ang
   kinalabasan. Sinusundan na ngayon kung nasa loob ba ng panipi, ng
   backtick, o ng komento: doon lang, hindi hati ang tuldok-kuwit. */
function statements(sql) {
  const out = [];
  let buf = '';
  let quote = null;      // ', " o ` kapag nasa loob tayo ng isa sa mga ito
  let lineComment = false;
  let blockComment = false;

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    const next = sql[i + 1];

    if (lineComment) {
      if (ch === '\n') { lineComment = false; buf += ch; }
      continue;
    }

    if (blockComment) {
      if (ch === '*' && next === '/') { blockComment = false; i++; }
      continue;
    }

    if (!quote) {
      if (ch === '-' && next === '-') { lineComment = true; i++; continue; }
      if (ch === '#') { lineComment = true; continue; }
      if (ch === '/' && next === '*') { blockComment = true; i++; continue; }

      if (ch === "'" || ch === '"' || ch === '`') { quote = ch; buf += ch; continue; }

      if (ch === ';') { out.push(buf); buf = ''; continue; }

      buf += ch;
      continue;
    }

    // Nasa loob ng panipi. Dalawang paraan ng pag-escape sa MySQL:
    // doble ('') at backslash (\').
    if (ch === '\\' && quote !== '`') { buf += ch + (next || ''); i++; continue; }
    if (ch === quote && next === quote) { buf += ch + next; i++; continue; }
    if (ch === quote) { quote = null; buf += ch; continue; }

    buf += ch;
  }

  out.push(buf);

  return out
    .map((s) => s.trim())
    .filter(Boolean)
    /* Nilalaktawan yung USE. Nakaturo na yung koneksyon sa tamang database
       (galing DB_NAME), at iba-iba yung pangalan kada provider — sa Aiven
       madalas 'defaultdb', hindi 'awareness_platform'. Kung papatakbuhin
       pa rin, "Unknown database" agad yung sagot kahit walang mali. */
    .filter((s) => !/^USE\s/i.test(s));
}

(async () => {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: npm run db:migrate <file.sql>');
    process.exit(1);
  }

  const file = path.resolve(__dirname, '..', arg);
  if (!fs.existsSync(file)) {
    console.error(`Not found: ${file}`);
    process.exit(1);
  }

  const list = statements(fs.readFileSync(file, 'utf8'));
  console.log(`\nRunning ${path.basename(file)} — ${list.length} statement(s)\n`);

  let ran = 0;
  let skipped = 0;

  /* Iisang koneksyon para sa buong file.

     Dati `pool.query` bawat pangungusap, kaya walang katiyakan na iisa
     ang koneksyon -- at kapag ganoon, yung START TRANSACTION sa itaas ng
     file ay maaaring nasa ibang koneksyon kaysa sa mga INSERT na
     sumusunod, kaya wala itong silbi. */
  const conn = await pool.getConnection();

  try {
    for (const sql of list) {
      // Unang linya lang ang ipinapakita, para mabasa pa rin kahit mahaba
      // yung CREATE TABLE.
      const label = sql.split('\n')[0].slice(0, 68);
      try {
        await conn.query(sql);
        console.log(`  ok      ${label}`);
        ran++;
      } catch (err) {
        if (ALREADY_DONE.has(err.code)) {
          console.log(`  already ${label}`);
          skipped++;
          continue;
        }
        console.error(`\n  FAILED  ${label}`);
        console.error(`          ${err.code}: ${err.message}\n`);
        // Binabawi muna bago umalis, para walang kalahating naisulat.
        await conn.query('ROLLBACK').catch(() => {});
        conn.release();
        await pool.end();
        process.exit(1);
      }
    }

    console.log(`\n${ran} applied, ${skipped} already in place.\n`);
  } finally {
    conn.release();
    await pool.end();
  }
})();
