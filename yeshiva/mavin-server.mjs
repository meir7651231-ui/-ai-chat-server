// ════════════════════════════════════════════════════════════════════════════════
//  yeshiva/mavin-server.mjs — 🚪 **השרת של המחולל.** משפט נכנס ⇒ אפליקציה יוצאת, דרך אותה דלת בדיוק
//  (knowledge/connect/2026-09-22/build-check.mjs בתהליך-בן). השרת לא מחליט, לא מנחש, לא כותב קוד: מריץ ומעביר.
//  ────────────────────────────────────────────────────────────────────────────────
//  · הרשומות של המחולל (בניות · שאלות · בחירות · אטומים · יכולות · הכרעות · שערים) = הסכמה ב-mavin-server.data.json.
//  · המשפט של המחולל על עצמו (GET /sentence) מחובר מהסכמה + הרשומות החיות; הדלת בונה ממנו את האפליקציה של המחולל
//    (התאום-HTML מוגש ב-/). אפס קוד-מסך ביד — המסך הוא פלט-הדלת.
//  · התאום שומר רשומות אצל השרת (gen/render.mjs: מוגש-מ-http ⇒ /api/data). שורת-«בנייה» חדשה עם משפט ⇒ בנייה.
//    כל אפליקציה שנבנתה מקבלת אחסון משלה: /build/<id>/api/data («שרת בענן» של הישויות שלה).
//  · שלב 1 (שניות): הדלת בלי מארח ⇒ צורה · שאלות · פנקס · תאום-HTML. שלב 2 (דקות, ברקע, אם BS_HOST): --verify --shot.
//    בנייה אחת בכל רגע (המארח משותף).
//  שימוש: [BS_HOST=<app_flutter>] node yeshiva/mavin-server.mjs [--port 8765] [--builds <dir>] [--no-self]
//  מסלולים: GET / · GET|PUT /api/data · GET /sentence · POST /self · GET /builds · POST /build {sentence,answers}
//           GET /build/:id · GET /build/:id/app · GET|PUT /build/:id/api/data · GET|POST /build/:id/api/feed/:ent (מקור מבחוץ) · GET /build/:id/files/:name · POST /register {id}
// ════════════════════════════════════════════════════════════════════════════════
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const D = JSON.parse(fs.readFileSync(path.join(HERE, 'mavin-server.data.json'), 'utf8'));
const T = (k, v = {}) => String(D.T[k] || k).replace(/\{(\w+)\}/g, (_, x) => v[x] ?? '');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const PORT = +opt('--port', process.env.MAVIN_PORT || 8765);
const BUILDS = path.resolve(opt('--builds', process.env.MAVIN_BUILDS || path.join(os.tmpdir(), 'mavin-builds')));
const HOST = process.env.BS_HOST && fs.existsSync(process.env.BS_HOST) ? process.env.BS_HOST : '';
const DOOR = path.join(ROOT, 'knowledge/connect/2026-09-22/build-check.mjs');
fs.mkdirSync(BUILDS, { recursive: true });

// ── רשומות קבועות של המחולל (נקראות פעם אחת בעלייה) ──
const clean = (v) => String(v ?? '').replace(/[,;:.«»]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 40);
function atomsCollection() {
  return import('../machtzev/generator/atom-sig.mjs').then(async (AS) => {
    const { fits, score, ROLES } = await import('../machtzev/generator/auto-skin.mjs');
    const man = (f) => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')).atoms || []; } catch { return []; } };
    const all = [...man('new/dart-forge-bs/forge-manifest.json').map((a) => [a, 'forge']), ...[...AS.atomSigs().values()].map((a) => [a, 'buildsmart']), ...man('new/dart-synth-bs/synth-manifest.json').map((a) => [a, 'synth'])];
    return all.map(([a, src]) => {
      let best = null; for (const r of Object.keys(ROLES)) { if (!fits(a, ROLES[r])) continue; const s = score(r, a); if (s != null && (!best || s > best[1])) best = [r, s]; }
      return [a.cls, D.families[a.family] || a.family || '', D.sources[src] || src, best ? String(Math.round(best[1] * 10) / 10) : ''];
    });
  }).catch(() => []);
}
function capabilitiesCollection() {
  try { return (JSON.parse(fs.readFileSync(path.join(ROOT, 'machtzev/generator/knowledge/composites.json'), 'utf8')).composites || []).map((c) => [c.key, c.ops.map((o) => o.atom).join('+'), c.purpose || '']); } catch { return []; }
}
function decisionsCollection() {
  try {
    const out = [];
    for (const l of fs.readFileSync(path.join(ROOT, 'machtzev/DECISIONS.md'), 'utf8').split('\n')) {
      const m = l.match(/^(\d+)\.\s+\S+\s+(?:\((\d{1,2}\.\d{1,2})\)\s+)?\*\*(.+?)\*\*(?:\s*\((\d{1,2}\.\d{1,2}))?/); if (!m) continue;   // שתי צורות-שורה: «N. 🔴 (23.8) **כותרת**» · «N. 🔴 **כותרת** (23.9, …)»
      out.push([m[1], m[3].replace(/^[^·]*·\s*[^·]*·\s*/, '').slice(0, 60), (m[2] || m[4] || '') + '.' + new Date().getFullYear()]);
    }
    return out;
  } catch { return []; }
}
function gatesCollection() {
  try { return fs.readFileSync(path.join(ROOT, 'machtzev/gates.tsv'), 'utf8').split('\n').filter((l) => l.trim() && !l.startsWith('#')).map((l) => [l.split('\t')[0], D.gateState]); } catch { return []; }
}
const FIXED = { atoms: [], capabilities: capabilitiesCollection(), decisions: decisionsCollection(), gates: gatesCollection() };

// ── בניות ──
const builds = [];
const bdir = (b) => path.join(BUILDS, String(b.id));
const persist = (b) => fs.writeFileSync(path.join(bdir(b), 'build.json'), JSON.stringify(b, null, 1));
const today = () => new Date().toISOString().slice(0, 10);
for (const d of fs.existsSync(BUILDS) ? fs.readdirSync(BUILDS).filter((x) => /^\d+$/.test(x)).sort((a, b) => a - b) : []) {
  try { builds.push(JSON.parse(fs.readFileSync(path.join(BUILDS, d, 'build.json'), 'utf8'))); } catch {}
}
let nextId = builds.reduce((m, b) => Math.max(m, b.id), 0) + 1;
function newBuild(sentence, { label = '', answers = {}, self = false } = {}) {
  const b = { id: nextId++, label: label || `${D.phrases.buildLabel} ${nextId - 1}`, sentence: String(sentence || '').trim(), answers, self, date: today(), stage: D.entities[0].stages[0], stageDate: today(), ms: 0, spec: [], questions: [], picks: [], screens: [], errors: 0, synth: 0, notes: [], gen: '', log: '', verified: null, registered: false };
  fs.mkdirSync(bdir(b), { recursive: true }); builds.push(b); persist(b); queue.push(b); pump(); log(T('queued', { label: b.label, sentence: b.sentence.slice(0, 60) }));
  return b;
}
const log = (s) => process.stdout.write(s + '\n');
// שני תורים: שלב 1 (שניות, בלי מארח) ושלב 2 (דקות, המארח משותף ⇒ אחד בכל רגע). תצוגה-מקדימה לא מחכה להוכחות של בנייה קודמת
const queue = []; let running = null; const vqueue = []; let verifying = null;
function pump() {
  if (!running && queue.length) { running = queue.shift(); runBuild(running).catch((e) => { running.notes.push(String(e.message || e)); persist(running); }).finally(() => { running = null; pump(); }); }
  if (!verifying && vqueue.length) { verifying = vqueue.shift(); verifyBuild(verifying).catch((e) => { verifying.notes.push(String(e.message || e)); persist(verifying); }).finally(() => { verifying = null; pump(); }); }
}
function door(b, extra, env) {
  return new Promise((res) => {
    const argv = [DOOR, b.sentence, ...extra];
    if (b.answers && Object.keys(b.answers).length) { const af = path.join(bdir(b), 'answers.json'); fs.writeFileSync(af, JSON.stringify(b.answers)); argv.push('--answers', af); }
    let out = ''; const t0 = Date.now();
    const p = spawn(process.execPath, argv, { cwd: ROOT, env: { ...process.env, TMPDIR: bdir(b), MAVIN_ANSWERS: path.join(BUILDS, 'answers.jsonl'), ...env } });   // זיכרון-ההגדרות משותף לכל הבניות של השרת
    p.stdout.on('data', (d) => { out += d; }); p.stderr.on('data', (d) => { out += d; });
    p.on('close', (code) => res({ out, code, ms: Date.now() - t0 }));
  });
}
function parseDoor(b, out) {
  const lines = out.split('\n');
  const i0 = lines.findIndex((l) => /^אפיון:/.test(l));
  if (i0 >= 0) { b.spec = []; for (const l of lines.slice(i0 + 1)) { if (!/^  /.test(l) || /^  (מסלול|לא נכנסו|כבר מובנה|⚖|\?|החלטה|הרכבה|🧪)/.test(l)) break; b.spec.push(l.trim()); } }
  b.questions = lines.filter((l) => /^\s+\? /.test(l)).map((l) => { const km = l.match(/ \[([^\]]+)\]\s*$/); const [text, def = ''] = l.replace(/^\s+\? /, '').replace(/ \[[^\]]+\]\s*$/, '').split(' ⇒ '); return { text: text.trim(), def: def.trim(), key: km ? km[1] : '', answer: (b.questions.find((q) => q.text === text.trim()) || {}).answer || '' }; });   // [מפתח] = שאלת-הגדרה: התשובה נכנסת ל---answers תחת המפתח
  b.picks = lines.map((l) => l.match(/^\s+⚖️ (.+?) ⇒ (\S+) \((.+?)\)(?: · פליגא (\d+))?/)).filter(Boolean).map((m) => [m[1], m[2], m[3], m[4] || '0']);
  const sc = lines.find((l) => /^מסכים: /.test(l)); b.screens = sc ? sc.replace(/^מסכים: /, '').split(' · ') : [];
  b.errors = lines.filter((l) => /error •/.test(l)).length;
  b.synth = lines.filter((l) => /🧪/.test(l)).length;
  b.notes = lines.filter((l) => /^  (החלטה|הרכבה|בלגן)|^בלגן על הפלט/.test(l)).map((l) => l.trim().slice(0, 200));
  const v = lines.map((l) => l.match(/^מוצג-בפועל: (\d+)\/(\d+) מסכים · עבר (\d+) · נכשל (\d+)/)).find(Boolean);
  if (v) b.verified = { shown: +v[1], of: +v[2], passed: +v[3], failed: +v[4], accept: lines.filter((l) => /^מול הייעוד: ✅/.test(l)).length, acceptFailed: lines.filter((l) => /^מול הייעוד: ❌/.test(l)).length };
  const gens = fs.readdirSync(bdir(b)).filter((x) => x.startsWith('mavin-build-')).map((x) => path.join(bdir(b), x, 'gen')).filter((g) => fs.existsSync(path.join(g, 'app.html'))).sort((a, c) => fs.statSync(a).mtimeMs - fs.statSync(c).mtimeMs);
  if (gens.length) b.gen = gens[gens.length - 1];
  b.shots = b.gen ? fs.readdirSync(b.gen).filter((f) => /\.png$/.test(f)) : [];
}
const setStage = (b, s) => { b.stage = s; b.stageDate = today(); persist(b); };
async function runBuild(b) {
  const st = D.entities[0].stages;
  const r1 = await door(b, [], { BS_HOST: '' });   // שלב 1 בלי מארח ⇒ שניות
  b.ms = r1.ms; b.log = r1.out; fs.writeFileSync(path.join(bdir(b), 'log.txt'), r1.out); parseDoor(b, r1.out);
  setStage(b, b.questions.length ? st[1] : st[2]);
  log(T('phase1', { label: b.label, stage: b.stage, ms: b.ms, screens: b.screens.length, questions: b.questions.length, errors: b.errors }));
  if (b.self && onSelf) onSelf(b);
  if (!HOST) { log(T('phase2skip', { label: b.label, why: T('noHost') })); return; }
  if (!b.screens.length || b.errors) { log(T('phase2skip', { label: b.label, why: b.errors })); return; }
  vqueue.push(b); pump();
}
async function verifyBuild(b) {
  const st = D.entities[0].stages;
  const r2 = await door(b, ['--verify', '--shot'], { BS_HOST: HOST });
  b.log = r2.out; fs.writeFileSync(path.join(bdir(b), 'log-verify.txt'), r2.out); parseDoor(b, r2.out);
  try { const web = path.join(HOST, 'build', 'web-chk'); if (fs.existsSync(path.join(web, 'index.html'))) { const dst = path.join(bdir(b), 'web'); fs.rmSync(dst, { recursive: true, force: true }); fs.cpSync(web, dst, { recursive: true }); b.web = true; } } catch (e) { b.notes.push(String(e.message || e)); }   // אפליקציית-Flutter של הבנייה מוגשת ב-/build/<id>/flutter/ (api/data יחסי ⇒ הסנכרון עובד)
  if (b.verified) setStage(b, st[3]); else persist(b);
  log(T('phase2', { label: b.label, shown: b.verified ? b.verified.shown : 0, of: b.verified ? b.verified.of : 0, accept: b.verified ? b.verified.accept : 0, shots: b.shots.length }));
}

// ── רשומות ⇒ צורת-התאום (מערך-לישות לפי סדר-הסכמה; שורה = שדות + [שלב, תאריך-שלב, תאריך-רישום]) ──
const visible = () => builds.filter((b) => !b.self && !b.removed);
function collections() {
  const bs = visible();
  return {
    builds: bs.map((b) => [b.label, b.sentence, b.date, b.stage, String(b.screens.length), String(b.questions.length), String(b.errors), (b.shots || []).includes('shot.png') ? `/build/${b.id}/files/shot.png` : '', b.stage, b.stageDate, b.date]),   // צילום = כתובת-קובץ מהשרת; התאום מציג ערך בצורת-תמונה כתמונה
    questions: bs.flatMap((b) => b.questions.map((q) => [b.label, q.text, q.def, q.answer])),
    picks: bs.flatMap((b) => b.picks.map((p) => [b.label, ...p])),
    atoms: FIXED.atoms, capabilities: FIXED.capabilities, decisions: FIXED.decisions, gates: FIXED.gates,
  };
}
function data() { const c = collections(); return D.entities.map((e) => (c[e.collection] || []).map((r) => r.length > e.fields.length ? r : [...r, e.stages ? e.stages[0] : '', '', today()])); }
// שינוי מהתאום: שורות-בנייה חדשות (שם לא מוכר, משפט לא ריק) ⇒ בנייה; תשובה חדשה לשאלה ⇒ בנייה מחדש עם התשובה; שורה שנעלמה ⇒ הוסרה
function acceptData(d) {
  const ei = D.entities.findIndex((e) => e.collection === 'builds'), qi = D.entities.findIndex((e) => e.collection === 'questions');
  if (ei < 0 || !Array.isArray(d[ei])) return;
  const seen = new Set();
  for (const row of d[ei]) { const label = String(row[0] || '').trim(), sentence = String(row[1] || '').trim(); const b = visible().find((x) => x.label === label); if (b) { seen.add(b.id); continue; } if (sentence) seen.add(newBuild(sentence, { label }).id); }
  for (const b of visible()) if (!seen.has(b.id)) { b.removed = true; persist(b); }
  if (qi >= 0 && Array.isArray(d[qi])) for (const row of d[qi]) { const b = visible().find((x) => x.label === String(row[0] || '').trim()); const t = String(row[1] || '').trim(); const q = b && b.questions.find((x) => x.text === t || (x.key && x.key === t)); /* שורת-שאלה מהתאום: אותה בנייה + הטקסט או המפתח («מתקשה») = אותה שאלה; התשובה בשדה-התשובה */ if (q && String(row[3] || '') !== q.answer) { q.answer = String(row[3] || ''); b.answers[q.key || q.text] = q.answer; persist(b); if (!queue.includes(b) && running !== b) { queue.push(b); pump(); } } }
}

// ── המשפט של המחולל על עצמו: סכמה + דוגמאות מהרשומות החיות ──
function selfSentence() {
  const c = collections(); const P = D.phrases;
  const ents = D.entities.map((e) => { const rows = (c[e.collection] || []).slice(0, 3).map((r) => r.slice(0, e.fields.length).map(clean).join(', ')); return `${P.each} ${e.name} ${P.has} ${e.fields.join(', ')}${e.stages ? `; ${P.stages}: ${e.stages.join(', ')}` : ''}${rows.length ? `; ${P.example}: ${rows.join('; ')}` : ''}.`; });
  return `${D.app} ${P.look} ${D.look}: ${ents.join(' ')} ${[...D.conditions, ...D.tail].join('; ')}`;
}
let cockpit = null, onSelf = null;
function buildSelf() { const b = newBuild(selfSentence(), { label: D.app, self: true }); onSelf = (x) => { if (x === b && x.gen) cockpit = x; }; return b; }

// ── HTTP ──
const perBuildData = (b) => path.join(bdir(b), 'data.json');
// 📡 מקור מבחוץ (הכרעת-בעלים 24.9 «מקור הוא גם צורה»): מערכת חיצונית שולחת שורות (POST …/api/feed/<ישות>: מערך-שורות או {rows}) ⇒ נשמרות לפי סדר (seq) ⇒ האפליקציה מושכת GET …?since=<n> ⇒ {rows, next}
const feedFile = (b, slug) => path.join(bdir(b), `feed-${String(slug).replace(/[^\w-]/g, '')}.jsonl`);
const feedRead = (b, slug) => { const f = feedFile(b, slug); return fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : []; };
async function feedRoute(req, res, b, slug, u) {
  if (req.method === 'GET') { const since = +(u.searchParams.get('since') || 0); const all = feedRead(b, slug); return json(res, 200, { rows: all.filter((x) => x.seq > since).map((x) => x.row), next: all.length ? all[all.length - 1].seq : since }); }
  if (req.method === 'POST') { let d; try { d = JSON.parse(await body(req)); } catch { return text(res, 400, T('badJson')); } const rows = Array.isArray(d) ? d : Array.isArray(d && d.rows) ? d.rows : null; if (!rows) return text(res, 400, T('badJson'));
    const all = feedRead(b, slug); let seq = all.length ? all[all.length - 1].seq : 0; fs.mkdirSync(bdir(b), { recursive: true }); fs.appendFileSync(feedFile(b, slug), rows.map((row) => JSON.stringify({ seq: ++seq, at: new Date().toISOString(), row })).join('\n') + '\n'); return json(res, 200, { ok: true, added: rows.length, next: seq }); }
  return text(res, 405, T('notFound'));
}
const json = (res, code, obj) => { res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(obj)); };
const text = (res, code, s, type = 'text/plain; charset=utf-8') => { res.writeHead(code, { 'content-type': type }); res.end(s); };
const file = (res, f) => { if (!f || !fs.existsSync(f)) return text(res, 404, T('notFound')); const ext = path.extname(f); text(res, 200, fs.readFileSync(f), { '.html': 'text/html; charset=utf-8', '.png': 'image/png', '.json': 'application/json; charset=utf-8' }[ext] || 'text/plain; charset=utf-8'); };
const body = (req) => new Promise((res) => { let s = ''; req.on('data', (d) => { s += d; }); req.on('end', () => res(s)); });
const pub = (b) => ({ id: b.id, label: b.label, flutter: b.web ? (b.self ? '/flutter/' : `/build/${b.id}/flutter/`) : null, sentence: b.sentence, date: b.date, stage: b.stage, stageDate: b.stageDate, ms: b.ms, spec: b.spec, questions: b.questions, picks: b.picks, screens: b.screens, errors: b.errors, synth: b.synth, notes: b.notes, verified: b.verified, shots: b.shots || [], app: b.gen ? `/build/${b.id}/app` : null, registered: b.registered });
const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x'); const p = u.pathname; const m = p.match(/^\/build\/(\d+)(?:\/(.*))?$/);
  try {
    if (p === '/' ) return cockpit && cockpit.gen ? file(res, path.join(cockpit.gen, 'app.html')) : text(res, 503, T('cockpitPending'));
    const fm = p.match(/^(?:\/build\/(\d+))?\/flutter\/(.*)$/);   // /flutter/… = הקוקפיט ב-Flutter · /build/<id>/flutter/… = האפליקציה שנבנתה ב-Flutter (מ-build/web של המארח אחרי ההוכחה)
    if (fm) { const b = fm[1] ? builds.find((x) => x.id === +fm[1]) : cockpit; if (!b || !b.web) return text(res, 404, T('notFound'));
      const base = fm[1] ? `/build/${b.id}/flutter/` : '/flutter/'; const rel = fm[2] || 'index.html';
      { const fd = rel.match(/^api\/feed\/([\w-]+)$/); if (fd && fm[1]) return feedRoute(req, res, b, fd[1], u); }
      if (rel === 'api/data' && req.method === 'GET') return fm[1] ? file(res, fs.existsSync(perBuildData(b)) ? perBuildData(b) : null) : json(res, 200, data());
      if (rel === 'api/data' && req.method === 'PUT') { const s0 = await body(req); try { JSON.parse(s0); } catch { return text(res, 400, T('badJson')); } if (fm[1]) fs.writeFileSync(perBuildData(b), s0); else acceptData(JSON.parse(s0)); return json(res, 200, { ok: true }); }
      const f = path.join(bdir(b), 'web', ...rel.split('/').filter((x) => x && x !== '..'));
      if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return text(res, 404, T('notFound'));
      if (/index\.html$/.test(f)) return text(res, 200, fs.readFileSync(f, 'utf8').replace(/<base href="[^"]*">/, `<base href="${base}">`), 'text/html; charset=utf-8');   // base = הנתיב שממנו מוגש
      const ext = path.extname(f); return text(res, 200, fs.readFileSync(f), { '.js': 'application/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.png': 'image/png', '.css': 'text/css', '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml', '.otf': 'font/otf', '.ttf': 'font/ttf', '.woff2': 'font/woff2' }[ext] || 'application/octet-stream'); }
    if (p === '/api/data' && req.method === 'GET') return json(res, 200, data());
    if (p === '/api/data' && req.method === 'PUT') { let d; try { d = JSON.parse(await body(req)); } catch { return text(res, 400, T('badJson')); } acceptData(d); return json(res, 200, { ok: true }); }
    if (p === '/sentence') return text(res, 200, selfSentence());
    if (p === '/self' && req.method === 'POST') return json(res, 202, pub(buildSelf()));
    if (p === '/builds') return json(res, 200, builds.filter((b) => !b.removed).map(pub));
    if (p === '/build' && req.method === 'POST') { let d; try { d = JSON.parse(await body(req)); } catch { return text(res, 400, T('badJson')); } if (!d.sentence) return text(res, 400, T('badJson')); return json(res, 202, pub(newBuild(d.sentence, { answers: d.answers || {} }))); }
    if (p === '/register' && req.method === 'POST') { let d; try { d = JSON.parse(await body(req)); } catch { return text(res, 400, T('badJson')); } const b = builds.find((x) => x.id === +d.id); if (!b || !b.gen) return text(res, 404, T('notFound'));
      const cmds = [...fs.readdirSync(b.gen).filter((f) => /^insight_.*\.json$/.test(f)).map((f) => ['machtzev/generator/insight.mjs', '--register', path.join(b.gen, f)]), ...(fs.readdirSync(b.gen).some((f) => /^gen_synth_.*\.dart$/.test(f)) ? [['machtzev/generator/display-synth.mjs', '--register', b.gen]] : [])];
      const outs = cmds.map((c) => spawnSync(process.execPath, c, { cwd: ROOT, encoding: 'utf8' }).stdout); b.registered = true; setStage(b, D.entities[0].stages[4]); log(T('registered', { label: b.label, n: cmds.length })); return json(res, 200, { ok: true, ran: cmds.length, out: outs }); }
    if (m) { const b = builds.find((x) => x.id === +m[1]); if (!b) return text(res, 404, T('notFound')); const sub = m[2] || '';
      if (!sub) return json(res, 200, pub(b));
      if (sub === 'app') return file(res, b.gen && path.join(b.gen, 'app.html'));
      { const fd = sub.match(/^api\/feed\/([\w-]+)$/); if (fd) return feedRoute(req, res, b, fd[1], u); }
      if (sub === 'api/data' && req.method === 'GET') { if (fs.existsSync(perBuildData(b))) return file(res, perBuildData(b)); let n = 0; try { n = JSON.parse(fs.readFileSync(path.join(b.gen, 'gen-report.json'), 'utf8')).entities.length; } catch {} return json(res, 200, Array.from({ length: n }, () => [])); }
      if (sub === 'api/data' && req.method === 'PUT') { const s = await body(req); try { JSON.parse(s); } catch { return text(res, 400, T('badJson')); } fs.writeFileSync(perBuildData(b), s); return json(res, 200, { ok: true }); }
      if (sub === 'log') return text(res, 200, b.log);
      const f = sub.match(/^files\/([^/]+)$/); if (f && b.gen) return file(res, path.join(b.gen, path.basename(f[1])));
    }
    return text(res, 404, T('notFound'));
  } catch (e) { return text(res, 500, String(e.message || e)); }
});
FIXED.atoms = await atomsCollection();
server.listen(PORT, () => { log(T('up', { port: PORT, dir: BUILDS, host: HOST || T('noHost') })); if (!args.includes('--no-self')) { log(T('selfBuilding')); buildSelf(); } });
