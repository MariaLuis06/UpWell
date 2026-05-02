require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve os ficheiros HTML/CSS/JS do frontend
app.use(express.static(path.join(__dirname, 'public')));

// ─── BASE DE DADOS ────────────────────────────────────────────────────────
const db = new Database('upwell.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    anon_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
`);

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'upwell_salt').digest('hex');
}

// ─── AUTH ENDPOINTS ───────────────────────────────────────────────────────

// Registo
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
    const stmt = db.prepare('INSERT INTO users (anon_id, email, password_hash, created_at) VALUES (?, ?, ?, ?)');
    stmt.run(anonId, email.toLowerCase(), passwordHash, Date.now());
    res.json({ ok: true, anonId });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ ok: false, error: 'Este email já está registado.' });
    }
    res.status(500).json({ ok: false, error: 'Erro no servidor.' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ ok: false, error: 'Campos em falta.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Email não encontrado.' });
  }

  const passwordHash = hashPassword(password);
  if (user.password_hash !== passwordHash) {
    return res.status(401).json({ ok: false, error: 'Password incorreta.' });
  }

  res.json({ ok: true, anonId: user.anon_id, email: user.email });
});

// ─── GROQ PROXY ──────────────────────────────────────────────────────

app.post('/api/gerar', async (req, res) => {
  const { doenca, medicamento, sideEffects, restricoes } = req.body;

  if (!doenca || !medicamento || !sideEffects) {
    return res.status(400).json({ ok: false, error: 'Dados em falta.' });
  }

  // Nota: os dados de saúde chegam aqui mas NUNCA são guardados na base de dados
  // São usados apenas para chamar a API e descartados

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: `Sou um utilizador com ${doenca} e tomo ${medicamento}.
Os efeitos secundários conhecidos deste medicamento são: ${sideEffects.join(', ')}.${restricoes ? `\nAlimentos que NÃO devo incluir no plano: ${restricoes}.` : ''}

Cria um plano alimentar semanal completo (7 dias) em português europeu que:
1. Contrabalance cada efeito secundário listado com escolhas alimentares específicas
2. Seja prático e com alimentos acessíveis em Portugal
3. Inclua pequeno-almoço, almoço e jantar para cada dia
4. Explique brevemente (1 linha) porque cada refeição ajuda

Formato da resposta:
- Um parágrafo introdutório curto (2-3 frases)
- Depois cada dia: "**Segunda-feira**" seguido das 3 refeições
- No final, 3 dicas gerais de bem-estar para este medicamento

Sê específico, prático e encorajador.`
        }]
      })
    });

    const data = await response.json();
    const plano = data.choices?.[0]?.message?.content;

    if (!plano) {
      return res.status(500).json({ ok: false, error: 'Erro ao gerar plano.' });
    }

    // Devolvemos só o plano — os dados de saúde não são guardados
    res.json({ ok: true, plano });

  } catch (err) {
    console.error('Erro GROQ:', err);
    res.status(500).json({ ok: false, error: 'Erro ao contactar a IA.' });
  }
});

// ─── START ────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅ UpWell servidor a correr em http://localhost:${PORT}`);
  console.log(`📁 Base de dados: upwell.db`);
  console.log(`🔒 API key: ${process.env.GROQ_API_KEY ? 'carregada' : 'EM FALTA — verifica o .env'}`);
});