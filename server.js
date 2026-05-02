require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const PASSWORD_SALT = process.env.PASSWORD_SALT || 'upwell_salt';

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Index.html'));
});

const authDb = new Database('auth.db');
const profileDb = new Database('profiles.db');

authDb.pragma('journal_mode = WAL');
profileDb.pragma('journal_mode = WAL');

authDb.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    anon_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    profile_token TEXT UNIQUE NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
`);

profileDb.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_token TEXT UNIQUE NOT NULL,
    age INTEGER,
    weight_kg REAL,
    height_cm REAL,
    allergies TEXT,
    medical_conditions TEXT,
    medications TEXT,
    notes TEXT,
    side_effects TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS planos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_token TEXT NOT NULL,
    doenca TEXT NOT NULL,
    categorias TEXT,
    plano TEXT NOT NULL,
    criado_em INTEGER NOT NULL
  );
`);

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + PASSWORD_SALT).digest('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function cleanupExpiredSessions() {
  authDb.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now());
}

function issueSession(userId) {
  cleanupExpiredSessions();
  const sessionToken = generateToken();
  const now = Date.now();
  authDb
    .prepare('INSERT INTO sessions (user_id, session_token, created_at, expires_at) VALUES (?, ?, ?, ?)')
    .run(userId, sessionToken, now, now + SESSION_TTL_MS);
  return sessionToken;
}

function sanitizeProfileRow(row) {
  if (!row) return null;
  return {
    age: row.age,
    weightKg: row.weight_kg,
    heightCm: row.height_cm,
    allergies: row.allergies || '',
    medicalConditions: row.medical_conditions || '',
    medications: row.medications || '',
    notes: row.notes || '',
    sideEffects: row.side_effects || '',
    updatedAt: row.updated_at
  };
}

function getAuthSession(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  const sessionToken = header.slice(7).trim();
  if (!sessionToken) return null;

  cleanupExpiredSessions();

  return authDb.prepare(`
    SELECT
      s.session_token,
      s.expires_at,
      u.id AS user_id,
      u.anon_id,
      u.email,
      u.profile_token
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.session_token = ? AND s.expires_at > ?
  `).get(sessionToken, Date.now());
}

function requireSession(req, res, next) {
  const session = getAuthSession(req);
  if (!session) {
    return res.status(401).json({ ok: false, error: 'Sessao invalida ou expirada.' });
  }
  req.session = session;
  next();
}

function migrateLegacyUsers() {
  if (!fs.existsSync(path.join(__dirname, 'upwell.db'))) return;

  const legacyDb = new Database('upwell.db', { readonly: true });
  let hasLegacyUsers = false;

  try {
    const table = legacyDb.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users'").get();
    hasLegacyUsers = Boolean(table);
  } catch {
    hasLegacyUsers = false;
  }

  if (!hasLegacyUsers) {
    legacyDb.close();
    return;
  }

  const legacyUsers = legacyDb.prepare('SELECT anon_id, email, password_hash, created_at FROM users').all();
  const insertUser = authDb.prepare(`
    INSERT OR IGNORE INTO users (anon_id, email, password_hash, profile_token, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  const tx = authDb.transaction(() => {
    for (const user of legacyUsers) {
      insertUser.run(
        user.anon_id,
        user.email,
        user.password_hash,
        generateToken(),
        user.created_at
      );
    }
  });

  tx();
  legacyDb.close();
}

migrateLegacyUsers();

function getProfileExists(profileToken) {
  const row = profileDb.prepare('SELECT 1 FROM profiles WHERE profile_token = ?').get(profileToken);
  return Boolean(row);
}

app.post('/api/auth/register', (req, res) => {
  const { email, password, anonId } = req.body;

  if (!email || !password || !anonId) {
    return res.status(400).json({ ok: false, error: 'Campos em falta.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ ok: false, error: 'Password demasiado curta.' });
  }

  try {
    const passwordHash = hashPassword(password);
    authDb.prepare(`
      INSERT INTO users (anon_id, email, password_hash, profile_token, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(anonId, email.toLowerCase(), passwordHash, generateToken(), Date.now());

    res.json({ ok: true });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ ok: false, error: 'Este email ja esta registado.' });
    }
    res.status(500).json({ ok: false, error: 'Erro no servidor.' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ ok: false, error: 'Campos em falta.' });
  }

  const user = authDb.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Email nao encontrado.' });
  }

  const passwordHash = hashPassword(password);
  if (user.password_hash !== passwordHash) {
    return res.status(401).json({ ok: false, error: 'Password incorreta.' });
  }

  const sessionToken = issueSession(user.id);
  const hasProfile = getProfileExists(user.profile_token);

  res.json({
    ok: true,
    email: user.email,
    anonId: user.anon_id,
    authToken: sessionToken,
    hasProfile
  });
});

app.post('/api/auth/logout', requireSession, (req, res) => {
  authDb.prepare('DELETE FROM sessions WHERE session_token = ?').run(req.session.session_token);
  res.json({ ok: true });
});

app.get('/api/profile/me', requireSession, (req, res) => {
  const row = profileDb.prepare('SELECT * FROM profiles WHERE profile_token = ?').get(req.session.profile_token);
  res.json({ ok: true, profile: sanitizeProfileRow(row), hasProfile: Boolean(row) });
});

app.post('/api/profile/me', requireSession, (req, res) => {
  const {
    age,
    weightKg,
    heightCm,
    allergies,
    medicalConditions,
    medications,
    sideEffects,
    notes
  } = req.body;

  const parsedAge = age === '' || age == null ? null : Number.parseInt(age, 10);
  const parsedWeight = weightKg === '' || weightKg == null ? null : Number.parseFloat(weightKg);
  const parsedHeight = heightCm === '' || heightCm == null ? null : Number.parseFloat(heightCm);

  if (parsedAge !== null && (!Number.isInteger(parsedAge) || parsedAge < 0 || parsedAge > 120)) {
    return res.status(400).json({ ok: false, error: 'Idade invalida.' });
  }
  if (parsedWeight !== null && (!Number.isFinite(parsedWeight) || parsedWeight <= 0 || parsedWeight > 500)) {
    return res.status(400).json({ ok: false, error: 'Peso invalido.' });
  }
  if (parsedHeight !== null && (!Number.isFinite(parsedHeight) || parsedHeight <= 0 || parsedHeight > 300)) {
    return res.status(400).json({ ok: false, error: 'Altura invalida.' });
  }

  const now = Date.now();
  profileDb.prepare(`
    INSERT INTO profiles (
      profile_token, age, weight_kg, height_cm, allergies, medical_conditions, medications, side_effects, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(profile_token) DO UPDATE SET
      age = excluded.age,
      weight_kg = excluded.weight_kg,
      height_cm = excluded.height_cm,
      allergies = excluded.allergies,
      medical_conditions = excluded.medical_conditions,
      medications = excluded.medications,
      side_effects = excluded.side_effects,
      notes = excluded.notes,
      updated_at = excluded.updated_at
  `).run(
    req.session.profile_token,
    parsedAge,
    parsedWeight,
    parsedHeight,
    (allergies || '').trim(),
    (medicalConditions || '').trim(),
    (medications || '').trim(),
    (sideEffects || '').trim(),
    (notes || '').trim(),
    now,
    now
  );

  res.json({ ok: true, hasProfile: true });
});

app.get('/api/dev/profile/:profileToken', (req, res) => {
  const devToken = req.headers['x-dev-token'];
  if (!process.env.DEV_ACCESS_TOKEN) {
    return res.status(503).json({ ok: false, error: 'DEV_ACCESS_TOKEN nao configurado.' });
  }
  if (devToken !== process.env.DEV_ACCESS_TOKEN) {
    return res.status(403).json({ ok: false, error: 'Acesso negado.' });
  }

  const user = authDb.prepare('SELECT anon_id, created_at FROM users WHERE profile_token = ?').get(req.params.profileToken);
  const profile = profileDb.prepare('SELECT * FROM profiles WHERE profile_token = ?').get(req.params.profileToken);

  if (!user && !profile) {
    return res.status(404).json({ ok: false, error: 'Token nao encontrado.' });
  }

  res.json({
    ok: true,
    auth: user || null,
    profile: sanitizeProfileRow(profile)
  });
});

app.post('/api/gerar', requireSession, async (req, res) => {
  const { doenca, medicamento, sideEffects, restricoes, cats } = req.body;

  if (!doenca || !Array.isArray(sideEffects) || sideEffects.length === 0) {
    return res.status(400).json({ ok: false, error: 'Dados em falta.' });
  }

  const profile = profileDb.prepare('SELECT * FROM profiles WHERE profile_token = ?').get(req.session.profile_token);
  const profileContext = sanitizeProfileRow(profile);
  const profileSummary = profileContext ? [
    profileContext.age ? `Idade: ${profileContext.age}` : null,
    profileContext.weightKg ? `Peso: ${profileContext.weightKg} kg` : null,
    profileContext.heightCm ? `Altura: ${profileContext.heightCm} cm` : null,
    profileContext.allergies ? `Alergias/restricoes clinicas: ${profileContext.allergies}` : null,
    profileContext.medicalConditions ? `Outras condicoes relevantes: ${profileContext.medicalConditions}` : null,
    profileContext.medications ? `Medicacao habitual no perfil: ${profileContext.medications}` : null,
    profileContext.sideEffects ? `Efeitos secundarios conhecidos da medicacao do perfil: ${profileContext.sideEffects}` : null,
    profileContext.notes ? `Notas adicionais do perfil: ${profileContext.notes}` : null
  ].filter(Boolean).join('\n') : '';

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: (() => {
            const hasAlim = Array.isArray(cats) && cats.includes('Alimentação');
            const hasExerc = Array.isArray(cats) && cats.includes('Atividade Física');
            const ambos = hasAlim && hasExerc;
            const soExerc = hasExerc && !hasAlim;

            const base = `Sou um utilizador com ${doenca}.${medicamento ? `\nTomo: ${medicamento}.` : ''}${sideEffects.length ? `\nEfeitos secundários relevantes: ${sideEffects.join(', ')}.` : ''}${restricoes ? `\nAlimentos a EVITAR: ${restricoes}.` : ''}${profileSummary ? `\n\nPerfil clínico:\n${profileSummary}` : ''}`;

            if (ambos) {
              return `${base}

Cria um plano semanal completo (7 dias) em português europeu com alimentação E exercício físico integrados.
Para cada dia usa EXATAMENTE este formato:

**Segunda-feira**
🥗 Alimentação:
• Pequeno-almoço: [sugestão]
• Almoço: [sugestão]
• Jantar: [sugestão]
🏃 Exercício:
• [atividade] — [duração] — [benefício numa frase]

Repete para todos os 7 dias. No final, 3 dicas gerais de bem-estar. Usa alimentos acessíveis em Portugal. Sê específico e encorajador.`;
            } else if (soExerc) {
              return `${base}

Cria um plano de exercício físico semanal completo (7 dias) em português europeu.
Para cada dia usa EXATAMENTE este formato:

**Segunda-feira**
🏃 Exercício: [nome do exercício]
⏱ Duração: [tempo]
💪 Intensidade: [leve/moderada/intensa]
✅ Benefício: [1 frase explicando porque ajuda esta condição]

Repete para todos os 7 dias. No final, 3 dicas gerais de bem-estar físico. Sê específico e motivador.`;
            } else {
              return `${base}

Cria um plano alimentar semanal completo (7 dias) em português europeu.
Para cada dia usa EXATAMENTE este formato:

**Segunda-feira**
• Pequeno-almoço: [sugestão + 1 frase de benefício]
• Almoço: [sugestão + 1 frase de benefício]
• Jantar: [sugestão + 1 frase de benefício]

Repete para todos os 7 dias. Usa alimentos acessíveis em Portugal. No final, 3 dicas gerais de bem-estar. Sê específico e encorajador.`;
            }
          })()
        }]
      })
    });

    const data = await response.json();
    const plano = data.choices?.[0]?.message?.content;

    if (!plano) {
      return res.status(500).json({ ok: false, error: 'Erro ao gerar plano.' });
    }

    try {
      profileDb.prepare(
        'INSERT INTO planos (profile_token, doenca, categorias, plano, criado_em) VALUES (?, ?, ?, ?, ?)'
      ).run(req.session.profile_token, doenca, medicamento || '', plano, Date.now());
    } catch (saveErr) {
      console.error('Erro ao guardar plano:', saveErr);
    }

    res.json({ ok: true, plano });
  } catch (err) {
    console.error('Erro GROQ:', err);
    res.status(500).json({ ok: false, error: 'Erro ao contactar a IA.' });
  }
});

app.get('/api/planos', requireSession, (req, res) => {
  const rows = profileDb.prepare(
    'SELECT id, doenca, categorias, criado_em FROM planos WHERE profile_token = ? ORDER BY criado_em DESC LIMIT 20'
  ).all(req.session.profile_token);
  res.json({ ok: true, planos: rows });
});

app.get('/api/planos/:id', requireSession, (req, res) => {
  const row = profileDb.prepare(
    'SELECT * FROM planos WHERE id = ? AND profile_token = ?'
  ).get(req.params.id, req.session.profile_token);
  if (!row) return res.status(404).json({ ok: false, error: 'Plano nao encontrado.' });
  res.json({ ok: true, plano: row.plano, doenca: row.doenca, categorias: row.categorias, criado_em: row.criado_em });
});

app.delete('/api/planos/:id', requireSession, (req, res) => {
  profileDb.prepare('DELETE FROM planos WHERE id = ? AND profile_token = ?').run(req.params.id, req.session.profile_token);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`UpWell servidor a correr em http://localhost:${PORT}`);
  console.log('Bases de dados: auth.db + profiles.db');
  console.log(`API key: ${process.env.GROQ_API_KEY ? 'carregada' : 'EM FALTA - verifica o .env'}`);
  console.log(`Dev token: ${process.env.DEV_ACCESS_TOKEN ? 'configurado' : 'nao configurado'}`);
});