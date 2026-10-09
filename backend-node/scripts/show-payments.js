// scripts/show-payments.js
// IamAtomic — Group 4 Capstone 2, SE-AWARE backend
//
//   npm run db:payments
//
// Ipinapakita yung talaan ng bayad mula sa sarili nating database.
//
// Bakit ito mahalaga at hindi lang yung dashboard ng PayMongo: ito yung
// audit trail na hinahanap sa papel. Dito nakikita kung sino nagbayad,
// magkano, kailan, anong reference, at kung test mode ba. Nakikita rin
// dito yung mga 'pending' -- yung mga umabandona ng checkout -- at yun
// mismo yung patunay na walang Premium na naibigay nang walang bayad.
//
// Para sa UAT at sa defense: ito yung ipapakita kapag tinanong kung
// paano naitatala ang mga transaksyon.

const pool = require('../config/db');

function peso(centavos) {
  return '₱' + (centavos / 100).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function when(value) {
  if (!value) return '—';
  return new Date(value).toISOString().slice(0, 16).replace('T', ' ');
}

(async () => {
  try {
    const [rows] = await pool.query(
      `SELECT t.reference_number, t.billing_period, t.amount_centavos, t.status,
              t.payment_method, t.livemode, t.created_at, t.paid_at,
              u.email, u.subscription_type, u.subscription_expires_at
         FROM payment_transaction t
         JOIN user u ON u.user_id = t.user_id
        ORDER BY t.created_at DESC
        LIMIT 40`
    );

    if (rows.length === 0) {
      console.log('\nNo payments recorded yet.\n');
      await pool.end();
      return;
    }

    console.log('');
    for (const r of rows) {
      const mode = r.livemode ? 'LIVE' : 'test';
      console.log(`${r.reference_number}`);
      console.log(`  ${r.email}`);
      console.log(`  ${peso(r.amount_centavos)} ${r.billing_period}  ·  ${r.status}  ·  ${mode}` +
                  (r.payment_method ? `  ·  ${r.payment_method}` : ''));
      console.log(`  started ${when(r.created_at)}` +
                  (r.paid_at ? `   paid ${when(r.paid_at)}` : '   not paid'));
      console.log(`  account is now ${r.subscription_type}` +
                  (r.subscription_expires_at ? ` until ${when(r.subscription_expires_at)}` : ''));
      console.log('');
    }

    const paid = rows.filter((r) => r.status === 'paid');
    const pending = rows.filter((r) => r.status === 'pending');
    const live = rows.filter((r) => r.livemode);

    console.log(`${rows.length} transaction(s): ${paid.length} paid, ${pending.length} pending.`);
    console.log(`Total collected: ${peso(paid.reduce((s, r) => s + r.amount_centavos, 0))}`);

    /* Hindi ito dapat mangyari sa buong UAT. Kung may lumabas dito, totoong
       pera na yung tinatanggap at dapat palitan agad yung key sa Render. */
    if (live.length > 0) {
      console.log(`\n  WARNING: ${live.length} of these are LIVE, not test.`);
      console.log('  Real money moved. Check PAYMONGO_SECRET_KEY on Render — it should start sk_test_.');
    }
    console.log('');
  } catch (err) {
    console.error('\nCould not read payments:', err.message, '\n');
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
