/**
 * api.js — Fetch wrapper that automatically attaches JWT.
 * BASE points to the Spring Boot backend running on port 8080.
 */
const API = (() => {

  // ── Change this if your backend runs on a different port ───
  const BASE = 'http://localhost:8080';

  // ── CORE ───────────────────────────────────────────────────
  async function request(method, path, body = null, token = null, isFormData = false) {
    const headers = {};
    if (!isFormData) headers['Content-Type'] = 'application/json';
    if (token)       headers['Authorization'] = 'Bearer ' + token;

    const opts = { method, headers };
    if (body !== null) opts.body = isFormData ? body : JSON.stringify(body);

    const res = await fetch(BASE + path, opts);

    let data = null;
    const ct = res.headers.get('content-type') || '';
    data = ct.includes('application/json') ? await res.json() : await res.text();

    if (!res.ok) throw new ApiError(data?.message || data || `Error ${res.status}`, res.status, data);
    return data;
  }

  const get    = (path, token = null)         => request('GET',    path, null, token);
  const post   = (path, body, token = null)   => request('POST',   path, body, token);
  const put    = (path, body, token = null)   => request('PUT',    path, body, token);
  const del    = (path, token = null)         => request('DELETE', path, null, token);
  const upload = (path, fd,   token = null)   => request('POST',   path, fd,   token, true);

  class ApiError extends Error {
    constructor(message, status, data) { super(message); this.status = status; this.data = data; }
  }

  // ── TOAST ──────────────────────────────────────────────────
  let _tc = null;
  function _container() {
    if (!_tc) { _tc = document.createElement('div'); _tc.className = 'toast-container'; document.body.appendChild(_tc); }
    return _tc;
  }
  function showToast(msg, type = 'info', dur = 3500) {
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const t = document.createElement('div');
    t.className = `toast toast-${type === 'warning' ? 'info' : type}`;
    t.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
    _container().appendChild(t);
    setTimeout(() => { t.style.opacity='0'; t.style.transform='translateY(10px)'; t.style.transition='all .3s'; setTimeout(()=>t.remove(),300); }, dur);
  }

  // ── FORMATTERS ─────────────────────────────────────────────
  const formatCurrency = v => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(v);
  const formatDate     = s => s ? new Date(s).toLocaleDateString('en-IN',{year:'numeric',month:'short',day:'numeric'}) : '—';
  const formatDateTime = s => s ? new Date(s).toLocaleString('en-IN',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '—';

  return { get, post, put, del, upload, ApiError, showToast, formatCurrency, formatDate, formatDateTime };
})();
