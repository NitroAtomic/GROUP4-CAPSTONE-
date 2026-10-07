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

/* Email HTML is not web HTML. Tables rather than flexbox, inline styles
   rather than a stylesheet (Gmail strips <head> styles), web-safe fonts, and
   a fixed 600px width - that is the set of things every client renders the
   same way. Keeping the code in real text rather than an image matters too:
   images are blocked by default in plenty of clients, and a code nobody can
   see is a code nobody can use. */
function buildMessage(code, purpose) {
  const isReset = purpose === 'password_reset';
  const heading = isReset ? 'Reset your password' : 'Verify your sign-in';
  const lead = isReset
    ? 'Use this code to set a new password on your SE-AWARE account.'
    : 'Use this code to finish signing in to SE-AWARE.';

  const text = [
    `${heading}`,
    '',
    `${lead}`,
    '',
    `Your code is ${code}`,
    '',
    'It expires in 5 minutes and can only be used once.',
    '',
    'SE-AWARE will never ask you for this code by phone, chat or email.',
    'If you did not request it, you can ignore this message.',
    '',
    'Social Engineering Awareness Platform for Remote Workers',
  ].join('\n');

  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#EAEFF6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EAEFF6;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">

        <tr><td style="background:#0B2545;padding:20px 28px;">
          <span style="color:#ffffff;font-size:17px;font-weight:bold;letter-spacing:.4px;">SE-AWARE</span>
          <span style="color:rgba(255,255,255,.72);font-size:13px;"> &nbsp;Security awareness for remote work</span>
        </td></tr>

        <tr><td style="padding:32px 28px 8px;">
          <h1 style="margin:0 0 8px;font-size:20px;color:#0B2545;">${heading}</h1>
          <p style="margin:0;font-size:15px;line-height:1.6;color:#4A5568;">${lead}</p>
        </td></tr>

        <tr><td style="padding:20px 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                 style="background:#F2F5FA;border:1px solid #C8D3E3;border-radius:10px;">
            <tr><td align="center" style="padding:22px 16px;">
              <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#5e6a7a;">Your code</div>
              <div style="margin-top:8px;font-size:34px;font-weight:bold;letter-spacing:8px;color:#0B2545;font-family:'Courier New',Courier,monospace;">${code}</div>
            </td></tr>
          </table>
          <p style="margin:12px 0 0;font-size:13px;color:#5e6a7a;text-align:center;">
            Expires in 5 minutes &middot; can only be used once
          </p>
        </td></tr>

        <!-- A security platform's own mail should model the behaviour it
             teaches. Saying plainly that we will never ask for the code is
             the single most useful line in the message. -->
        <tr><td style="padding:4px 28px 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                 style="border-left:3px solid #1B7F79;background:#F2F5FA;border-radius:0 8px 8px 0;">
            <tr><td style="padding:14px 16px;font-size:13px;line-height:1.6;color:#4A5568;">
              <strong style="color:#0B2545;">SE-AWARE will never ask you for this code</strong> by phone, chat or email.
              If you did not request it, you can ignore this message and nothing will change.
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="background:#F2F5FA;padding:16px 28px;border-top:1px solid #C8D3E3;">
          <p style="margin:0;font-size:12px;line-height:1.5;color:#5e6a7a;">
            Social Engineering Awareness Platform for Remote Workers<br>
            This is an automated message, so replies to it are not read.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return {
    subject: isReset
      ? 'Your SE-AWARE password reset code'
      : 'Your SE-AWARE verification code',
    text,
    html,
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
