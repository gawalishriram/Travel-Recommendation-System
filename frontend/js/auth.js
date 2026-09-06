/**
 * auth.js — JWT token management
 * Handles user & admin sessions via localStorage.
 */
const Auth = (() => {

  const USER_KEY  = 'tms_user';
  const ADMIN_KEY = 'tms_admin';

  // ── USER ───────────────────────────────────────────────────
  const saveUser  = d  => localStorage.setItem(USER_KEY, JSON.stringify(d));
  const clearUser = () => localStorage.removeItem(USER_KEY);
  const getUser   = () => { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } };
  const getUserToken = () => getUser()?.token || null;
  const getUserId    = () => getUser()?.userId || null;
  const isUserLoggedIn = () => !!(getUser()?.token);

  // ── ADMIN ──────────────────────────────────────────────────
  const saveAdmin  = d  => localStorage.setItem(ADMIN_KEY, JSON.stringify(d));
  const clearAdmin = () => localStorage.removeItem(ADMIN_KEY);
  const getAdmin   = () => { try { return JSON.parse(localStorage.getItem(ADMIN_KEY)); } catch { return null; } };
  const getAdminToken  = () => getAdmin()?.token || null;
  const isAdminLoggedIn = () => !!(getAdmin()?.token);

  // ── GUARDS ─────────────────────────────────────────────────
  function requireUser() {
    if (!isUserLoggedIn()) { window.location.href = 'login.html'; return false; }
    return true;
  }
  function requireAdmin() {
    if (!isAdminLoggedIn()) { window.location.href = 'admin-login.html'; return false; }
    return true;
  }
  function redirectIfUserLoggedIn(to = 'user-dashboard.html')  { if (isUserLoggedIn())  window.location.href = to; }
  function redirectIfAdminLoggedIn(to = 'admin-dashboard.html') { if (isAdminLoggedIn()) window.location.href = to; }

  // ── LOGOUT ─────────────────────────────────────────────────
  function logoutUser(to = 'login.html')       { clearUser();  window.location.href = to; }
  function logoutAdmin(to = 'admin-login.html') { clearAdmin(); window.location.href = to; }

  return {
    saveUser, getUser, getUserToken, getUserId, clearUser, isUserLoggedIn,
    saveAdmin, getAdmin, getAdminToken, clearAdmin, isAdminLoggedIn,
    requireUser, requireAdmin,
    redirectIfUserLoggedIn, redirectIfAdminLoggedIn,
    logoutUser, logoutAdmin
  };
})();
