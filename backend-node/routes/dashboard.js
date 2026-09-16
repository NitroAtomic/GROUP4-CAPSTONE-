// routes/dashboard.js
const express = require('express');
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// FR-12: Personalized Dashboard — everything the dashboard needs in one call
router.get('/', requireAuth, async (req, res) => {
  try {
    const [progress] = await pool.query(
      `SELECT p.completion_status, p.completion_date, m.module_title, m.slug
       FROM progress p JOIN module m ON m.module_id = p.module_id
       WHERE p.user_id = ?`,
      [req.user.user_id]
    );

    // FR-14: Quiz history, most recent first
    const [quizHistory] = await pool.query(
      `SELECT qr.score, qr.total, qr.date_completed, m.module_title, m.slug
       FROM quizresult qr
       JOIN quiz q ON q.quiz_id = qr.quiz_id
       JOIN module m ON m.module_id = q.module_id
       WHERE qr.user_id = ?
       ORDER BY qr.date_completed DESC`,
      [req.user.user_id]
    );

    // FR-11: Most recent assessment
    const [assessmentRows] = await pool.query(
      'SELECT awareness_score AS score, total, awareness_level, by_topic, weak_areas, assessment_date FROM awarenessassessment WHERE user_id = ? ORDER BY assessment_id DESC LIMIT 1',
      [req.user.user_id]
    );

    res.json({
      progress,
      quiz_history: quizHistory,
      assessment: assessmentRows[0] || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard.' });
  }
});

// FR-15: Recommended modules — based on assessment weak areas if one
// exists, otherwise modules the user hasn't started yet.
router.get('/recommendations', requireAuth, async (req, res) => {
  try {
    const [assessmentRows] = await pool.query(
      'SELECT weak_areas FROM awarenessassessment WHERE user_id = ? ORDER BY assessment_id DESC LIMIT 1',
      [req.user.user_id]
    );

    if (assessmentRows.length > 0) {
      const weakAreas = assessmentRows[0].weak_areas; // JSON array, e.g. ["phishing","vishing"]
      if (weakAreas && weakAreas.length > 0) {
        const placeholders = weakAreas.map(() => '?').join(',');
        const [modules] = await pool.query(
          `SELECT module_id, module_title, slug, category FROM module WHERE category IN (${placeholders}) LIMIT 2`,
          weakAreas
        );
        return res.json(modules);
      }
    }

    // Fallback: modules with no progress row yet for this user
    const [modules] = await pool.query(
      `SELECT m.module_id, m.module_title, m.slug, m.category
       FROM module m
       WHERE m.module_type = 'Free'
       AND m.module_id NOT IN (SELECT module_id FROM progress WHERE user_id = ?)
       LIMIT 2`,
      [req.user.user_id]
    );
    res.json(modules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load recommendations.' });
  }
});

module.exports = router;
