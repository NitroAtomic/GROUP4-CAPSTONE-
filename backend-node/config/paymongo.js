// config/paymongo.js
// IamAtomic — Group 4 Capstone 2, SE-AWARE backend
//
// Manipis na client para sa PayMongo Hosted Checkout (v2).
//
// Dalawang bagay lang talaga ang ginagawa nito:
//
//   1. Gumawa ng checkout session  -> nakukuha natin yung checkout_url
//   2. Kunin ulit yung session     -> dito natin nakikita kung bayad na
//
// Mahalaga: dito lang sa server pwede ang secret key. Hindi ito kailanman
// ipinapadala sa browser, at hindi ito lumalabas sa kahit anong log o
// error message. Ang bumubuo ng checkout page ay PayMongo mismo, kaya
// walang card number na dumadaan o naiimbak sa server natin.
//
// Bakit "retrieve" at hindi puro webhook: pagbalik ng user galing sa
// checkout, tinatanong natin mismo ang PayMongo kung bayad na ba. Hindi
// natin pinapaniwalaan yung URL na binalikan niya -- kahit i-type pa niya
// nang diretso yung success page, mali pa rin ang sagot ng PayMongo kung
// walang bayad. Yung webhook naman ang sumasalo kapag isinara ng user
// yung tab bago makabalik.

const config = require('./env');

/* Hindi pareho ng bersyon yung paggawa at yung pagkuha, at hindi ito
   pagkakamali sa pagbasa:

     gumawa  ->  POST  /v2/checkout_sessions
     kunin   ->  GET   /v1/checkout_sessions/{id}

   Sa dokumentasyon mismo ng PayMongo, v2 yung inirerekomenda para sa
   bagong integration, pero v1 pa rin yung nakatala para sa pagkuha. Dati
   v2 din yung ginagamit dito sa pagkuha -- at dahil walang ganoong
   daan, bumabagsak yung confirm at hindi nabibigay yung Premium kahit
   bayad na talaga.

   Sinusubukan muna yung v1 na nakadokumento. Kung 404 yun, sinusubukan
   yung v2, para hindi tayo masabit kung saan man nila ilagay ito. */
const API_HOST = 'https://api.paymongo.com';
const CREATE_PATH = '/v2/checkout_sessions';
const RETRIEVE_VERSIONS = ['/v1', '/v2'];
const REQUEST_TIMEOUT_MS = 20000;

function isConfigured() {
  return !!config.payment.secretKey;
}

// Basic auth: yung secret key ang username, walang password, pero kailangan
// pa rin yung tutuldok sa dulo bago i-base64.
function authHeader() {
  return 'Basic ' + Buffer.from(`${config.payment.secretKey}:`).toString('base64');
}

async function request(method, path, body) {
  if (!isConfigured()) {
    throw new Error('PAYMONGO_SECRET_KEY is not set.');
  }

  const response = await fetch(`${API_HOST}${path}`, {
    method,
    headers: {
      authorization: authHeader(),
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch (err) {
    payload = null;
  }

  if (!response.ok) {
    // Yung sagot ng PayMongo ang nagsasabi kung bakit tumanggi -- madalas
    // mali yung key o hindi pa naka-enable yung payment method sa
    // dashboard. Yung detalye, para sa log natin; hindi ito ipinapakita
    // sa user nang buo.
    const detail = payload?.errors?.[0]?.detail || text.slice(0, 200);
    const error = new Error(`PayMongo ${response.status}: ${detail}`);
    error.status = response.status;
    throw error;
  }

  return payload;
}

/* Isang line item lang tayo: yung subscription mismo. Sentimo ang halaga
   (PHP 149.00 -> 14900), at galing ito sa server, hindi sa browser. */
async function createCheckoutSession({
  name,
  description,
  amountCentavos,
  referenceNumber,
  successUrl,
  cancelUrl,
  email,
  metadata,
}) {
  const payload = await request('POST', CREATE_PATH, {
    data: {
      attributes: {
        line_items: [{
          name,
          amount: amountCentavos,
          currency: 'PHP',
          quantity: 1,
        }],
        payment_method_types: config.payment.methods,
        description,
        reference_number: referenceNumber,
        success_url: successUrl,
        cancel_url: cancelUrl,
        send_email_receipt: false,
        ...(email ? { billing: { email } } : {}),
        ...(metadata ? { metadata } : {}),
      },
    },
  });

  const attributes = payload?.data?.attributes || {};
  return {
    id: payload?.data?.id || null,
    checkoutUrl: attributes.checkout_url || null,
    livemode: attributes.livemode === true,
  };
}

/* Ang session mismo ay 'active' o 'expired' lang -- hindi niya sinasabi
   kung bayad na. Nasa loob yun: alinman sa payments[].status === 'paid'
   o payment_intent.status === 'succeeded'. Dalawa ang tinitingnan natin
   para hindi tayo nakasabit sa isang field lang. */
async function retrieveCheckoutSession(sessionId) {
  const id = encodeURIComponent(sessionId);

  let payload = null;
  let lastError = null;

  for (const version of RETRIEVE_VERSIONS) {
    try {
      payload = await request('GET', `${version}/checkout_sessions/${id}`);
      break;
    } catch (err) {
      // 404 lang ang sinusundan ng susunod na subok -- ibig sabihin
      // nun, mali yung daan. Yung 401 (maling key) o 500 ay totoong
      // problema, kaya hindi na natin tinatago sa likod ng retry.
      if (err.status === 404) {
        lastError = err;
        continue;
      }
      throw err;
    }
  }

  if (!payload) throw lastError || new Error('Checkout session not found.');

  const attributes = payload?.data?.attributes || {};

  const payments = Array.isArray(attributes.payments) ? attributes.payments : [];
  const paidPayment = payments.find(
    (payment) => payment?.attributes?.status === 'paid'
  );
  const intentStatus = attributes.payment_intent?.attributes?.status || null;

  return {
    id: payload?.data?.id || sessionId,
    paid: !!paidPayment || intentStatus === 'succeeded',
    paymentId: paidPayment?.id || null,
    paymentMethod:
      paidPayment?.attributes?.source?.type ||
      paidPayment?.attributes?.payment_method_used ||
      null,
    amountCentavos: paidPayment?.attributes?.amount ?? null,
    referenceNumber: attributes.reference_number || null,
    livemode: attributes.livemode === true,
    sessionStatus: attributes.status || null,
  };
}

module.exports = { isConfigured, createCheckoutSession, retrieveCheckoutSession };
