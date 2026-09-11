const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const VALID_CATEGORIES = ['core', 'department', 'wing'];

// GET /api/members?category=core|department|wing  (public)
router.get('/', (req, res) => {
  const { category } = req.query;
  let rows;
  if (category) {
    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ error: `category must be one of ${VALID_CATEGORIES.join(', ')}` });
    }
    rows = db.prepare('SELECT * FROM members WHERE category = ? ORDER BY group_name, sort_order, id').all(category);
  } else {
    rows = db.prepare('SELECT * FROM members ORDER BY category, group_name, sort_order, id').all();
  }
  res.json(rows);
});

// POST /api/members  (admin)
router.post('/', requireAuth, (req, res) => {
  const { category, group_name = null, subgroup = null, name, role = '', image_url = '', sort_order = 0 } = req.body || {};
  if (!VALID_CATEGORIES.includes(category) || !name) {
    return res.status(400).json({ error: 'category (core|department|wing) and name are required.' });
  }
  const info = db
    .prepare('INSERT INTO members (category, group_name, subgroup, name, role, image_url, sort_order) VALUES (?,?,?,?,?,?,?)')
    .run(category, group_name, subgroup, name, role, image_url, sort_order);
  res.status(201).json(db.prepare('SELECT * FROM members WHERE id = ?').get(info.lastInsertRowid));
});

// PUT /api/members/:id  (admin)
router.put('/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM members WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Member not found.' });

  const {
    category = existing.category,
    group_name = existing.group_name,
    subgroup = existing.subgroup,
    name = existing.name,
    role = existing.role,
    image_url = existing.image_url,
    sort_order = existing.sort_order,
  } = req.body || {};

  db.prepare(
    'UPDATE members SET category=?, group_name=?, subgroup=?, name=?, role=?, image_url=?, sort_order=? WHERE id=?'
  ).run(category, group_name, subgroup, name, role, image_url, sort_order, req.params.id);

  res.json(db.prepare('SELECT * FROM members WHERE id = ?').get(req.params.id));
});

// DELETE /api/members/:id  (admin)
router.delete('/:id', requireAuth, (req, res) => {
  const info = db.prepare('DELETE FROM members WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Member not found.' });
  res.status(204).end();
});

module.exports = router;
