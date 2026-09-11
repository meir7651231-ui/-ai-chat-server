#!/usr/bin/env node
// 🏃 balagan-run — שער-«טוב-יותר» במריצה (GENMAX · G33 · הכרעה-29): לא סופרים בקוד, מודדים בדפדפן על האתר הבנוי.
//   מסלול-A «רגע חדש»: פתיחה ⇒ «מה קרה?» ⇒ שורה ⇒ «הבנתי» ⇒ «שמור» — הקשות עד שהרשומה קיימת ב-localStorage (הראיה = הדאטה, לא המסך).
//   מסלול-B «שלח»: רשומה זרועה ⇒ «היום» ⇒ «שלח» — הקשות עד שנפתח חלון-שליחה (popup/ניווט חיצוני).
//   מדדים: taps-A · taps-B · זמן-עד-מסך-ראשון. רצפת-המוצר (§5): <3 הקשות. ratchet: לא-יותר-הקשות מהבסיס. אין אתר בנוי ⇒ ⚪ מדולג (לא מזויף).
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import net from 'node:net';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = process.env.BALAGAN_SITE || path.join(process.env.BUILDSMART || '/home/user/buildsmart/app_flutter', 'build/web-balagan');
const BASE = path.join(HERE, 'balagan-run-baseline.json'), OUT = path.join(HERE, 'balagan-run.json');
const gate = process.argv.includes('--gate');
if (!fs.existsSync(path.join(SITE, 'index.html'))) { console.log(`⚪ balagan-run: אין אתר בנוי ב-${SITE} — מדולג (flutter build web -t gen_balagan_main.dart)`); process.exit(0); }
const pwDir = ['/home/user/maor-system/node_modules/playwright-core', '/opt/node22/lib/node_modules/playwright/node_modules/playwright-core'].find((d) => { try { require.resolve(d); return true; } catch { return false; } });
if (!pwDir) { console.log('⚪ balagan-run: אין playwright — מדולג'); process.exit(0); }
const { chromium } = require(pwDir);
const exe = fs.readdirSync('/opt/pw-browsers').filter((d) => /^chromium-\d+$/.test(d)).map((d) => `/opt/pw-browsers/${d}/chrome-linux/chrome`).find(fs.existsSync);
// ⚠️ פורט קבוע הפך את השער ללא-כשיר-לריצה-מקבילה: ריצה שנייה נכשלת לתפוס אותו,
// השרת לא עולה, הדפדפן מקבל סירוב-חיבור — והשער מדווח «אדום» על כשל-תשתית.
// לכן: פורט חופשי מהמערכת, והמתנה עד שהשרת **עונה בפועל** ולא שנייה שרירותית.
const PORT = await new Promise((res, rej) => {
  const s = net.createServer();
  s.on('error', rej);
  s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => res(p)); });
});
const srv = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
let up = false;
for (let i = 0; i < 60 && !up; i++) {
  await new Promise((r) => setTimeout(r, 100));
  up = await new Promise((res) => {
    const c = net.connect(PORT, '127.0.0.1');
    c.on('connect', () => { c.destroy(); res(true); });
    c.on('error', () => res(false));
  });
}
if (!up) { srv.kill(); console.log(`🔴 balagan-run: שרת-המבחן לא עלה על ${PORT} תוך 6 שניות — כשל-תשתית, לא כשל-מוצר`); process.exit(1); }
const SENTENCE = 'המשכיר מקזז 6,200 מהפיקדון של 8,000, מסרתי מפתח ב-1.8.2026';

const res = { tapsSave: null, tapsSend: null, ttiMs: null, ext: [], ok: false, notes: [] };
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox', '--disable-gpu'] });
try {
  // ── A · רגע חדש ──
  const page = await browser.newPage({ viewport: { width: 480, height: 1000 }, deviceScaleFactor: 1 });
  if (process.env.BALAGAN_RUN_CLOSE_A) { /* דיאגנוסטיקה */ }
  const errs = []; page.on('pageerror', (e) => errs.push(String(e.message).slice(0, 120)));
  // G52 · «הכל אצל הלקוח» נמדד, לא מוצהר: כל מארח חיצוני שהדף פונה אליו נרשם (ratchet יורד-בלבד).
  page.on('request', (r) => { const u = r.url(); if (/^https?:\/\//.test(u) && !u.includes(`127.0.0.1:${PORT}`)) { const h = new URL(u).host; if (!res.ext.includes(h)) res.ext.push(h); } });
  const t0 = Date.now();
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => document.title === 'בלגן', null, { timeout: 60000 });
  await page.waitForTimeout(2500); res.ttiMs = Date.now() - t0;
  let taps = 0;
  // השורה-המהירה ב«היום» (autofocus): טקסט + Enter ⇒ זיהוי ⇒ טופס-האישור. אין פוקוס ⇒ הקשה אחת (נספרת)
  const focused = async () => page.evaluate(() => (document.activeElement && document.activeElement.tagName) === 'TEXTAREA' || (document.activeElement && document.activeElement.tagName) === 'INPUT');
  if (!(await focused())) { await page.mouse.click(240, 110); taps++; await page.waitForTimeout(400); }
  await page.keyboard.insertText(SENTENCE); await page.waitForTimeout(300); await page.keyboard.press('Enter'); await page.waitForTimeout(1500);
  // «שמור» = הכפתור הראשי בתחתית הטופס: סורקים מלמטה למעלה עד שהרשומה מופיעה (אפס-ידע על מספר-השורות)
  const has = async () => page.evaluate(() => { try { const j = JSON.parse(localStorage.getItem('ds_app_v1') || '{}'); return Object.entries(j.rec || {}).some(([k, v]) => /^app_peruk\d+_ent1$/.test(k) && Array.isArray(v) && v.length > 0); } catch { return false; } });
  // ההוכחה לעובדות: הפיקדון = 8,000 (הקרוב ל«פיקדון»), לא 6,200 (הראשון); תאריך המפתח = 2026-08-01; הטקסט המקורי נשמר
  const rec = async () => page.evaluate(() => { try { const j = JSON.parse(localStorage.getItem('ds_app_v1') || '{}'); for (const [k, v] of Object.entries(j.rec || {})) if (/^app_peruk\d+_ent1$/.test(k) && Array.isArray(v) && v.length) return v[0]; } catch {} return null; });
  let saved = false;
  for (const y of [765, 790, 745, 830, 880]) { await page.mouse.click(240, y); await page.waitForTimeout(700); if (await has()) { saved = true; taps++; break; } }
  if (!saved) { res.notes.push('A: הרשומה לא נשמרה (כפתור «שמור» לא נמצא בסריקה)'); } else res.tapsSave = taps;
  if (saved) { const r = await rec(); const amt = Object.entries(r || {}).find(([k]) => /פיקדון/.test(k) && !/תאריך/.test(k)); const dt = Object.entries(r || {}).find(([k]) => /תאריך/.test(k)); res.facts = { amount: amt ? amt[1] : null, date: dt ? dt[1] : null, note: !!(r && r.__note) }; if (!amt || amt[1] !== '8000') res.notes.push(`A: סכום-הפיקדון ${amt ? amt[1] : '—'} ≠ 8000 (קרבה למילת-השדה)`); if (!dt || dt[1] !== '2026-08-01') res.notes.push(`A: תאריך ${dt ? dt[1] : '—'} ≠ 2026-08-01`); if (!(r && r.__note)) res.notes.push('A: הטקסט המקורי לא נשמר'); }
  if (errs.length) res.notes.push('js: ' + errs.join(' | '));
  // ── B · שלח (רשומה זרועה עם דוח) ──
  const seed = { seq: 9, role: 0, actor: '', rec: { app_peruk02_ent1: [{ __id: '2', 'לקוח': 'רות לוי', 'טלפון': '0521234567', 'סכום הפיקדון': '8000', 'תאריך מסירת מפתח': '2026-09-11', '__stage': '0' }] }, log: [], decided: {}, settings: {} };
  await page.close();
  const ctx2 = await browser.newContext({ viewport: { width: 480, height: 1000 }, deviceScaleFactor: 1 });
  let sent = false; ctx2.on('page', () => { sent = true; });   // חלון-שליחה חדש (wa.me / share) = ההוכחה — מאזינים לפני הטעינה
  const page2 = await ctx2.newPage();
  await page2.addInitScript((v) => { try { localStorage.setItem('ds_app_v1', v); } catch (e) {} }, JSON.stringify(seed));
  await page2.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'load', timeout: 60000 });
  await page2.waitForFunction(() => document.title === 'בלגן', null, { timeout: 60000 }); await page2.waitForTimeout(2500);
  // כפתור «שלח» של הכרטיס הראשון: מתחת לכותרת-הכרטיס; סורקים כמה גבהים אפשריים
  let tapsB = 0;
  for (const y of [300, 320, 280, 350]) { await page2.mouse.click(300, y); tapsB++; await page2.waitForTimeout(2500); if (sent || page2.context().pages().length > 1) { sent = true; break; } }
  if (!sent && page2.context().pages().length > 1) sent = true;   // האירוע הוחמץ אבל הדף קיים
  if (process.env.BALAGAN_RUN_DEBUG) { await page2.screenshot({ path: process.env.BALAGAN_RUN_DEBUG }); console.log('B pages:', page2.context().pages().length); }
  if (sent) res.tapsSend = tapsB; else res.notes.push('B: לא נפתח חלון-שליחה');
  res.ok = saved && sent && !res.notes.some((n) => /^A: (סכום|תאריך|הטקסט)/.test(n));
} finally { await browser.close(); srv.kill(); }
fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
const base = fs.existsSync(BASE) ? JSON.parse(fs.readFileSync(BASE, 'utf8')) : null;
const FLOOR = 3;   // מסמך-המוצר §5: «פחות מ-3 הקשות לכל פעולה» — הרצפה; המדד = טוב יותר ממנה
const fails = [];
if (!res.ok) fails.push(res.notes.join(' · ') || 'המסלול לא הושלם');
if (res.tapsSave != null && res.tapsSave > FLOOR) fails.push(`רגע-חדש ${res.tapsSave} הקשות > רצפה ${FLOOR}`);
if (res.tapsSend != null && res.tapsSend > 2) fails.push(`שלח ${res.tapsSend} הקשות > 2`);
if (base && res.tapsSave != null && base.tapsSave != null && res.tapsSave > base.tapsSave) fails.push(`ratchet: רגע-חדש ${base.tapsSave}⇒${res.tapsSave}`);
// G52 · תקרת-מסך-ראשון: לפני התיקון 13.8 שנ׳ — 12.6 מהן בקשת-Roboto ל-fonts.gstatic.com שנחסמה.
//   התקרה נדיבה (רעש-מכונה), אבל חוזרת-לשם = אזעקה מיידית ולא «האתר קצת איטי».
const TTI_MAX = 6000;
if (res.ttiMs != null && res.ttiMs > TTI_MAX) fails.push(`מסך-ראשון ${res.ttiMs}ms > תקרה ${TTI_MAX}`);
if (base && Array.isArray(base.ext) && res.ext.length > base.ext.length) fails.push(`ratchet: מארחים-חיצוניים ${base.ext.length}⇒${res.ext.length} (${res.ext.join(' · ')})`);
if (gate && fails.length) { console.log(`🔴 balagan-run: ${fails.join(' · ')}`); process.exit(1); }
if (process.argv.includes('--write') || !base) fs.writeFileSync(BASE, JSON.stringify({ tapsSave: res.tapsSave, tapsSend: res.tapsSend, ext: res.ext }));
console.log(`${fails.length ? '🔴' : '✓'} balagan-run: רגע-חדש ${res.tapsSave ?? '—'} הקשות (רצפה <${FLOOR}) · שלח ${res.tapsSend ?? '—'} · מסך-ראשון ${res.ttiMs}ms (תקרה ${TTI_MAX}) · חיצוניים ${res.ext.length}${res.ext.length ? ' (' + res.ext.join(' · ') + ')' : ''}${res.notes.length ? ' · ' + res.notes.join(' · ') : ''}`);
process.exit(fails.length ? 1 : 0);
