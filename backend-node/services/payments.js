// services/payments.js
// IamAtomic — Group 4 Capstone 2, SE-AWARE backend
//
// Yung aktwal na pagbibigay ng Premium pagkatapos ng bayad.
//
// Nasa sarili nitong file dahil dalawa ang tumatawag:
//
//   routes/billing.js  — pagbalik ng user galing sa checkout
//   routes/auth.js     — paglo-load ng account niya
//
// Kailangan yung pangalawa. Kung yung confirm page lang ang nag-aayos ng
// bayad, yung taong nagbayad tapos isinara agad yung tab ay mananatiling
// Free habambuhay: bayad na siya sa PayMongo, 'pending' pa rin dito, at
// wala siyang paraan para bawiin yun — nasa reference yung susi, at wala
// siya noon. Sa UAT na may sampung tao, mangyayari talaga ito.

const pool = require('../config/db');
const config = require('../config/env');
const paymongo = require('../config/paymongo');

/* Dito nagaganap yung aktwal na pagbibigay ng Premium.

   Tatlong bagay ang tinitiyak:

   - Sa may-ari lang. Naka-filter sa user_id, kaya hindi pwedeng i-confirm
     ng isang account yung bayad ng iba kahit alam niya yung reference.
   - Minsan lang. Yung UPDATE ay may "AND status = 'pending'", at sa
     affectedRows lang tayo nagpapatuloy. Kahit i-refresh nang sampung beses
     yung confirm page, isang beses lang madadagdagan yung subscription.
   - Tugmang halaga. Kung hindi tugma yung binayaran sa inaasahan, hindi
     ibinibigay yung Premium at nakatala yun. */
async function settle(userId, transaction) {
  const session = await paymongo.retrieveCheckoutSession(transaction.provider_session_id);

  if (!session.paid) {
    return { granted: false, status: transaction.status, reason: 'unpaid' };
  }

  if (
    session.amountCentavos !== null &&
    Number(session.amountCentavos) !== Number(transaction.amount_centavos)
  ) {
    console.error(
      `[billing] amount mismatch on ${transaction.reference_number}: ` +
      `expected ${transaction.amount_centavos}, PayMongo says ${session.amountCentavos}`
    );
    return { granted: false, status: transaction.status, reason: 'amount_mismatch' };
  }

  const [update] = await pool.query(
    `UPDATE payment_transaction
        SET status = 'paid',
            paid_at = NOW(),
            provider_payment_id = ?,
            payment_method = ?,
            livemode = ?
      WHERE transaction_id = ? AND user_id = ? AND status = 'pending'`,
    [
      session.paymentId,
      session.paymentMethod,
      session.livemode ? 1 : 0,
      transaction.transaction_id,
      userId,
    ]
  );

  // Naunahan na tayo ng ibang request (dalawang tab, halimbawa). Bayad pa
  // rin siya, pero hindi na natin uulitin yung pagdagdag ng araw.
  if (update.affectedRows === 0) {
    return { granted: false, status: 'paid', reason: 'already_settled' };
  }

  const plan = config.payment.prices[transaction.billing_period];

  /* Mula sa mas huli sa dalawa: ngayon, o yung dati niyang expiry. Kaya
     kung mag-renew siya bago pa mag-expire, nadadagdagan -- hindi
     nawawala -- yung natitira niyang araw. */
  await pool.query(
    `UPDATE user
        SET subscription_type = 'Premium',
            subscription_status = 'active',
            subscription_expires_at =
              DATE_ADD(GREATEST(NOW(), COALESCE(subscription_expires_at, NOW())), INTERVAL ? DAY)
      WHERE user_id = ?`,
    [plan.days, userId]
  );

  return { granted: true, status: 'paid', reason: null };
}

/* Inaayos yung mga naiwang bayad ng isang user.

   Tahimik ito: kapag hindi maabot ang PayMongo, naitatala sa log pero
   hindi ipinapasa pataas. Tinatawag ito habang nilo-load yung account, at
   hindi dapat masira ang pag-login dahil lang nagkaproblema ang isang
   tseke ng bayad. */
async function reconcilePending(userId) {
  if (!paymongo.isConfigured()) return;

  try {
    const [pending] = await pool.query(
      `SELECT transaction_id, reference_number, provider_session_id, billing_period,
              amount_centavos, status
         FROM payment_transaction
        WHERE user_id = ? AND status = 'pending' AND provider_session_id IS NOT NULL
          AND created_at > DATE_SUB(NOW(), INTERVAL 2 DAY)`,
      [userId]
    );

    for (const transaction of pending) {
      try {
        const result = await settle(userId, transaction);
        if (result.granted) {
          console.log(`[billing] settled abandoned payment ${transaction.reference_number}`);
        }
      } catch (err) {
        // Isang bigong tseke ay hindi dapat pumigil sa iba.
        console.error('[billing] reconcile failed:', err.message);
      }
    }
  } catch (err) {
    console.error('[billing] could not look for pending payments:', err.message);
  }
}

module.exports = { settle, reconcilePending };
