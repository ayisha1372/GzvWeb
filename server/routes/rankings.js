const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/rankings?term=2025-26  (public) - ordered by points desc, i.e. the leaderboard
router.get('/', (req, res) => {
  const { term } = req.query;
  let rows;
  if (term) {
    rows = db.prepare('SELECT * FROM rankings WHERE term = ? ORDER BY points DESC, sort_order, id').all(term);
  } else {
    rows = db.prepare('SELECT * FROM rankings ORDER BY points DESC, sort_order, id').all();
  }
  res.json(rows);
});

// POST /api/rankings  (admin)
router.post('/', requireAuth, (req, res) => {
  const { student_name, department = '', term = '', points = 0, achievements = '', sort_order = 0 } = req.body || {};
  if (!student_name) return res.status(400).json({ error: 'student_name is required.' });

  const info = db
    .prepare(
      `INSERT INTO rankings (student_name, department, term, points, achievements, sort_order)
       VALUES (?,?,?,?,?,?)`
    )
    .run(student_name, department, term, points, achievements, sort_order);
  res.status(201).json(db.prepare('SELECT * FROM rankings WHERE id = ?').get(info.lastInsertRowid));
});

// PUT /api/rankings/:id  (admin)
router.put('/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM rankings WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Ranking entry not found.' });

  const {
    student_name = existing.student_name,
    department = existing.department,
    term = existing.term,
    points = existing.points,
    achievements = existing.achievements,
    sort_order = existing.sort_order,
  } = req.body || {};

  db.prepare(
    `UPDATE rankings SET student_name=?, department=?, term=?, points=?, achievements=?, sort_order=? WHERE id=?`
  ).run(student_name, department, term, points, achievements, sort_order, req.params.id);

  res.json(db.prepare('SELECT * FROM rankings WHERE id = ?').get(req.params.id));
});

// DELETE /api/rankings/:id  (admin)
router.delete('/:id', requireAuth, (req, res) => {
  const info = db.prepare('DELETE FROM rankings WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Ranking entry not found.' });
  res.status(204).end();
});

module.exports = router;
