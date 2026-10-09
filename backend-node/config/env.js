// config/env.js
// IamAtomic — Group 4 Capstone 2, SE-AWARE backend
//
// Binabasa yung config, tapos ayaw mag-start sa production kung may kulang
// na security-critical.
//
// Bakit ganito: dati may fallback na 'dev-secret-change-in-production' kapag
// walang env var. Okay lang yun sa laptop, pero public yung repo natin, kaya
// kahit sino makabasa ng source, alam na yung fallback tapos pwede na
// mag-forge ng sariling admin token. Mas okay na sumigaw agad pag nag-boot
// kesa tumakbo gamit known secret.

require('dotenv').config();
const crypto = require('crypto');

const isProduction = process.env.NODE_ENV === 'production';

function required(name, { minLength = 0 } = {}) {
  const value = process.env[name];

  if (!value) {
    if (isProduction) {
      throw new Error(
        `${name} is not set. Refusing to start in production without it.`
      );
    }
    return null;
  }

  if (minLength && value.length < minLength) {
    const message = `${name} is shorter than ${minLength} characters, which is too weak.`;
    if (isProduction) throw new Error(message);
    console.warn(`[config] ${message} Fine for local work, not for deployment.`);
  }

  return value;
}

const jwtSecret = required('JWT_SECRET', { minLength: 32 });
const dbPassword = required('DB_PASSWORD');

// Sino pwede mag-call ng API na to mula sa browser. Sa production, required
// to — kundi kahit sinong site pwede na mag-request.
const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (isProduction && corsOrigins.length === 0) {
  throw new Error('CORS_ORIGINS is not set. Refusing to start in production without it.');
}

module.exports = {
  isProduction,

  port: Number(process.env.PORT) || 3000,

  /* Gumagana pa rin sa local kahit walang .env; sa production hindi.

     Dati nakasulat dito mismo yung fallback na string. Public yung repo, kaya
     nababasa yun ninuman — at ang required() ay sumasabog lang kapag
     EKSAKTONG 'production' ang NODE_ENV. Kaya kung hindi naset, mali ang
     baybay, o 'Production' lang, mag-bo-boot pa rin ito at pipirma ng token
     gamit ang sikretong alam ng lahat. Isang jwt.sign({role:'admin'}, ...)
     na lang, admin ka na.

     Random na lang bawat boot kapag walang JWT_SECRET: hindi na pwedeng
     i-forge, at hindi rin biglang titigil ang naka-deploy na kung sakaling
     nakalimutan ang variable. Ang presyo: mawawalan ng bisa ang mga token
     tuwing nagre-restart — tamang-tama bilang pahiwatig na hindi pa naset. */
  jwtSecret: jwtSecret || crypto.randomBytes(32).toString('hex'),

  corsOrigins,

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'seaware',
    password: dbPassword || '',
    name: process.env.DB_NAME || 'awareness_platform',
  },

  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || '',
  },

  /* Render's free plan blocks outbound SMTP (25, 465, 587), which is why a
     Gmail account here only ever timed out. Port 443 is open, so mail goes
     out over the provider's HTTPS API instead. MAIL_FROM has to be an
     address verified with that provider, otherwise the send is rejected. */
  /* Dito nakatira yung presyo, hindi sa browser.
     Dati nasa javascript/framework/vue/stores/plan.js lang yung 149 at
     1199. Kung ang browser ang nagsasabi ng babayaran, pwedeng gawing 1
     peso yun bago ipadala. Ngayon, ang billing period lang ("monthly" o
     "yearly") ang galing sa browser; ang server na ang nagsasabi kung
     magkano yun. */
  payment: {
    secretKey: process.env.PAYMONGO_SECRET_KEY || '',
    // Kung ano ang naka-enable sa PayMongo dashboard. Yung 'card' at
    // 'gcash' ay bukas agad sa test mode; idagdag lang dito kung may
    // bubuksan pang iba (hal. paymaya, grab_pay, qrph).
    methods: (process.env.PAYMONGO_METHODS || 'card,gcash')
      .split(',')
      .map((method) => method.trim())
      .filter(Boolean),
    webhookSecret: process.env.PAYMONGO_WEBHOOK_SECRET || '',
    prices: {
      monthly: { centavos: 14900, days: 30, label: 'Monthly' },
      yearly: { centavos: 119900, days: 365, label: 'Yearly' },
    },
  },

  mail: {
    brevoKey: process.env.BREVO_API_KEY || '',
    from: process.env.MAIL_FROM || process.env.SMTP_FROM || '',
    fromName: process.env.MAIL_FROM_NAME || 'SE-AWARE',
    // Images in email need an absolute URL. Defaults to the first allowed
    // origin so there is nothing extra to configure; set PUBLIC_URL if the
    // site ever moves.
    publicUrl: (process.env.PUBLIC_URL || corsOrigins[0] || '').replace(/\/$/, ''),
  },
};
