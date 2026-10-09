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

function statements(sql) {
  // Tinatanggal muna yung mga komento, para hindi mabasag yung paghahati
  // ng mga pangungusap.
  const cleaned = sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

  return cleaned
    .split(';')
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

  for (const sql of list) {
    // Unang linya lang ang ipinapakita, para mabasa pa rin kahit mahaba
    // yung CREATE TABLE.
    const label = sql.split('\n')[0].slice(0, 68);
    try {
      await pool.query(sql);
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
      await pool.end();
      process.exit(1);
    }
  }

  console.log(`\n${ran} applied, ${skipped} already in place.\n`);
  await pool.end();
})();
