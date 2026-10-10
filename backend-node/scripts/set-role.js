// scripts/set-role.js
// IamAtomic — Group 4 Capstone 2, SE-AWARE backend
//
//   npm run user:admin -- you@example.com         gawing admin
//   npm run user:admin -- you@example.com user    ibalik sa ordinaryo
//   npm run user:admin                            listahan ng mga admin
//
// Isang linya lang naman ang kailangan:
//
//   UPDATE `user` SET role = 'admin' WHERE email = '...';
//
// Pero ang paggamit ng SQL client sa Aiven ay nangangailangan ng CA
// certificate at ng tamang TLS -- yun yung bumagsak noong una nating
// subukan. Ginagamit nito yung config/db.js, kaya kung tumatakbo yung
// server, tatakbo rin ito.
//
// Sa talaan tinitingnan ang role, hindi sa token (middleware/auth.js),
// kaya agad na epektibo sa server. Pero yung nasa browser ay galing sa
// token noong nag-login, kaya kailangan munang mag-log out at mag-log in
// ulit bago lumitaw yung Admin sa menu.

const pool = require('../config/db');

const VALID = ['user', 'admin'];

async function listAdmins() {
  const [rows] = await pool.query(
    "SELECT user_id, email, first_name, last_name, role FROM `user` WHERE role = 'admin' ORDER BY user_id"
  );
  if (!rows.length) {
    console.log('\nWalang admin sa talaan ngayon.\n');
    console.log('  npm run user:admin -- you@example.com\n');
    return;
  }
  console.log(`\n${rows.length} admin:\n`);
  for (const r of rows) {
    console.log(`  #${r.user_id}  ${r.email}  (${r.first_name} ${r.last_name})`);
  }
  console.log('');
}

async function setRole(email, role) {
  const [found] = await pool.query(
    'SELECT user_id, email, first_name, last_name, role FROM `user` WHERE email = ?',
    [email]
  );

  if (!found.length) {
    console.error(`\nWalang account na "${email}".`);
    console.error('Tingnan kung tama ang baybay, o kung sa ibang database ito nakatala.\n');
    process.exitCode = 1;
    return;
  }

  const user = found[0];

  if (user.role === role) {
    console.log(`\n${user.email} ay "${role}" na. Walang binago.\n`);
    return;
  }

  // Sinasabi muna kung ano ang babaguhin, bago baguhin.
  console.log(`\n  ${user.email}  (${user.first_name} ${user.last_name})`);
  console.log(`  ${user.role}  ->  ${role}\n`);

  const [result] = await pool.query('UPDATE `user` SET role = ? WHERE user_id = ?', [
    role,
    user.user_id,
  ]);

  if (result.affectedRows !== 1) {
    console.error('Hindi nagbago ang talaan. Subukan ulit.\n');
    process.exitCode = 1;
    return;
  }

  console.log('Tapos na.');
  if (role === 'admin') {
    console.log('Mag-log out at mag-log in ulit para lumitaw yung Admin sa menu.\n');
  } else {
    console.log('Mag-log out at mag-log in ulit para mawala yung Admin sa menu.\n');
  }
}

(async () => {
  const email = (process.argv[2] || '').trim();
  const role = (process.argv[3] || 'admin').trim().toLowerCase();

  try {
    if (!email) {
      await listAdmins();
    } else if (!VALID.includes(role)) {
      console.error(`\nAng role ay "user" o "admin" lang, hindi "${role}".\n`);
      process.exitCode = 1;
    } else {
      await setRole(email, role);
    }
  } catch (err) {
    console.error('\nHindi natuloy:', err.message);
    if (/ENOTFOUND|ETIMEDOUT|HANDSHAKE/i.test(err.message)) {
      console.error('Mukhang hindi naaabot ang database. Tingnan yung .env at yung CA certificate.\n');
    } else {
      console.error('');
    }
    process.exitCode = 1;
  } finally {
    await pool.end().catch(() => {});
  }
})();
