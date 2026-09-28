import 'dotenv/config';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.argv.includes('--prod') || process.env.NODE_ENV === 'production';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@kangdikin.desa.id').trim().toLowerCase();
const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH ||
  '72eb1446c64dc1ef8c97391416887254:973f10e13060d1fd3716e9bce2b4da3a9e305c8f392c3d81adb87e6461a7ef1438e7e524a01a3699f9699027d42d2781b87ecd8722daf456ba25d06918578c27b92414ffa298d7a013ffb4f79b100feccb4c530a29b2a6c5fa132604b013a2e7';
const SESSION_SECRET =
  process.env.SESSION_SECRET || 'b92414ffa298d7a013ffb4f79b100feccb4c530a29b2a6c5fa132604b013a2e7';

const COOKIE_NAME = 'kd_session';
const SESSION_TTL = 8 * 60 * 60 * 1000; // 8 jam

// ---------- Auth helpers ----------
function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  return expected.length === derived.length && crypto.timingSafeEqual(derived, expected);
}

const sign = (data: string) =>
  crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');

function createToken(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({ email, exp: Date.now() + SESSION_TTL })
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function readToken(token?: string): { email: string } | null {
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(payload));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (typeof data.exp !== 'number' || data.exp < Date.now()) return null;
    return { email: data.email };
  } catch {
    return null;
  }
}

function getSession(req: Request) {
  const cookie = req.headers.cookie || '';
  const match = cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  return readToken(match?.slice(COOKIE_NAME.length + 1));
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!getSession(req)) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// ---------- Data store (file JSON) ----------
const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

function readDb(): any | null {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return null;
  }
}

function writeDb(data: unknown) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data));
  fs.renameSync(tmp, DB_FILE);
}

const ARRAY_KEYS = [
  'programs',
  'programCategories',
  'rws',
  'rts',
  'deposits',
  'sales',
  'utilizations',
  'itemTypes',
  'utilizationTypes',
];

function isValidState(s: any): boolean {
  return (
    !!s &&
    ARRAY_KEYS.every((k) => Array.isArray(s[k])) &&
    typeof s.frontPageContent === 'object' &&
    s.frontPageContent !== null
  );
}

// Publik hanya boleh melihat program aktif+publik dan transaksi yang is_public
function toPublicState(s: any) {
  const programs = s.programs.filter((p: any) => p.is_active && p.is_public);
  const ids = new Set(programs.map((p: any) => p.id));
  const visible = (x: any) => x.is_public && ids.has(x.program_id);
  return {
    ...s,
    programs,
    deposits: s.deposits.filter(visible),
    sales: s.sales.filter(visible),
    utilizations: s.utilizations.filter(visible),
  };
}

// ---------- App ----------
const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '5mb' }));

const fails = new Map<string, { count: number; until: number }>();

app.post('/api/login', (req, res) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const rec = fails.get(ip);
  if (rec && rec.until > now && rec.count >= 5) {
    return res
      .status(429)
      .json({ error: 'Terlalu banyak percobaan. Coba lagi 15 menit lagi.' });
  }

  const { email, password } = req.body ?? {};
  const ok =
    typeof email === 'string' &&
    typeof password === 'string' &&
    email.trim().toLowerCase() === ADMIN_EMAIL &&
    verifyPassword(password, ADMIN_PASSWORD_HASH);

  if (!ok) {
    const cur = rec && rec.until > now ? rec : { count: 0, until: now + 15 * 60 * 1000 };
    cur.count++;
    fails.set(ip, cur);
    return res.status(401).json({ error: 'Email atau password salah.' });
  }

  fails.delete(ip);
  res.cookie(COOKIE_NAME, createToken(ADMIN_EMAIL), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.COOKIE_SECURE === 'true',
    maxAge: SESSION_TTL,
    path: '/',
  });
  res.json({
    user: {
      id: 'u-admin-1',
      name: 'Pengelola KANG DIKIN',
      email: ADMIN_EMAIL,
      role: 'admin',
    },
  });
});

app.post('/api/logout', (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ ok: true });
});

app.get('/api/me', (req, res) => {
  res.set('Cache-Control', 'no-store');
  const s = getSession(req);
  res.json({
    user: s
      ? { id: 'u-admin-1', name: 'Pengelola KANG DIKIN', email: s.email, role: 'admin' }
      : null,
  });
});

app.get('/api/state', (req, res) => {
  res.set('Cache-Control', 'no-store');
  const db = readDb();
  if (!db) return res.json({ state: null });
  res.json({ state: getSession(req) ? db : toPublicState(db) });
});

app.put('/api/state', requireAdmin, (req, res) => {
  if (!isValidState(req.body)) {
    return res.status(400).json({ error: 'Format data tidak valid.' });
  }
  writeDb(req.body);
  res.json({ ok: true });
});

async function start() {
  if (!IS_PROD) {
    const { createServer } = await import('vite');
    const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const dist = path.join(process.cwd(), 'dist');
    app.use(express.static(dist));
    app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  }
  app.listen(PORT, '0.0.0.0', () =>
    console.log(`KANG DIKIN berjalan di http://localhost:${PORT}`)
  );
}

start();