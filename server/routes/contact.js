const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact  (public) - what the site's contact form submits to
router.post('/', (req, res) => {
  const { firstName, lastName = '', email, phone = '', subject = '', message } = req.body || {};

  if (!firstName || !email || !message) {
    return res.status(400).json({ error: 'firstName, email and message are required.' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  db.prepare(
    `INSERT INTO messages (first_name, last_name, email, phone, subject, message) VALUES (?,?,?,?,?,?)`
  ).run(firstName.trim(), lastName.trim(), email.trim(), phone.trim(), subject.trim(), message.trim());

  res.status(201).json({ ok: true });
});

// GET /api/contact  (admin) - inbox, newest first
router.get('/', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM messages ORDER BY created_at DESC, id DESC').all();
  res.json(rows);
});

// PATCH /api/contact/:id/read  (admin) - toggle read state
router.patch('/:id/read', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM messages WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Message not found.' });
  const isRead = req.body && typeof req.body.is_read !== 'undefined' ? (req.body.is_read ? 1 : 0) : existing.is_read ? 0 : 1;
  db.prepare('UPDATE messages SET is_read = ? WHERE id = ?').run(isRead, req.params.id);
  res.json(db.prepare('SELECT * FROM messages WHERE id = ?').get(req.params.id));
});

// DELETE /api/contact/:id  (admin)
router.delete('/:id', requireAuth, (req, res) => {
  const info = db.prepare('DELETE FROM messages WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Message not found.' });
  res.status(204).end();
});

module.exports = router;
