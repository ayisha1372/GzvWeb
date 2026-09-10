// =============================================
//  GAZVA — Admin Panel Logic
// =============================================

const TOKEN_KEY = 'gazva_admin_token';
let currentTab = 'members';
let cache = { members: [], events: [], rankings: [], messages: [] };

// ---------- Auth helpers ----------
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function authedFetch(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) {
    clearToken();
    showLogin('Your session expired. Please log in again.');
    throw new Error('Session expired');
  }
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body.error) msg = body.error;
    } catch (_) {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

function esc(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

// ---------- Login / dashboard switching ----------
function showLogin(message) {
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  const err = document.getElementById('loginError');
  if (message) {
    err.textContent = message;
    err.style.display = 'block';
  } else {
    err.style.display = 'none';
  }
}

function showDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('dashboard').style.display = 'flex';
  loadAllData();
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const btn = document.getElementById('loginBtn');
  const err = document.getElementById('loginError');
  err.style.display = 'none';
  btn.disabled = true;
  btn.textContent = 'Signing in…';
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || 'Login failed.');
    setToken(body.token);
    showDashboard();
  } catch (ex) {
    err.textContent = ex.message;
    err.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Sign In';
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  clearToken();
  showLogin();
});

// ---------- Tabs ----------
document.querySelectorAll('.nav-item[data-tab]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-item[data-tab]').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach((p) => (p.style.display = 'none'));
    currentTab = btn.dataset.tab;
    document.getElementById(`tab-${currentTab}`).style.display = 'block';
  });
});

// ---------- Data loading ----------
async function loadAllData() {
  try {
    const [members, events, rankings, messages] = await Promise.all([
      authedFetch('/members'),
      authedFetch('/events'),
      authedFetch('/rankings'),
      authedFetch('/contact'),
    ]);
    cache = { members, events, rankings, messages };
    renderMembers();
    renderEvents();
    renderRankings();
    renderMessages();
  } catch (ex) {
    console.error(ex);
  }
}

// ---------- MEMBERS ----------
function renderMembers() {
  const filter = document.getElementById('memberCategoryFilter').value;
  const rows = filter ? cache.members.filter((m) => m.category === filter) : cache.members;
  const body = document.getElementById('membersBody');

  if (!rows.length) {
    body.innerHTML = `<tr class="empty-row"><td colspan="6">No members yet. Click "+ Add Member" to create one.</td></tr>`;
    return;
  }

  body.innerHTML = rows
    .map(
      (m) => `
    <tr>
      <td>${esc(m.name)}</td>
      <td>${esc(m.category)}</td>
      <td>${esc(m.group_name || '—')}</td>
      <td>${esc(m.role || '—')}</td>
      <td>${esc(m.sort_order)}</td>
      <td class="row-actions">
        <button class="edit-btn" data-edit="member" data-id="${m.id}">Edit</button>
        <button class="delete-btn" data-delete="member" data-id="${m.id}">Delete</button>
      </td>
    </tr>`
    )
    .join('');
}
document.getElementById('memberCategoryFilter').addEventListener('change', renderMembers);

// ---------- EVENTS ----------
function renderEvents() {
  const body = document.getElementById('eventsBody');
  if (!cache.events.length) {
    body.innerHTML = `<tr class="empty-row"><td colspan="5">No events yet. Click "+ Add Event" to create one.</td></tr>`;
    return;
  }
  body.innerHTML = cache.events
    .map(
      (ev) => `
    <tr>
      <td>${esc(ev.title)}</td>
      <td>${esc(ev.category || '—')}</td>
      <td>${esc(ev.wing || '—')}</td>
      <td>${esc(ev.event_date || '—')}</td>
      <td class="row-actions">
        <button class="edit-btn" data-edit="event" data-id="${ev.id}">Edit</button>
        <button class="delete-btn" data-delete="event" data-id="${ev.id}">Delete</button>
      </td>
    </tr>`
    )
    .join('');
}

// ---------- RANKINGS ----------
function renderRankings() {
  const body = document.getElementById('rankingsBody');
  if (!cache.rankings.length) {
    body.innerHTML = `<tr class="empty-row"><td colspan="6">No ranking entries yet. Click "+ Add Entry" to create one.</td></tr>`;
    return;
  }
  body.innerHTML = cache.rankings
    .map(
      (r) => `
    <tr>
      <td>${esc(r.student_name)}</td>
      <td>${esc(r.department || '—')}</td>
      <td>${esc(r.term || '—')}</td>
      <td>${esc(r.points)}</td>
      <td>${esc(r.achievements || '—')}</td>
      <td class="row-actions">
        <button class="edit-btn" data-edit="ranking" data-id="${r.id}">Edit</button>
        <button class="delete-btn" data-delete="ranking" data-id="${r.id}">Delete</button>
      </td>
    </tr>`
    )
    .join('');
}

// ---------- MESSAGES ----------
function renderMessages() {
  const list = document.getElementById('messagesList');
  const unread = cache.messages.filter((m) => !m.is_read).length;
  const badge = document.getElementById('unreadBadge');
  if (unread > 0) {
    badge.textContent = unread;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }

  if (!cache.messages.length) {
    list.innerHTML = `<p class="panel-sub">No messages yet.</p>`;
    return;
  }

  list.innerHTML = cache.messages
    .map(
      (m) => `
    <div class="message-card ${m.is_read ? '' : 'unread'}">
      <div class="message-top">
        <div>
          <div class="message-from">${esc(m.first_name)} ${esc(m.last_name || '')} &lt;${esc(m.email)}&gt;</div>
          <div class="message-meta">${esc(m.phone || 'No phone')} · ${esc(new Date(m.created_at).toLocaleString())}</div>
        </div>
      </div>
      ${m.subject ? `<span class="message-subject">${esc(m.subject)}</span>` : ''}
      <p class="message-body">${esc(m.message)}</p>
      <div class="message-actions">
        <button class="btn-outline" data-toggle-read="${m.id}" data-read="${m.is_read}">${m.is_read ? 'Mark unread' : 'Mark read'}</button>
        <button class="btn-outline" data-delete-message="${m.id}">Delete</button>
      </div>
    </div>`
    )
    .join('');
}

document.getElementById('messagesList').addEventListener('click', async (e) => {
  const toggleId = e.target.dataset.toggleRead;
  const deleteId = e.target.dataset.deleteMessage;
  try {
    if (toggleId) {
      const isRead = e.target.dataset.read === '1';
      await authedFetch(`/contact/${toggleId}/read`, {
        method: 'PATCH',
        body: JSON.stringify({ is_read: !isRead }),
      });
      await loadAllData();
    } else if (deleteId) {
      if (!confirm('Delete this message?')) return;
      await authedFetch(`/contact/${deleteId}`, { method: 'DELETE' });
      await loadAllData();
    }
  } catch (ex) {
    alert(ex.message);
  }
});

// ---------- Generic form modal (add / edit for members, events, rankings) ----------
const FORM_CONFIG = {
  member: {
    title: 'Member',
    endpoint: '/members',
    fields: [
      { key: 'category', label: 'Category', type: 'select', options: ['core', 'department', 'wing'], required: true },
      { key: 'group_name', label: 'Group / Department / Wing name (leave blank for Core)', type: 'text' },
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'role', label: 'Role / Position', type: 'text' },
      { key: 'image_url', label: 'Image URL (optional)', type: 'text' },
      { key: 'sort_order', label: 'Sort order (lower = first)', type: 'number', default: 0 },
    ],
  },
  event: {
    title: 'Event',
    endpoint: '/events',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'category', label: 'Category (debate, cultural, literary, islamic, academic, media, social)', type: 'text' },
      { key: 'wing', label: 'Organizing wing/committee', type: 'text' },
      { key: 'event_date', label: 'Date (e.g. "March 2026")', type: 'text' },
      { key: 'participants', label: 'Participants (e.g. "60+ participants")', type: 'text' },
      { key: 'image_url', label: 'Image URL (optional)', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'sort_order', label: 'Sort order', type: 'number', default: 0 },
    ],
  },
  ranking: {
    title: 'Ranking Entry',
    endpoint: '/rankings',
    fields: [
      { key: 'student_name', label: 'Student name', type: 'text', required: true },
      { key: 'department', label: 'Department', type: 'text' },
      { key: 'term', label: 'Term (e.g. "2025-26")', type: 'text' },
      { key: 'points', label: 'Points', type: 'number', default: 0 },
      { key: 'achievements', label: 'Achievements', type: 'textarea' },
      { key: 'sort_order', label: 'Sort order', type: 'number', default: 0 },
    ],
  },
};

let editingType = null;
let editingId = null;

function openForm(type, id) {
  editingType = type;
  editingId = id || null;
  const config = FORM_CONFIG[type];
  const existing = id ? cache[`${type}s`].find((x) => x.id === Number(id)) : null;

  document.getElementById('modalTitle').textContent = (existing ? 'Edit ' : 'Add ') + config.title;
  document.getElementById('formError').style.display = 'none';

  const fieldsHTML = config.fields
    .map((f) => {
      const value = existing ? existing[f.key] : f.default !== undefined ? f.default : '';
      if (f.type === 'select') {
        const opts = f.options
          .map((o) => `<option value="${o}" ${value === o ? 'selected' : ''}>${o}</option>`)
          .join('');
        return `<div class="form-group"><label>${f.label}</label><select name="${f.key}">${opts}</select></div>`;
      }
      if (f.type === 'textarea') {
        return `<div class="form-group"><label>${f.label}</label><textarea name="${f.key}">${esc(value)}</textarea></div>`;
      }
      return `<div class="form-group"><label>${f.label}</label><input type="${f.type}" name="${f.key}" value="${esc(value)}" ${f.required ? 'required' : ''}/></div>`;
    })
    .join('');

  document.getElementById('modalFields').innerHTML = fieldsHTML;
  document.getElementById('formModal').style.display = 'flex';
}

function closeForm() {
  document.getElementById('formModal').style.display = 'none';
  editingType = null;
  editingId = null;
}

document.getElementById('modalClose').addEventListener('click', closeForm);
document.getElementById('modalCancel').addEventListener('click', closeForm);
document.getElementById('formModal').addEventListener('click', (e) => {
  if (e.target.id === 'formModal') closeForm();
});

document.getElementById('entityForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const config = FORM_CONFIG[editingType];
  const formData = new FormData(e.target);
  const payload = {};
  config.fields.forEach((f) => {
    let val = formData.get(f.key);
    if (f.type === 'number') val = val === '' ? 0 : Number(val);
    payload[f.key] = val;
  });

  const saveBtn = document.getElementById('modalSave');
  saveBtn.disabled = true;
  saveBtn.textContent = 'Saving…';
  try {
    if (editingId) {
      await authedFetch(`${config.endpoint}/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      await authedFetch(config.endpoint, { method: 'POST', body: JSON.stringify(payload) });
    }
    closeForm();
    await loadAllData();
  } catch (ex) {
    const err = document.getElementById('formError');
    err.textContent = ex.message;
    err.style.display = 'block';
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save';
  }
});

// "+ Add" buttons
document.querySelectorAll('[data-open-form]').forEach((btn) => {
  btn.addEventListener('click', () => openForm(btn.dataset.openForm));
});

// Edit / Delete buttons (event delegation, since rows are re-rendered)
document.querySelector('.main-panel').addEventListener('click', async (e) => {
  const editType = e.target.dataset.edit;
  const editId = e.target.dataset.id;
  const deleteType = e.target.dataset.delete;

  if (editType) {
    openForm(editType, editId);
    return;
  }
  if (deleteType) {
    const config = FORM_CONFIG[deleteType];
    if (!confirm(`Delete this ${config.title.toLowerCase()}?`)) return;
    try {
      await authedFetch(`${config.endpoint}/${e.target.dataset.id}`, { method: 'DELETE' });
      await loadAllData();
    } catch (ex) {
      alert(ex.message);
    }
  }
});

// ---------- Boot ----------
if (getToken()) {
  showDashboard();
} else {
  showLogin();
}
