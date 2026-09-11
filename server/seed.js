// Populates the database with the content that used to be hard-coded into
// core.html / department.html / wings.html / gallery.html, so the site and
// the admin panel aren't empty the first time the server runs.
// Safe to re-run: it only inserts if the tables are empty.

const db = require('./db');

const memberCount = db.prepare('SELECT COUNT(*) AS c FROM members').get().c;
if (memberCount === 0) {
  const insert = db.prepare(`
    INSERT INTO members (category, group_name, subgroup, name, role, image_url, sort_order)
    VALUES (@category, @group_name, @subgroup, @name, @role, @image_url, @sort_order)
  `);

  const rows = [
    // ---- Core Committee ----
    { category: 'core', group_name: null, subgroup: null, name: 'Zahra Mehthab', role: 'President', image_url: '', sort_order: 1 },
    { category: 'core', group_name: null, subgroup: null, name: 'Fathima Sana', role: 'Vice President', image_url: '', sort_order: 2 },
    { category: 'core', group_name: null, subgroup: null, name: 'Liya Shahma', role: 'General Secretary', image_url: '', sort_order: 3 },
    { category: 'core', group_name: null, subgroup: null, name: 'Fathwima Suhaila', role: 'Joint Secretary', image_url: '', sort_order: 4 },
    { category: 'core', group_name: null, subgroup: null, name: 'Asna NT', role: 'Programme Secretary', image_url: '', sort_order: 5 },
    { category: 'core', group_name: null, subgroup: null, name: 'Fathima Nafla', role: 'Finance Secretary', image_url: '', sort_order: 6 },
    { category: 'core', group_name: null, subgroup: null, name: 'Fathima Rifa PE', role: 'PRO', image_url: '', sort_order: 7 },
    { category: 'core', group_name: null, subgroup: null, name: 'Fidha Fathima AP', role: 'Media', image_url: '', sort_order: 8 },
    { category: 'core', group_name: null, subgroup: null, name: 'Ayisha', role: 'Media', image_url: '', sort_order: 9 },
    { category: 'core', group_name: null, subgroup: null, name: 'Hisana', role: 'Media', image_url: '', sort_order: 10 },

    // ---- Departments (placeholders from the original file - edit in admin) ----
    { category: 'department', group_name: 'Fiqh and Usul al Fiqh', subgroup: null, name: 'Add member name', role: 'Chairperson', image_url: '', sort_order: 1 },
    { category: 'department', group_name: 'Fiqh and Usul al Fiqh', subgroup: null, name: 'Add member name', role: 'Vice Chairperson', image_url: '', sort_order: 2 },
    { category: 'department', group_name: 'Fiqh and Usul al Fiqh', subgroup: null, name: 'Add member name', role: 'Secretary', image_url: '', sort_order: 3 },
    { category: 'department', group_name: 'Quran and Related Science', subgroup: null, name: 'Add member name', role: 'Chairperson', image_url: '', sort_order: 1 },
    { category: 'department', group_name: 'Quran and Related Science', subgroup: null, name: 'Add member name', role: 'Vice Chairperson', image_url: '', sort_order: 2 },
  ];

  const insertMany = db.transaction((items) => items.forEach((r) => insert.run(r)));
  insertMany(rows);
  console.log(`Seeded ${rows.length} members.`);
}

// ---------------------------------------------------------------------
// Wings: enforce the official 7-wing organizational structure.
// Runs once — if the "wing" members already match the new structure
// (no old wing names present), it does nothing and leaves your edits
// alone. If it detects the old placeholder structure (or no wings at
// all), it rebuilds the 7 wings with the correct leadership slots and
// sub-units as empty "Add member name" placeholders, ready to edit in
// the admin panel.
// ---------------------------------------------------------------------
const OLD_WING_NAMES = ['Gazva Debates', 'Library Board', 'PKV'];
const existingWingGroups = db
  .prepare("SELECT DISTINCT group_name FROM members WHERE category = 'wing'")
  .all()
  .map((r) => r.group_name);
const wingCount = db.prepare("SELECT COUNT(*) AS c FROM members WHERE category = 'wing'").get().c;
const hasOldStructure = existingWingGroups.some((g) => OLD_WING_NAMES.includes(g));

if (wingCount === 0 || hasOldStructure) {
  const insertWing = db.prepare(`
    INSERT INTO members (category, group_name, subgroup, name, role, image_url, sort_order)
    VALUES ('wing', @group_name, @subgroup, @name, @role, @image_url, @sort_order)
  `);

  const P = 'Add member name'; // placeholder name, edit in admin panel

  const wingRows = [
    // 01 — Organizing Committee
    { group_name: 'Organizing Committee', subgroup: null, name: P, role: 'Chairperson', image_url: '', sort_order: 1 },
    { group_name: 'Organizing Committee', subgroup: null, name: P, role: 'Convener', image_url: '', sort_order: 2 },
    { group_name: 'Organizing Committee', subgroup: null, name: P, role: 'Convener', image_url: '', sort_order: 3 },

    // 02 — Islamic Information Cell
    { group_name: 'Islamic Information Cell', subgroup: null, name: P, role: 'Chairperson', image_url: '', sort_order: 1 },
    { group_name: 'Islamic Information Cell', subgroup: null, name: P, role: 'Convener', image_url: '', sort_order: 2 },
    { group_name: 'Islamic Information Cell', subgroup: null, name: P, role: 'Convener', image_url: '', sort_order: 3 },

    // 03 — Prasanga Kala Vedi (+ Speaker's Forum sub-unit)
    { group_name: 'Prasanga Kala Vedi', subgroup: null, name: P, role: 'Chairperson', image_url: '', sort_order: 1 },
    { group_name: 'Prasanga Kala Vedi', subgroup: null, name: P, role: 'Convener', image_url: '', sort_order: 2 },
    { group_name: 'Prasanga Kala Vedi', subgroup: null, name: P, role: 'Convener', image_url: '', sort_order: 3 },
    { group_name: 'Prasanga Kala Vedi', subgroup: "Speaker's Forum", name: P, role: 'General Secretary', image_url: '', sort_order: 1 },
    { group_name: 'Prasanga Kala Vedi', subgroup: "Speaker's Forum", name: P, role: 'Joint Secretary', image_url: '', sort_order: 2 },

    // 04 — Media Wing
    { group_name: 'Media Wing', subgroup: null, name: P, role: 'Chairperson', image_url: '', sort_order: 1 },
    { group_name: 'Media Wing', subgroup: null, name: P, role: 'Convener', image_url: '', sort_order: 2 },
    { group_name: 'Media Wing', subgroup: null, name: P, role: 'Convener', image_url: '', sort_order: 3 },

    // 05 — Editorial Board
    { group_name: 'Editorial Board', subgroup: null, name: P, role: 'Chairperson', image_url: '', sort_order: 1 },
    { group_name: 'Editorial Board', subgroup: null, name: P, role: 'Convener', image_url: '', sort_order: 2 },
    { group_name: 'Editorial Board', subgroup: null, name: P, role: 'Convener', image_url: '', sort_order: 3 },

    // 06 — Gazva Debate (single Chairperson + 4 debate sub-units)
    { group_name: 'Gazva Debate', subgroup: null, name: P, role: 'Chairperson', image_url: '', sort_order: 1 },
    ...['Nadi Munazara', 'Urdu Debate', 'British Parliamentary', 'Samvata Samiti'].flatMap((club, i) => [
      { group_name: 'Gazva Debate', subgroup: club, name: P, role: 'General Secretary', image_url: '', sort_order: 1 },
      { group_name: 'Gazva Debate', subgroup: club, name: P, role: 'Joint Secretary', image_url: '', sort_order: 2 },
    ]),

    // 07 — SRDP (+ 7 clubs)
    { group_name: 'SRDP', subgroup: null, name: P, role: 'Chairperson', image_url: '', sort_order: 1 },
    { group_name: 'SRDP', subgroup: null, name: P, role: 'Convener', image_url: '', sort_order: 2 },
    { group_name: 'SRDP', subgroup: null, name: P, role: 'Convener', image_url: '', sort_order: 3 },
    ...[
      'English Club', 'Malayalam Club', 'Urdu Club', 'Arabic Club',
      'Science and Maths Club', 'Translation Club', 'Art Club',
    ].flatMap((club) => [
      { group_name: 'SRDP', subgroup: club, name: P, role: 'General Secretary', image_url: '', sort_order: 1 },
      { group_name: 'SRDP', subgroup: club, name: P, role: 'Joint Secretary', image_url: '', sort_order: 2 },
    ]),
  ];

  const rebuildWings = db.transaction((rows) => {
    db.prepare("DELETE FROM members WHERE category = 'wing'").run();
    rows.forEach((r) => insertWing.run(r));
  });
  rebuildWings(wingRows);
  console.log(`Rebuilt the 7-wing structure (${wingRows.length} placeholder slots).`);
}

const eventCount = db.prepare('SELECT COUNT(*) AS c FROM events').get().c;
if (eventCount === 0) {
  const insert = db.prepare(`
    INSERT INTO events (title, category, wing, event_date, description, participants, image_url, sort_order)
    VALUES (@title, @category, @wing, @event_date, @description, @participants, @image_url, @sort_order)
  `);

  const rows = [
    {
      title: 'Annual Munazarah 2026', category: 'debate', wing: 'Gazva Debates · Nadi Munazarah',
      event_date: 'March 2026',
      description: 'The flagship Arabic debate competition of Gazva, bringing together eloquent speakers from across the college to argue on contemporary Islamic issues in classical Arabic.',
      participants: '60+ participants', image_url: '', sort_order: 1,
    },
    {
      title: 'Gazva Cultural Night 2026', category: 'cultural', wing: 'Organizing Committee',
      event_date: 'February 2026',
      description: 'A dazzling evening of cultural performances, nasheeds, and creative expressions celebrating the diversity and talent of our students.',
      participants: '200+ attendees', image_url: '', sort_order: 2,
    },
    {
      title: 'Urdu Poetry Evening', category: 'literary', wing: 'PKV · Urdu Club',
      event_date: 'January 2026',
      description: 'An enchanting evening of Urdu poetry recitation, where students expressed profound emotions through classical and modern Urdu verse.',
      participants: '80+ attendees', image_url: '', sort_order: 3,
    },
    {
      title: 'Islamic Information Week', category: 'islamic', wing: 'Islamic Information Cell',
      event_date: 'December 2025',
      description: 'A week-long series of talks, exhibitions, and discussions on Islamic history, science, and contemporary issues.',
      participants: '150+ attendees', image_url: '', sort_order: 4,
    },
    {
      title: 'Research Symposium', category: 'academic', wing: 'PKV · SRDP',
      event_date: 'November 2025',
      description: 'Students from the SRDP presented their research papers on topics spanning Arabic linguistics, Islamic jurisprudence, and modern science before a distinguished panel.',
      participants: '45 presenters', image_url: '', sort_order: 5,
    },
  ];

  const insertMany = db.transaction((items) => items.forEach((r) => insert.run(r)));
  insertMany(rows);
  console.log(`Seeded ${rows.length} events.`);
}

const rankingCount = db.prepare('SELECT COUNT(*) AS c FROM rankings').get().c;
if (rankingCount === 0) {
  const insert = db.prepare(`
    INSERT INTO rankings (student_name, department, term, points, achievements, sort_order)
    VALUES (@student_name, @department, @term, @points, @achievements, @sort_order)
  `);
  const rows = [
    { student_name: 'Add student name', department: 'Fiqh and Usul al Fiqh', term: '2025-26', points: 0, achievements: 'Add achievements here', sort_order: 1 },
    { student_name: 'Add student name', department: 'Quran and Related Science', term: '2025-26', points: 0, achievements: 'Add achievements here', sort_order: 2 },
  ];
  const insertMany = db.transaction((items) => items.forEach((r) => insert.run(r)));
  insertMany(rows);
  console.log(`Seeded ${rows.length} ranking entries.`);
}

console.log('Seed complete.');
