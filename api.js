// =============================================
//  GAZVA — API helper (shared by all pages)
//  The frontend and backend are served from the
//  same origin, so relative /api paths just work
//  in production. Nothing to configure.
// =============================================

const GazvaAPI = {
  base: '/api',

  async _fetch(path, options = {}) {
    const res = await fetch(this.base + path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
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
  },

  getMembers(category) {
    return this._fetch(`/members${category ? `?category=${category}` : ''}`);
  },
  getEvents() {
    return this._fetch('/events');
  },
  getRankings(term) {
    return this._fetch(`/rankings${term ? `?term=${encodeURIComponent(term)}` : ''}`);
  },
  sendContactMessage(payload) {
    return this._fetch('/contact', { method: 'POST', body: JSON.stringify(payload) });
  },

  // Groups a flat member list into { groupName: [members...] } — used for
  // department.html and wings.html, which render one block per group.
  groupBy(list, key) {
    return list.reduce((acc, item) => {
      const k = item[key] || 'General';
      (acc[k] = acc[k] || []).push(item);
      return acc;
    }, {});
  },
};

// Small helper used across pages to build the initial-avatar fallback SVG
function gazvaAvatarSVG() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
  </svg>`;
}

function gazvaEscapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}
