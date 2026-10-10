// routes/dashboard.js
// IamAtomic — Group 4 Capstone 2, SE-AWARE backend
const express = require('express');
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { hasPremiumAccess } = require('../middleware/premium');

const router = express.Router();

// FR-12: Personalized Dashboard. Lahat ng kailangan ng dashboard, isang call
// lang.
/* Yung maikling paglalarawan na ipinapakita sa card.

   Pinuputol sa 160 na titik. Yung mga nasa seed ay maikli naman, pero
   kayang baguhin ng admin yung description -- at kung may magdikit doon
   ng buong aralin ng isang bayad na module, mababasa yun ng Free na user
   dito sa dashboard. Yung teaser lang ang kailangan, kaya yun lang ang
   pinapadala.

   Kapag walang laman, wala talagang ipinapakita. Dati kasi, pag walang
   description, yung category na lang yung lumalabas -- kaya may
   "spear-phishing" sa ilalim ng "Spear Phishing". Panloob na susi yun,
   hindi pang-basa ng tao. */
/* Magkaibang pangalan para sa iisang paksa.

   Yung assessment ay nagtatala ng "phishing"; yung Quishing module ay
   sumasaklaw ng email phishing AT QR codes, at sa seed ay category
   'phishing' ang nakalagay pero sa live na database ay naging 'quishing'.
   Kapag hindi tugma, yung taong mahina sa phishing ay hindi kailanman
   nirerekomendahan ng module na eksaktong tungkol doon -- tahimik, at
   mukhang gumagana naman.

   Pinapalawak dito ang hinahanap para hindi na ito masira sa susunod na
   pagkakaiba ng pangalan. Mas mabuting dagdagan ang hanapan kaysa
   umasang pareho ang baybay sa dalawang lugar. */
const TOPIC_ALIASES = {
  'phishing': ['phishing', 'quishing'],
  'quishing': ['quishing', 'phishing'],
  'safe-practices': ['safe-practices', 'safety-practices'],
};

function expandTopics(topics) {
  const out = [];
  for (const t of topics) {
    for (const alias of (TOPIC_ALIASES[t] || [t])) {
      if (!out.includes(alias)) out.push(alias);
    }
  }
  return out;
}

const TEASER_LIMIT = 160;

function teaser(description) {
  if (!description) return null;
  const text = String(description).trim().replace(/\s+/g, ' ');
  if (text.length <= TEASER_LIMIT) return text;
  return text.slice(0, TEASER_LIMIT - 1).trimEnd() + '\u2026';
}

function forCard(row) {
  return { ...row, description: teaser(row.description) };
}

router.get('/', requireAuth, async (req, res) => {
  try {
    const [progress] = await pool.query(
      `SELECT p.completion_status, p.completion_date, m.module_title, m.slug
       FROM progress p JOIN module m ON m.module_id = p.module_id
       WHERE p.user_id = ?`,
      [req.user.user_id]
    );

    // FR-14: Quiz history, pinakabago muna
    const [quizHistory] = await pool.query(
      `SELECT qr.score, qr.total, qr.date_completed, m.module_title, m.slug
       FROM quizresult qr
       JOIN quiz q ON q.quiz_id = qr.quiz_id
       JOIN module m ON m.module_id = q.module_id
       WHERE qr.user_id = ?
       ORDER BY qr.date_completed DESC, qr.result_id DESC`,
      [req.user.user_id]
    );

    // FR-11: Pinakabagong assessment
    const [assessmentRows] = await pool.query(
      'SELECT awareness_score AS score, total, awareness_level, by_topic, weak_areas, assessment_date FROM awarenessassessment WHERE user_id = ? ORDER BY assessment_id DESC LIMIT 1',
      [req.user.user_id]
    );

    res.json({
      progress,
      quiz_history: quizHistory,
      assessment: assessmentRows[0] || null,
      hasAssessment: assessmentRows.length > 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard.' });
  }
});

// FR-15: Mga recommended modules. Base sa weak areas ng assessment kung meron,
// kung wala, yung mga module pa na hindi pa nasisimulan.
router.get('/recommendations', requireAuth, async (req, res) => {
  try {
    // Admin at Premium lang ang pwedeng makakita ng bayad na module dito.
    // Nasa loob ng try: isang tawag ito sa database, at kung sasablay yun
    // sa labas, bumabagsak ang buong route nang walang sumasalo.
    const canSeePremium = await hasPremiumAccess(req.user);
    const [rows] = await pool.query(
      `SELECT weak_areas, by_topic FROM awarenessassessment
       WHERE user_id = ? ORDER BY assessment_id DESC LIMIT 1`,
      [req.user.user_id]
    );

    const latest = rows[0];
    const weakAreas = latest?.weak_areas || [];

    if (weakAreas.length) {
      // Pinakamahina muna, para yung talagang pinaghirapan nila una sa list,
      // hindi basta kung ano lang naibalik ng database.
      const byTopic = latest.by_topic || {};
      const ranked = [...weakAreas].sort((a, b) => {
        const ratio = (t) => {
          const tally = byTopic[t];
          return tally && tally.total ? tally.correct / tally.total : 0;
        };
        return ratio(a) - ratio(b);
      });

      // Tinugma sa slug pati category. Nagkalayo na to minsan: naka-record
      // yung weakness sa "quishing" pero yung category ng module ay
      // "phishing", kaya kahit gaano kababa yung score dun, hindi na-
      // rerecommend. Kapag pareho tinigil, kahit ma-rename pa sa future,
      // mababawasan lang, hindi bigla nawawala yung recommendation.
      // Kasama na ang mga katumbas na pangalan sa hinahanap, pero yung
      // orihinal na pagkakasunod pa rin ang gamit sa pag-aayos sa ibaba.
      const lookup = expandTopics(ranked);
      const placeholders = lookup.map(() => '?').join(',');
      const [modules] = await pool.query(
        `SELECT module_id, module_title, description, slug, category, module_type
         FROM module
         WHERE (category IN (${placeholders}) OR slug IN (${placeholders}))
           /* Libre lang ang irerekomenda sa hindi Premium. Kung wala
              ito, pwedeng lumabas ang bayad na module sa dashboard ng
              Free user -- at ang card ay magdadala sa kanya sa pahinang
              itataboy siya pabalik, yung dating butas. */
           AND (? = 1 OR module_type = 'Free')
           AND NOT EXISTS (
             SELECT 1
             FROM progress p
             WHERE p.user_id = ?
               AND p.module_id = module.module_id
               AND p.completion_status = 'completed'
           )`,
        [...lookup, ...lookup, canSeePremium ? 1 : 0, req.user.user_id]
      );

      if (modules.length) {
        /* Nananatiling nakabatay sa ORIHINAL na pagkakasunod ng kahinaan
           ang pag-aayos -- yung pinakamahina muna -- kahit pinalawak ang
           hinanap. Kung katumbas lang ang tumama, sa posisyon pa rin ng
           pinagmulang paksa ito nakaupo. */
        const position = (m) => {
          const rank = (value) => {
            const direct = ranked.indexOf(value);
            if (direct !== -1) return direct;
            return ranked.findIndex((t) => (TOPIC_ALIASES[t] || []).includes(value));
          };
          const found = [rank(m.slug), rank(m.category)].filter((i) => i !== -1);
          return found.length ? Math.min(...found) : ranked.length;
        };

        const ordered = modules
          .sort((a, b) => position(a) - position(b))
          .slice(0, 3);

        return res.json(ordered.map(forCard));
      }
    }

    // Wala pang assessment, o walang tumugma. I-suggest yung Free modules na
    // hindi pa nasisimulan, magandang pinagsisimulan naman.
    const [modules] = await pool.query(
      `SELECT m.module_id, m.module_title, m.description, m.slug, m.category, m.module_type
       FROM module m
       WHERE m.module_type = 'Free'
         AND m.module_id NOT IN (SELECT module_id FROM progress WHERE user_id = ?)
       LIMIT 3`,
      [req.user.user_id]
    );
    res.json(modules.map(forCard));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load recommendations.' });
  }
});

module.exports = router;
