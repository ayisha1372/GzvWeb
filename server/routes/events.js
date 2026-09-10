const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/events  (public)
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM events ORDER BY sort_order, id DESC').all();
  res.json(rows);
});

// POST /api/events  (admin)
router.post('/', requireAuth, (req, res) => {
  const {
    title, category = '', wing = '', event_date = '', description = '', participants = '', image_url = '', sort_order = 0,
  } = req.body || {};
  if (!title) return res.status(400).json({ error: 'title is required.' });

  const info = db
    .prepare(
      `INSERT INTO events (title, category, wing, event_date, description, participants, image_url, sort_order)
       VALUES (?,?,?,?,?,?,?,?)`
    )
    .run(title, category, wing, event_date, description, participants, image_url, sort_order);
  res.status(201).json(db.prepare('SELECT * FROM events WHERE id = ?').get(info.lastInsertRowid));
});

// PUT /api/events/:id  (admin)
router.put('/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Event not found.' });

  const {
    title = existing.title,
    category = existing.category,
    wing = existing.wing,
    event_date = existing.event_date,
    description = existing.description,
    participants = existing.participants,
    image_url = existing.image_url,
    sort_order = existing.sort_order,
  } = req.body || {};

  db.prepare(
    `UPDATE events SET title=?, category=?, wing=?, event_date=?, description=?, participants=?, image_url=?, sort_order=?
     WHERE id=?`
  ).run(title, category, wing, event_date, description, participants, image_url, sort_order, req.params.id);

  res.json(db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id));
});

// DELETE /api/events/:id  (admin)
router.delete('/:id', requireAuth, (req, res) => {
  const info = db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Event not found.' });
  res.status(204).end();
});

module.exports = router;
