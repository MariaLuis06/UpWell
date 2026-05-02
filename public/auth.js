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
    try {
      return JSON.parse(localStorage.getItem('session'));
    } catch {
      return null;
    }
  }

  function setSession(session) {
    localStorage.setItem('session', JSON.stringify(session));
  }

  async function apiFetch(path, options = {}) {
    const session = getSession();
    const headers = { ...(options.headers || {}) };

    if (session?.authToken) {
      headers.Authorization = `Bearer ${session.authToken}`;
    }

    const response = await fetch(`${API}${path}`, { ...options, headers });
    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (response.status === 401) {
      localStorage.removeItem('session');
    }

    return { response, data };
  }

  async function register(email, password) {
    const anonId = getAnonId();
    try {
      const { data } = await apiFetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, anonId })
      });
      return data;
    } catch {
      return { ok: false, error: 'Servidor inacessivel. Confirma que o servidor esta a correr.' };
    }
  }

  async function login(email, password) {
    try {
      const { data } = await apiFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (data.ok) {
        const session = {
          email: data.email,
          anonId: data.anonId,
          authToken: data.authToken,
          hasProfile: Boolean(data.hasProfile),
          loginAt: Date.now()
        };
        setSession(session);
        localStorage.setItem('anon_id', data.anonId);
      }

      return data;
    } catch {
      return { ok: false, error: 'Servidor inacessivel. Confirma que o servidor esta a correr.' };
    }
  }

  async function logout() {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore logout network failures and clear local session anyway.
    }
    localStorage.removeItem('session');
    window.location.href = 'index.html';
  }

  function requireAuth(redirectTo = 'login.html') {
    const session = getSession();
    if (!session?.authToken) {
      window.location.href = redirectTo;
      return null;
    }
    return session;
  }

  function requireProfile(redirectTo = 'profile.html') {
    const session = requireAuth();
    if (!session) return null;
    if (!session.hasProfile) {
      window.location.href = redirectTo;
      return null;
    }
    return session;
  }

  function redirectIfAuth(profilePage = 'profile.html', appPage = 'gerar.html') {
    const session = getSession();
    if (!session?.authToken) return;
    window.location.href = session.hasProfile ? appPage : profilePage;
  }

  function updateSession(patch) {
    const session = getSession();
    if (!session) return;
    setSession({ ...session, ...patch });
  }

  return {
    apiFetch,
    getAnonId,
    getSession,
    login,
    logout,
    redirectIfAuth,
    register,
    requireAuth,
    requireProfile,
    updateSession
  };
})();

function renderNav(activePage = '') {
  const session = Auth.getSession();
  const navLinks = document.getElementById('nav-links');
  if (!navLinks) return;

  if (session) {
    navLinks.innerHTML = `
      <a href="profile.html" class="nav-link ${activePage === 'profile' ? 'active' : ''}">Perfil</a>
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

function showError(fieldId, msg) {
  const el = document.getElementById(fieldId + '-error');
  const input = document.getElementById(fieldId);
  if (el) {
    el.textContent = msg;
    el.classList.add('visible');
  }
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
