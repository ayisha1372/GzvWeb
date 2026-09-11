const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const db = new Database(path.join(__dirname, 'gazva.sqlite'));
db.pragma('journal_mode = WAL');

// ---------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    category    TEXT NOT NULL CHECK (category IN ('core','department','wing')),
    group_name  TEXT,            -- department or wing name; NULL for core
    subgroup    TEXT,            -- optional club name within a wing (e.g. "Debate Club")
    name        TEXT NOT NULL,
    role        TEXT,
    image_url   TEXT,
    sort_order  INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS events (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT NOT NULL,
    category      TEXT,          -- debate, cultural, literary, islamic, academic...
    wing          TEXT,
    event_date    TEXT,
    description   TEXT,
    participants  TEXT,
    image_url     TEXT,
    sort_order    INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS rankings (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    student_name TEXT NOT NULL,
    department   TEXT,
    term         TEXT,           -- e.g. "2025-26"
    points       INTEGER DEFAULT 0,
    achievements TEXT,
    sort_order   INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name  TEXT,
    email      TEXT NOT NULL,
    phone      TEXT,
    subject    TEXT,
    message    TEXT NOT NULL,
    is_read    INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  );
`);

// ---------------------------------------------------------------------
// Migration: older databases created before "subgroup" existed
// ---------------------------------------------------------------------
try {
  db.exec('ALTER TABLE members ADD COLUMN subgroup TEXT');
} catch (e) {
  // Column already exists - safe to ignore
}

// ---------------------------------------------------------------------
// Ensure an admin account exists (from .env, created once)
// ---------------------------------------------------------------------
function ensureAdmin() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const existing = db.prepare('SELECT id FROM admin_users WHERE username = ?').get(username);
  if (!existing) {
    const hash = bcrypt.hashSync(password, 10);
    db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run(username, hash);
    console.log(`Created admin user "${username}" (password from .env / default).`);
  }
}
ensureAdmin();

module.exports = db;
