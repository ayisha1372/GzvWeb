require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

require('./db');        // ensures tables + admin user exist
require('./seed');      // seeds starter content on first run only

const authRoutes = require('./routes/auth');
const memberRoutes = require('./routes/members');
const eventRoutes = require('./routes/events');
const rankingRoutes = require('./routes/rankings');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN === '*' ? true : (process.env.CORS_ORIGIN || '').split(',') }));
app.use(express.json());

// ---- API ----
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/rankings', rankingRoutes);
app.use('/api/contact', contactRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));
// ---- Admin panel ----
app.get(['/admin', '/admin/'], (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'admin.html'));
});

// ---- Static frontend (the whole public/ folder, including /admin) ----
app.use(express.static(path.join(__dirname, '..', 'public')));

// ---- Static frontend (the whole public/ folder, including /admin) ----
app.use(express.static(path.join(__dirname, '..', 'public')));

// Fallback: serve index.html for unknown non-API GET routes (nice URLs)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'), (err) => {
    if (err) next();
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
  console.log(`Gazva server running at http://localhost:${PORT}`);
  console.log(`Admin panel:            http://localhost:${PORT}/admin/`);
});
