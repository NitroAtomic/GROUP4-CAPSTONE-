// routes/modules.js
// IamAtomic — Group 4 Capstone 2, SE-AWARE backend
const express = require('express');
const pool = require('../config/db');
const { optionalAuth, requireAdmin } = require('../middleware/auth');
// Isang pinagmumulan ng panuntunan, nasa middleware/premium.js — kasama na
// doon yung petsa ng pagtatapos ng subscription.
const { hasPremiumAccess } = require('../middleware/premium');

const router = express.Router();

// Public teaser list ng Premium catalog: title/summary/category lang, para sa
// lahat ng module_type = 'Premium' (kasama admin-created), kahit hindi
// naka-login o Free lang, para makita yung value ng pag-upgrade. Walang
// description/video_url pa rito, nasa GET /:slug pa yun.
router.get('/premium-list', async (req, res) => {
  try {
    const [rows] = await pool.query(
      // Walang description dito, gaya ng sinasabi ng komento sa itaas —
      // nakalista siya dati sa SELECT. Bukas sa lahat ang route na ito, kaya
      // kung may isusulat na totoong aralin ang admin sa description, mababasa
      // yun ninuman. Nasa GET /:slug yun, kung saan may gate.
      "SELECT module_id, module_title, category, slug FROM module WHERE module_type = 'Premium' ORDER BY module_title"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load premium modules.' });
  }
});

// List ng modules. Free modules kita ng lahat, Premium para lang sa
// Premium/admin. Server-side to check, hindi lang tago sa frontend UI.
router.get('/', optionalAuth, async (req, res) => {
  try {
    const premium = await hasPremiumAccess(req.user);
    const [rows] = premium
      ? await pool.query('SELECT * FROM module ORDER BY module_type, module_title')
      : await pool.query("SELECT * FROM module WHERE module_type = 'Free' ORDER BY module_title");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load modules.' });
  }
});

// Kunin yung isang module by slug. 403 kung Premium tapos hindi entitled.
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM module WHERE slug = ?', [req.params.slug]);
    if (rows.length === 0) return res.status(404).json({ error: 'Module not found.' });

    const module = rows[0];
    if (module.module_type === 'Premium' && !(await hasPremiumAccess(req.user))) {
      return res.status(403).json({ error: 'This module requires a Premium subscription.' });
    }
    res.json(module);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load module.' });
  }
});

// FR-17: Admin gumagawa ng module (auto-creates yung quiz row nito)
router.post('/', requireAdmin, async (req, res) => {
  const { module_title, description, module_type, category, slug, video_url } = req.body;
  if (!module_title || !slug) {
    return res.status(400).json({ error: 'module_title and slug are required.' });
  }
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      'INSERT INTO module (module_title, description, module_type, category, slug, video_url) VALUES (?, ?, ?, ?, ?, ?)',
      [module_title, description || null, module_type === 'Premium' ? 'Premium' : 'Free', category || null, slug, video_url || null]
    );
    await conn.query(
      'INSERT INTO quiz (module_id, title, number_of_questions) VALUES (?, ?, 0)',
      [result.insertId, module_title + ' Quiz']
    );
    await conn.commit();
    res.status(201).json({ module_id: result.insertId });
  } catch (err) {
    await conn.rollback();
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A module with that slug already exists.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to create module.' });
  } finally {
    conn.release();
  }
});

// FR-17: Admin edits ng module (FR-19 din — yung Free/Premium switch, normal
// field update lang to sa parehong route)
router.put('/:id', requireAdmin, async (req, res) => {
  /* Yung mga field na ipinadala lang ang ina-update. Dati nakalista lahat sa
     SET, at ang hindi ipinadala ay nagiging undefined — ginagawang NULL yun
     ng mysql2. Kaya ang isang partial save mula sa admin panel, hal.
     { module_title, slug } lang, ay nagni-NULL sa description, category at
     module_type.

     Doon nagiging delikado: kapag NULL ang module_type, hindi na Premium
     ang module sa paningin ng GET /:slug (linya 59), kaya naibibigay na nito
     ang buong laman sa kahit sinong hindi naka-login. Nawawala rin ang
     module sa parehong listahan, dahil hindi na siya tumutugma sa 'Free' o
     sa 'Premium'. Isang ordinaryong pag-edit, nagiging publiko ang bayad na
     nilalaman. */
  const COLUMNS = ['module_title', 'description', 'module_type', 'category', 'slug', 'video_url'];

  const sets = [];
  const values = [];
  for (const column of COLUMNS) {
    if (!Object.prototype.hasOwnProperty.call(req.body, column)) continue;
    sets.push(`${column} = ?`);
    values.push(req.body[column]);
  }

  if (sets.length === 0) {
    return res.status(400).json({ error: 'No fields to update.' });
  }

  // Pareho ng validation sa POST. Kung tatanggapin ang kahit anong halaga
  // dito, mababalewala ang Free/Premium na gate nang hindi sinasadya.
  if (Object.prototype.hasOwnProperty.call(req.body, 'module_type')
      && !['Free', 'Premium'].includes(req.body.module_type)) {
    return res.status(400).json({ error: "module_type must be 'Free' or 'Premium'." });
  }

  values.push(req.params.id);

  try {
    const [result] = await pool.query(
      `UPDATE module SET ${sets.join(', ')} WHERE module_id = ?`,
      values
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Module not found.' });
    }
    res.json({ message: 'Module updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update module.' });
  }
});

// FR-17: Admin deletes ng module
router.delete('/:id', requireAdmin, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [modules] = await conn.query(
      'SELECT module_id FROM module WHERE module_id = ? FOR UPDATE',
      [req.params.id]
    );
    if (modules.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Module not found.' });
    }

    const [progress] = await conn.query(
      'SELECT progress_id FROM progress WHERE module_id = ? FOR UPDATE',
      [req.params.id]
    );
    const [quizzes] = await conn.query(
      'SELECT quiz_id FROM quiz WHERE module_id = ? FOR UPDATE',
      [req.params.id]
    );
    const quizIds = quizzes.map((quiz) => quiz.quiz_id);
    const quizResults = quizIds.length
      ? (await conn.query(
        'SELECT result_id FROM quizresult WHERE quiz_id IN (?) FOR UPDATE',
        [quizIds]
      ))[0]
      : [];

    if (progress.length || quizResults.length) {
      await conn.rollback();
      return res.status(409).json({
        error: 'Cannot delete this module because learner progress or quiz history exists.'
      });
    }

    if (quizIds.length) {
      await conn.query('DELETE FROM quizquestion WHERE quiz_id IN (?)', [quizIds]);
      await conn.query('DELETE FROM quiz WHERE module_id = ?', [req.params.id]);
    }
    await conn.query('DELETE FROM module WHERE module_id = ?', [req.params.id]);
    await conn.commit();

    res.json({ message: 'Module deleted.' });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'Failed to delete module.' });
  } finally {
    conn.release();
  }
});

module.exports = router;
