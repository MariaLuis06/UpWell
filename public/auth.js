// ─── UPWELL AUTH — liga ao servidor local ─────────────────────────────────

const API = 'http://localhost:3000/api';

const Auth = (() => {

  function getAnonId() {
    let id = localStorage.getItem('anon_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('anon_id', id);
    }
    return id;
  }

  function getSession() {
    try { return JSON.parse(localStorage.getItem('session')); } catch { return null; }
  }

  async function register(email, password) {
    const anonId = getAnonId();
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, anonId })
      });
      const data = await res.json();
      if (data.ok) {
        const session = { email, anonId, loginAt: Date.now() };
        localStorage.setItem('session', JSON.stringify(session));
      }
      return data;
    } catch {
      return { ok: false, error: 'Servidor inacessível. Confirma que o servidor está a correr.' };
    }
  }

  async function login(email, password) {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.ok) {
        const session = { email: data.email, anonId: data.anonId, loginAt: Date.now() };
        localStorage.setItem('session', JSON.stringify(session));
        localStorage.setItem('anon_id', data.anonId);
      }
      return data;
    } catch {
      return { ok: false, error: 'Servidor inacessível. Confirma que o servidor está a correr.' };
    }
  }

  function logout() {
    localStorage.removeItem('session');
    window.location.href = 'index.html';
  }

  function requireAuth(redirectTo = 'login.html') {
    const session = getSession();
    if (!session) { window.location.href = redirectTo; return null; }
    return session;
  }

  function redirectIfAuth(redirectTo = 'gerar.html') {
    const session = getSession();
    if (session) { window.location.href = redirectTo; }
  }

  return { getAnonId, getSession, register, login, logout, requireAuth, redirectIfAuth };
})();

// ─── NAV ──────────────────────────────────────────────────────────────────

function renderNav(activePage = '') {
  const session = Auth.getSession();
  const navLinks = document.getElementById('nav-links');
  if (!navLinks) return;

  if (session) {
    navLinks.innerHTML = `
      <a href="gerar.html" class="nav-link ${activePage === 'gerar' ? 'active' : ''}">Gerar plano</a>
      <span class="nav-link" style="color:var(--text-secondary);cursor:default;font-size:13px">${session.email}</span>
      <button class="btn-nav-ghost" onclick="Auth.logout()">Sair</button>
    `;
  } else {
    navLinks.innerHTML = `
      <a href="login.html" class="nav-link ${activePage === 'login' ? 'active' : ''}">Entrar</a>
      <a href="register.html" class="btn-nav">Criar conta</a>
    `;
  }
}

// ─── FORM HELPERS ─────────────────────────────────────────────────────────

function showError(fieldId, msg) {
  const el = document.getElementById(fieldId + '-error');
  const input = document.getElementById(fieldId);
  if (el) { el.textContent = msg; el.classList.add('visible'); }
  if (input) input.classList.add('input-error');
}

function clearError(fieldId) {
  const el = document.getElementById(fieldId + '-error');
  const input = document.getElementById(fieldId);
  if (el) el.classList.remove('visible');
  if (input) input.classList.remove('input-error');
}

function showAlert(id, msg, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `alert alert-${type} visible`;
  el.querySelector('.alert-msg').textContent = msg;
}

function hideAlert(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('visible');
}

function setLoading(btnId, spinnerId, loading) {
  const btn = document.getElementById(btnId);
  const sp = document.getElementById(spinnerId);
  if (btn) btn.disabled = loading;
  if (sp) sp.classList.toggle('visible', loading);
}