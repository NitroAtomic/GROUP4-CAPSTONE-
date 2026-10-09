// routes/billing.js
// IamAtomic — Group 4 Capstone 2, SE-AWARE backend
//
// FR-10: Premium subscription, dumadaan sa totoong payment portal.
//
// ANG DATING PROBLEMA
//
// Nasa browser lang lahat ng tseke ng bayad. Yung card form sa Payment.vue
// ang nagpapasya kung tama yung card, tapos tumatawag lang ito ng
// PATCH /api/auth/me/subscription na nagsasabing "Premium na ako".
// Pinaniniwalaan ito ng server. Isang linya sa devtools:
//
//     fetch('/api/auth/me/subscription', { method:'PATCH', ... })
//
// at Premium ka na nang libre. Wala ring naitatala kahit ano.
//
// ANG GINAGAWA NGAYON
//
//   1. Server ang nagsasabi kung magkano (config/env.js), hindi browser.
//   2. Gumagawa tayo ng 'pending' na row bago pa man umalis yung user.
//   3. PayMongo mismo ang nag-ho-host ng checkout page. Walang card number
//      na dumadaan sa server natin.
//   4. Pagbalik niya, tinatanong natin ang PayMongo -- hindi yung browser --
//      kung bayad na ba talaga.
//   5. Doon lang, at pagkatapos lang noon, nagiging Premium yung account.
//
// Kaya kahit i-type pa ng isang tao yung success URL nang diretso, o
// ulit-ulitin yung confirm, hindi siya magiging Premium kung walang
// katumbas na bayad sa PayMongo.

const express = require('express');
const crypto = require('crypto');

const pool = require('../config/db');
const config = require('../config/env');
const paymongo = require('../config/paymongo');
const { requireAuth } = require('../middleware/auth');
const { settle, reconcilePending } = require('../services/payments');

const router = express.Router();

const PERIODS = ['monthly', 'yearly'];

// Saan ibabalik ng PayMongo yung user. Yung unang CORS origin ang site
// natin; ang PUBLIC_URL ang panglampas kung lumipat ang address.
function siteUrl() {
  return (config.mail.publicUrl || config.corsOrigins[0] || '').replace(/\/$/, '');
}

/* Hindi sunod-sunod na numero. Kung SEA-1, SEA-2, SEA-3 ang reference,
   mahuhulaan ng kahit sino yung sa iba at masusubukang i-confirm yun.
   Random at naka-tali sa user id kaya walang mahuhulaan. */
function makeReference(userId) {
  const random = crypto.randomBytes(6).toString('hex').toUpperCase();
  return `SEA-${userId}-${Date.now().toString(36).toUpperCase()}-${random}`;
}

function peso(centavos) {
  return (centavos / 100).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ------------------------------------------------------------
// GET /api/billing/plans
//
// Dito kinukuha ng frontend yung presyo. Isang pinagmulan lang, at ang
// server yun -- para hindi na kailangang i-hardcode ulit sa Vue store at
// mag-iba pa yung dalawa.
// ------------------------------------------------------------
router.get('/plans', (req, res) => {
  res.json({
    currency: 'PHP',
    configured: paymongo.isConfigured(),
    methods: config.payment.methods,
    plans: PERIODS.map((period) => {
      const plan = config.payment.prices[period];
      return {
        billing_period: period,
        label: plan.label,
        amount_centavos: plan.centavos,
        amount_display: `₱${peso(plan.centavos)}`,
        days: plan.days,
      };
    }),
  });
});

// ------------------------------------------------------------
// POST /api/billing/checkout
//
// Simula ng bayad. Walang nababago sa account dito -- 'pending' muna.
// ------------------------------------------------------------
router.post('/checkout', requireAuth, async (req, res) => {
  const billingPeriod = String(req.body?.billing_period || '').toLowerCase();

  if (!PERIODS.includes(billingPeriod)) {
    return res.status(400).json({ error: "billing_period must be 'monthly' or 'yearly'." });
  }

  /* Kapag walang key, humihinto tayo nang malinis. Ang mahalaga: hindi ito
     dumadausdos pabalik sa "sige na nga, Premium ka na" -- yun mismo yung
     butas na sinasara natin dito. */
  if (!paymongo.isConfigured()) {
    return res.status(503).json({
      error: 'Online payment is not available right now. Please try again later.',
    });
  }

  // Server ang pumipili ng halaga. Kahit magpadala ang browser ng sariling
  // amount, hindi ito binabasa kahit saan.
  const plan = config.payment.prices[billingPeriod];
  const reference = makeReference(req.user.user_id);

  try {
    const [userRows] = await pool.query(
      'SELECT email, first_name, last_name FROM user WHERE user_id = ?',
      [req.user.user_id]
    );
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Itinatala muna bago tumawag sa labas. Kung bumagsak ang PayMongo,
    // may bakas pa rin na may sumubok -- mas mabuting may 'pending' na
    // walang session kaysa may bayad na walang kahit anong record.
    const [insert] = await pool.query(
      `INSERT INTO payment_transaction
         (user_id, reference_number, provider, billing_period, amount_centavos, currency, status)
       VALUES (?, ?, 'paymongo', ?, ?, 'PHP', 'pending')`,
      [req.user.user_id, reference, billingPeriod, plan.centavos]
    );

    const base = siteUrl();
    const session = await paymongo.createCheckoutSession({
      name: `SE-AWARE Premium — ${plan.label}`,
      description: `SE-AWARE Premium subscription (${plan.label.toLowerCase()})`,
      amountCentavos: plan.centavos,
      referenceNumber: reference,
      successUrl: `${base}/payment/confirm?ref=${encodeURIComponent(reference)}`,
      cancelUrl: `${base}/payment?cancelled=1`,
      email: userRows[0].email,
      metadata: {
        user_id: String(req.user.user_id),
        billing_period: billingPeriod,
      },
    });

    if (!session.checkoutUrl) {
      throw new Error('PayMongo did not return a checkout URL.');
    }

    await pool.query(
      'UPDATE payment_transaction SET provider_session_id = ?, livemode = ? WHERE transaction_id = ?',
      [session.id, session.livemode ? 1 : 0, insert.insertId]
    );

    res.json({
      reference_number: reference,
      checkout_url: session.checkoutUrl,
      amount_display: `₱${peso(plan.centavos)}`,
      billing_period: billingPeriod,
      livemode: session.livemode,
    });
  } catch (err) {
    console.error('[billing] checkout failed:', err.message);
    res.status(502).json({
      error: 'Could not start the payment. Please try again in a moment.',
    });
  }
});

// ------------------------------------------------------------
// POST /api/billing/confirm
//
// Tinatawag ng /payment/confirm page pagbalik ng user galing PayMongo,
// at ng "Check again" button kung may naiwang pending.
// ------------------------------------------------------------
router.post('/confirm', requireAuth, async (req, res) => {
  const reference = String(req.body?.reference_number || '').trim();
  if (!reference) {
    return res.status(400).json({ error: 'reference_number is required.' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT transaction_id, reference_number, provider_session_id, billing_period,
              amount_centavos, status
         FROM payment_transaction
        WHERE reference_number = ? AND user_id = ?`,
      [reference, req.user.user_id]
    );

    if (rows.length === 0) {
      // Pareho ang sagot kung wala talaga o kung sa iba yun. Walang
      // matutuklasan dito tungkol sa bayad ng ibang account.
      return res.status(404).json({ error: 'No such payment on this account.' });
    }

    const transaction = rows[0];

    if (transaction.status === 'paid') {
      return res.json({ paid: true, already_confirmed: true });
    }

    if (!transaction.provider_session_id) {
      return res.status(409).json({ paid: false, error: 'This payment was never started properly.' });
    }

    const result = await settle(req.user.user_id, transaction);

    if (!result.granted && result.reason === 'unpaid') {
      return res.status(402).json({
        paid: false,
        error: 'We have not received this payment yet. If you have just paid, wait a moment and check again.',
      });
    }

    if (!result.granted && result.reason === 'amount_mismatch') {
      return res.status(409).json({
        paid: false,
        error: 'The amount paid does not match this subscription. Please contact support.',
      });
    }

    const [me] = await pool.query(
      'SELECT subscription_type, subscription_status, subscription_expires_at FROM user WHERE user_id = ?',
      [req.user.user_id]
    );

    res.json({
      paid: true,
      already_confirmed: result.reason === 'already_settled',
      subscription_type: me[0]?.subscription_type,
      subscription_status: me[0]?.subscription_status,
      subscription_expires_at: me[0]?.subscription_expires_at,
    });
  } catch (err) {
    console.error('[billing] confirm failed:', err.message);
    res.status(502).json({
      paid: false,
      error: 'Could not reach the payment provider. Please check again shortly.',
    });
  }
});

// ------------------------------------------------------------
// GET /api/billing/transactions
//
// Kasaysayan ng bayad para sa account page -- ito yung "resibo" na
// hinahanap sa papel.
//
// Sinasalo rin nito yung isinarang tab: kung may naiwang pending na
// bayad na pala, dito ito naaayos nang hindi na kailangang bumalik sa
// mismong confirm page.
// ------------------------------------------------------------
router.get('/transactions', requireAuth, async (req, res) => {
  try {
    await reconcilePending(req.user.user_id);

    const [rows] = await pool.query(
      `SELECT reference_number, billing_period, amount_centavos, currency,
              status, payment_method, livemode, created_at, paid_at
         FROM payment_transaction
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 50`,
      [req.user.user_id]
    );

    res.json(rows.map((row) => ({
      ...row,
      amount_display: `₱${peso(row.amount_centavos)}`,
    })));
  } catch (err) {
    console.error('[billing] transactions failed:', err.message);
    res.status(500).json({ error: 'Could not load your payment history.' });
  }
});

module.exports = router;
