// config/email.js
// IamAtomic — Group 4 Capstone 2, SE-AWARE backend
//
// Tatlong paraan ng pagpapadala, susubukan sa ganitong pagkakasunod:
//
//   1. Brevo HTTPS API  — ito ang ginagamit sa Render.
//   2. SMTP             — gumagana sa local, kung may mail account ka.
//   3. Console          — bagong clone, walang setup: nasa log yung code.
//
// Bakit hindi na lang SMTP: hinaharangan ng libreng plano ng Render yung
// papalabas na SMTP (25, 465, 587), kaya nag-ti-timeout lahat ng padala.
// Bukas naman yung 443, kaya dumadaan na lang sa HTTPS API ng provider.
// Ang console fallback ay sinadya — hindi dapat ma-lock out ang kahit sino
// dahil lang sa wala pang naka-set up na mail account.

const nodemailer = require('nodemailer');
const config = require('./env');

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';
const SEND_TIMEOUT_MS = 15000;

function brevoConfigured() {
  return !!(config.mail.brevoKey && config.mail.from);
}

function smtpConfigured() {
  return !!(config.smtp.host && config.smtp.user && config.smtp.pass);
}

let transporter = null;
if (!brevoConfigured() && smtpConfigured()) {
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: false,
    auth: { user: config.smtp.user, pass: config.smtp.pass },
    // Para hindi mag-hang yung login kapag ang bagal or hindi sumasagot yung
    // mail server. Mas mabuting sabihin agad na hindi naipadala kaysa iwan
    // na naghihintay yung user.
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

function buildMessage(code, purpose) {
  const isReset = purpose === 'password_reset';
  return {
    subject: isReset
      ? 'Your SE-AWARE password reset code'
      : 'Your SE-AWARE verification code',
    text: `${isReset ? 'Use this code to reset your password' : 'Your verification code is'} `
      + `${code}. It expires in 5 minutes. If you didn't request this, you can ignore this email.`,
    html: `<p>${isReset ? 'Use this code to reset your password' : 'Your verification code is'} `
      + `<strong style="font-size:1.2em;letter-spacing:2px;">${code}</strong>.</p>`
      + `<p>It expires in 5 minutes. If you didn't request this, you can ignore this email.</p>`,
  };
}

async function sendViaBrevo(toEmail, message) {
  const response = await fetch(BREVO_ENDPOINT, {
    method: 'POST',
    headers: {
      'api-key': config.mail.brevoKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { email: config.mail.from, name: config.mail.fromName },
      to: [{ email: toEmail }],
      subject: message.subject,
      textContent: message.text,
      htmlContent: message.html,
    }),
    signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
  });

  if (!response.ok) {
    // Yung sagot ng Brevo ang nagsasabi kung bakit tumanggi — madalas hindi
    // pa verified yung sender, o mali yung key. Walang code na nakalagay dito.
    const detail = await response.text().catch(() => '');
    throw new Error(`Brevo returned ${response.status}: ${detail.slice(0, 200)}`);
  }
}

async function sendOtpEmail(toEmail, code, purpose) {
  purpose = purpose || 'login';
  const isReset = purpose === 'password_reset';
  const message = buildMessage(code, purpose);

  if (!brevoConfigured() && !transporter) {
    console.log(`\n[email] No mail provider configured. ${isReset ? 'PASSWORD RESET' : 'OTP'} for ${toEmail}: ${code}\n`);
    return { delivered: false, mode: 'console' };
  }

  try {
    if (brevoConfigured()) {
      await sendViaBrevo(toEmail, message);
      return { delivered: true, mode: 'api' };
    }

    await transporter.sendMail({
      from: config.smtp.from || config.smtp.user,
      to: toEmail,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
    return { delivered: true, mode: 'smtp' };
  } catch (err) {
    /* Hindi na itinatapon pataas. Ang tumatawag dito ay sinusuri yung mode,
       at ang 'failed' ay nagiging malinis na 503 na may sinasabing subukan
       ulit — hindi yung 500 na "something went wrong". Yung mismong dahilan
       ay nasa log para makita natin; hindi ipinapakita sa user. */
    console.error('[email] send failed:', err.message);
    return { delivered: false, mode: 'failed' };
  }
}

module.exports = { sendOtpEmail, smtpConfigured, brevoConfigured };
