// Populates the database with the content that used to be hard-coded into
// core.html / department.html / wings.html / gallery.html, so the site and
// the admin panel aren't empty the first time the server runs.
// Safe to re-run: it only inserts if the tables are empty.

const db = require('./db');

const memberCount = db.prepare('SELECT COUNT(*) AS c FROM members').get().c;
if (memberCount === 0) {
  const insert = db.prepare(`
    INSERT INTO members (category, group_name, name, role, image_url, sort_order)
    VALUES (@category, @group_name, @name, @role, @image_url, @sort_order)
  `);

  const rows = [
    // ---- Core Committee ----
    { category: 'core', group_name: null, name: 'Zahra Mehthab', role: 'President', image_url: '', sort_order: 1 },
    { category: 'core', group_name: null, name: 'Fathima Sana', role: 'Vice President', image_url: '', sort_order: 2 },
    { category: 'core', group_name: null, name: 'Liya Shahma', role: 'General Secretary', image_url: '', sort_order: 3 },
    { category: 'core', group_name: null, name: 'Fathwima Suhaila', role: 'Joint Secretary', image_url: '', sort_order: 4 },
    { category: 'core', group_name: null, name: 'Asna NT', role: 'Programme Secretary', image_url: '', sort_order: 5 },
    { category: 'core', group_name: null, name: 'Fathima Nafla', role: 'Finance Secretary', image_url: '', sort_order: 6 },
    { category: 'core', group_name: null, name: 'Fathima Rifa PE', role: 'PRO', image_url: '', sort_order: 7 },
    { category: 'core', group_name: null, name: 'Fidha Fathima AP', role: 'Media', image_url: '', sort_order: 8 },
    { category: 'core', group_name: null, name: 'Ayisha', role: 'Media', image_url: '', sort_order: 9 },
    { category: 'core', group_name: null, name: 'Hisana', role: 'Media', image_url: '', sort_order: 10 },

    // ---- Departments (placeholders from the original file - edit in admin) ----
    { category: 'department', group_name: 'Fiqh and Usul al Fiqh', name: 'Add member name', role: 'Chairperson', image_url: '', sort_order: 1 },
    { category: 'department', group_name: 'Fiqh and Usul al Fiqh', name: 'Add member name', role: 'Vice Chairperson', image_url: '', sort_order: 2 },
    { category: 'department', group_name: 'Fiqh and Usul al Fiqh', name: 'Add member name', role: 'Secretary', image_url: '', sort_order: 3 },
    { category: 'department', group_name: 'Quran and Related Science', name: 'Add member name', role: 'Chairperson', image_url: '', sort_order: 1 },
    { category: 'department', group_name: 'Quran and Related Science', name: 'Add member name', role: 'Vice Chairperson', image_url: '', sort_order: 2 },

    // ---- Wings ----
    { category: 'wing', group_name: 'Media Wing', name: 'Add member name', role: 'Coordinator', image_url: '', sort_order: 1 },
    { category: 'wing', group_name: 'Editorial Board', name: 'Add member name', role: 'Editor', image_url: '', sort_order: 1 },
    { category: 'wing', group_name: 'Library Board', name: 'Add member name', role: 'Coordinator', image_url: '', sort_order: 1 },
    { category: 'wing', group_name: 'PKV', name: 'Add member name', role: 'Coordinator', image_url: '', sort_order: 1 },
    { category: 'wing', group_name: 'SRDP', name: 'Add member name', role: 'Coordinator', image_url: '', sort_order: 1 },
    { category: 'wing', group_name: 'Gazva Debates', name: 'Add member name', role: 'Coordinator', image_url: '', sort_order: 1 },
  ];

  const insertMany = db.transaction((items) => items.forEach((r) => insert.run(r)));
  insertMany(rows);
  console.log(`Seeded ${rows.length} members.`);
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
