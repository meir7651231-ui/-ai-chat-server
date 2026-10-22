#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  design/orbit-generator.check.mjs — רתמת-ההגנה של המסך הראשון של המחולל.
//  פותחת את orbit-generator.html בדפדפן אמיתי (Chromium דרך playwright-core),
//  ומוכיחה בפועל: נגישות-מקלדת, גדלי-מגע, אין גלילה-הצידה, הבנת-משפט, לוח עברי,
//  שמירה ברענון, ביטול, סינון-קלט, הרבה-נתונים, מצב-שגיאה, עבודה-בלי-אינטרנט,
//  התקנה-כאפליקציה, שני מצבי-תצוגה, חתימות-CSP ו-axe (כשזמין).
//
//  node design/orbit-generator.check.mjs              בדיקה (exit 1 על כשל, 2 = לא הורץ)
//  node design/orbit-generator.check.mjs --write-csp  עדכון חתימות-ה-CSP אחרי שינוי בסקריפט/עיצוב
//
//  playwright-core: מ-node_modules, או PLAYWRIGHT_CORE_DIR. דפדפן: CHROMIUM_PATH או /opt/pw-browsers.
//  axe-core (אופציונלי): AXE_CORE_PATH או node_modules. בלי דפדפן ⇒ ⚪ לא הורץ — לעולם לא ירוק-שקט.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const PAGE = path.join(HERE, 'orbit-generator.html');
const ROOT = path.resolve(HERE, '..');

// ── חתימות CSP: sha256 של בלוק ה-<script> וה-<style> הפנימיים ──
const sha = (s) => "'sha256-" + crypto.createHash('sha256').update(s, 'utf8').digest('base64') + "'";
function cspHashes(html) {
  const script = html.match(/<script>([\s\S]*?)<\/script>/);
  const style = html.match(/<style>([\s\S]*?)<\/style>/);
  return { script: sha(script[1]), style: sha(style[1]) };
}
function withCsp(html) {
  const h = cspHashes(html);
  return html.replace(/script-src 'self' [^;]+;/, `script-src 'self' ${h.script};`)
    .replace(/style-src 'self' \S+ https:\/\/fonts\.googleapis\.com;/, `style-src 'self' ${h.style} https://fonts.googleapis.com;`);
}
if (process.argv.includes('--write-csp')) {
  const html = fs.readFileSync(PAGE, 'utf8');
  fs.writeFileSync(PAGE, withCsp(html));
  console.log('✓ חתימות CSP עודכנו');
  process.exit(0);
}

const results = [];
const ok = (name, cond, note = '') => { results.push({ name, pass: !!cond, note }); console.log(`${cond ? '✓' : '✗'} ${name}${note ? ' — ' + note : ''}`); };

{
  const html = fs.readFileSync(PAGE, 'utf8');
  ok('חתימות CSP תואמות לקוד', withCsp(html) === html, 'אם אדום: node design/orbit-generator.check.mjs --write-csp');
}

// ── playwright-core ──
let chromium;
for (const base of [process.env.PLAYWRIGHT_CORE_DIR, path.join(ROOT, 'node_modules'), '/opt/node-tools/node_modules'].filter(Boolean)) {
  try { chromium = createRequire(base.endsWith('/') ? base : base + '/')('playwright-core').chromium; break; } catch { /* הבא */ }
}
const exe = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].filter(Boolean).find((p) => fs.existsSync(p));
if (!chromium || !exe) { console.log('⚪ לא הורץ: חסר playwright-core או Chromium'); process.exit(2); }
let axeSrc = null;
for (const p of [process.env.AXE_CORE_PATH, path.join(ROOT, 'node_modules/axe-core/axe.min.js')].filter(Boolean)) {
  if (fs.existsSync(p)) { axeSrc = fs.readFileSync(p, 'utf8'); break; }
}

// ── שרת סטטי מקומי (שירות-עובד והתקנה דורשים http) ──
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const p = path.join(HERE, decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/+/, ''));
  if (!p.startsWith(HERE) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/orbit-generator.html`;
const browser = await chromium.launch({ executablePath: exe });

async function open(opts = {}, url = BASE) {
  const ctx = await browser.newContext({ viewport: opts.viewport || { width: 1280, height: 900 }, colorScheme: opts.cs || 'dark',
    reducedMotion: opts.rm || 'no-preference', isMobile: !!opts.mobile, hasTouch: !!opts.mobile, deviceScaleFactor: opts.mobile ? 2 : 1, acceptDownloads: true, bypassCSP: !!opts.bypassCSP });
  if (opts.init) await ctx.addInitScript(opts.init);
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => { if (!/fonts\.(googleapis|gstatic)\.com/.test(r.url())) errs.push('requestfailed: ' + r.url()); });
  await page.addInitScript(() => { window.__csp = []; document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective + ' ' + e.blockedURI)); });
  await page.goto(url, { waitUntil: 'load' });
  return { ctx, page, errs };
}
const selectAll = (page) => page.evaluate(() => document.querySelectorAll('.chip[aria-pressed="false"]').forEach((c) => c.click()));
const buildNow = async (page) => { await page.click('#buildBtn'); await page.waitForTimeout(700); };
const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

try {
  // 1 · גדלי-מסך: אין גלילה-הצידה, אין שגיאות, אין הפרות-CSP
  for (const [w, h, mobile] of [[360, 740, true], [768, 1024, true], [1440, 900, false], [740, 360, true]]) {
    const { ctx, page, errs } = await open({ viewport: { width: w, height: h }, mobile });
    await selectAll(page); await buildNow(page);
    ok(`${w}×${h}: אין גלילה הצידה`, (await overflow(page)) <= 0);
    ok(`${w}×${h}: אפס שגיאות`, errs.length === 0, errs.slice(0, 2).join(' | '));
    ok(`${w}×${h}: אפס הפרות CSP`, (await page.evaluate(() => window.__csp.length)) === 0, (await page.evaluate(() => window.__csp.join(','))));
    ok(`${w}×${h}: 5 חלקים נבנו`, (await page.locator('.mod.in').count()) === 5);
    const small = await page.evaluate(() => [...document.querySelectorAll('button, a, select, input, summary')]
      .filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden' && !e.closest('.sr-only') && !e.classList.contains('skip'); })
      .filter((e) => { const r = e.getBoundingClientRect(); return r.height < 44 || r.width < 44; }).map((e) => (e.className || e.tagName) + ':' + Math.round(e.getBoundingClientRect().height)));
    ok(`${w}×${h}: כל מטרות-המגע 44px ומעלה`, small.length === 0, small.slice(0, 4).join(', '));
    if (w === 360) {
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      await page.waitForTimeout(150);
      ok('360: הגדלת טקסט 200% בלי גלילה הצידה', (await overflow(page)) <= 0);
    }
    await ctx.close();
  }

  // 2 · מקלדת בלבד
  {
    const { ctx, page } = await open();
    const seq = [];
    for (let i = 0; i < 8; i++) { await page.keyboard.press('Tab'); seq.push(await page.evaluate(() => document.activeElement.id || document.activeElement.className)); }
    ok('Tab: מתחיל בקישור "דלג לתוכן"', seq[0] === 'skip');
    ok('Tab: מגיע לתיבת המשפט ולכפתור הבנייה', seq.includes('say') && seq.includes('buildBtn'), seq.join(' → '));
    ok('מסגרת פוקוס גלויה', await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle !== 'none'));
    await page.focus('.chip'); await page.keyboard.press('Space');
    ok('רווח מדליק צ׳יפ (aria-pressed)', (await page.getAttribute('.chip', 'aria-pressed')) === 'true');
    await page.keyboard.press('Enter');
    ok('Enter מכבה צ׳יפ', (await page.getAttribute('.chip', 'aria-pressed')) === 'false');
    await page.focus('#say'); await page.keyboard.type('תרומות ולוח עברי'); await page.keyboard.press('Enter'); await page.waitForTimeout(500);
    ok('Enter בתיבת המשפט בונה', (await page.locator('.mod.in').count()) === 2);
    await ctx.close();
  }

  // 3 · הבנת משפט
  {
    const { ctx, page } = await open();
    const u = (t) => page.evaluate((t) => window.__orbitGen.understand(t), t);
    let r = await u('מספרה, רשימת לקוחות ויומן');
    ok('"מספרה, רשימת לקוחות ויומן" ⇒ קליניקה + רשימה + לוח (בלי "סקירה")', r.pack === 'clinic' && r.caps.length === 2 && r.caps.includes('families') && r.caps.includes('calendar'), JSON.stringify(r));
    r = await u('ותרומות בלוח');
    ok('אותיות בתחילת מילה: "ותרומות בלוח" ⇒ תרומות + לוח', r.caps.includes('chart') && r.caps.includes('calendar'), JSON.stringify(r.caps));
    r = await u('תרומת והכנסוט');
    ok('שגיאות כתיב: "תרומת והכנסוט" ⇒ תרומות', r.caps.includes('chart'), JSON.stringify(r.caps));
    r = await u('אני רוצה דוח');
    ok('מילה דו-משמעית "דוח" ⇒ שאלת הבהרה', !!r.ask && r.ask.options.length === 2);
    await page.fill('#say', 'qwerty zxcv'); await page.waitForTimeout(400);
    ok('משפט לא מובן ⇒ הודעה אנושית', /לא הצלחתי להבין/.test(await page.textContent('#understood')));
    await page.fill('#say', '<img src=x onerror=alert(1)> תרומות'); await page.waitForTimeout(400);
    ok('קלט מסונן: אין תגית מוזרקת', (await page.locator('#understood img').count()) === 0);
    await page.fill('#say', ''); await page.click('#buildBtn', { force: true }); await page.waitForTimeout(200);
    ok('בנייה בלי בחירה ⇒ הסבר מה לעשות', /עוד לא בחרתם/.test(await page.textContent('#understood')));
    await ctx.close();
  }

  // 4 · לוח עברי אמיתי (ראש השנה תשפ״ז = 12.9.2026 · חנוכה תשפ״ז מתחיל 5.12.2026)
  {
    const { ctx, page } = await open({}, BASE + '?today=2026-09-12');
    await page.click('.chip[data-id="calendar"]'); await buildNow(page);
    ok('12.9.2026: הכותרת "תשרי תשפ״ז"', /תשרי תשפ״ז/.test(await page.textContent('.calhead b')));
    ok('12.9.2026: היום מסומן במילה "היום"', (await page.locator('.cell.today .mk').textContent()) === 'היום');
    ok('12.9.2026: ראש השנה ויום כיפור ברשימה', /ראש השנה/.test(await page.textContent('.evlist')) && /יום כיפור/.test(await page.textContent('.evlist')));
    await ctx.close();
    const b = await open({}, BASE + '?today=2026-12-06');
    await b.page.click('.chip[data-id="calendar"]'); await buildNow(b.page);
    ok('6.12.2026: חנוכה בכסלו', /כסלו/.test(await b.page.textContent('.calhead b')) && /חנוכה/.test(await b.page.textContent('.evlist')));
    const [dl] = await Promise.all([b.page.waitForEvent('download'), b.page.click('[data-ics="0"]')]);
    const ics = fs.readFileSync(await dl.path(), 'utf8');
    ok('הוספה ליומן: קובץ ics תקין', /BEGIN:VEVENT[\s\S]*DTSTART;VALUE=DATE:\d{8}[\s\S]*END:VCALENDAR/.test(ics));
    await b.ctx.close();
  }

  // 5 · סוג עסק משנה מונחים
  {
    const { ctx, page } = await open();
    await page.selectOption('#vertical', 'shop'); await selectAll(page); await buildNow(page);
    const txt = await page.textContent('#dash');
    ok('חנות: "לקוחות" ו"רכישות" במקום "משפחות" ו"תרומות"', /לקוחות/.test(txt) && /רכישות/.test(txt) && !/משפחות/.test(txt) && !/תרומות/.test(txt));
    await ctx.close();
  }

  // 6 · רענון · לחיצה כפולה · ביטול · יומן
  {
    const { ctx, page } = await open();
    await page.click('.chip[data-id="kpi"]'); await page.click('.chip[data-id="cockpit"]');
    await page.dblclick('#buildBtn'); await page.waitForTimeout(600);
    ok('לחיצה כפולה: לא משכפלת חלקים', (await page.locator('.mod').count()) === 2);
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(500);
    ok('רענון: הבחירה והמערכת נשמרו', (await page.locator('.mod.in').count()) === 2 && (await page.getAttribute('.chip[data-id="kpi"]', 'aria-pressed')) === 'true');
    const before = await page.locator('.task').count();
    await page.click('.task .done'); await page.waitForTimeout(450);
    ok('בוצע: השורה יורדת ומופיעה הודעה עם ביטול', (await page.locator('.task').count()) === before - 1 && (await page.locator('.toast .undo').count()) === 1);
    await page.click('.toast .undo'); await page.waitForTimeout(100);
    ok('ביטול מחזיר את השורה', (await page.locator('.task').count()) === before);
    await page.click('#clearBtn');
    ok('ניקוי: הבחירה התאפסה', (await page.locator('.chip[aria-pressed="true"]').count()) === 0);
    await page.click('.toast .undo');
    ok('ביטול הניקוי מחזיר את הבחירה', (await page.locator('.chip[aria-pressed="true"]').count()) === 2);
    ok('חיווי שמירה', /נשמרה במכשיר/.test(await page.textContent('#saved')));
    ok('יומן פעולות מתעד', (await page.locator('#logList li').count()) >= 4);
    const wa = await page.getAttribute('.task .wa', 'href');
    ok('קישור וואטסאפ בפורמט בינלאומי', /^https:\/\/wa\.me\/9725\d{8}\?text=/.test(wa), wa);
    await ctx.close();
  }

  // 7 · הרבה נתונים + סינון-קלט בטבלה + פרטיות
  {
    const { ctx, page } = await open();
    await page.click('.chip[data-id="families"]'); await buildNow(page);
    ok('טלפונים מוסתרים כברירת מחדל', /•••/.test(await page.textContent('td.ph')));
    const ms = await page.evaluate(() => {
      const rows = Array.from({ length: 5000 }, (_, i) => [i === 3 ? '<img src=x onerror=alert(1)>' : 'שם ' + i, 'עיר', '05' + String(10000000 + i), i % 3 ? 'active' : 'risk']);
      const t0 = performance.now(); window.__orbitGen.setFamilies(rows); return performance.now() - t0;
    });
    await page.waitForTimeout(300);
    ok('5,000 רשומות: מוצג עם דפדוף', /מתוך 5,000/.test(await page.textContent('.tablebar .meta')) && (await page.locator('tbody tr').count()) === 8, Math.round(ms) + 'ms');
    ok('5,000 רשומות: תוך פחות מ-200ms', ms < 200, Math.round(ms) + 'ms');
    ok('קלט מסונן בטבלה: אין תגית מוזרקת', (await page.locator('tbody img').count()) === 0);
    await ctx.close();
  }

  // 8 · מצב שגיאה עם דרך לצאת
  {
    const { ctx, page } = await open({ init: () => { const real = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (...a) { if (this.id !== 'stars') throw new Error('x'); return real.apply(this, a); }; } });
    await page.click('.chip[data-id="chart"]'); await page.click('.chip[data-id="kpi"]'); await buildNow(page);
    ok('תקלה בחלק אחד: הודעה + "נסו שוב", השאר עובד', (await page.locator('.err[role="alert"] button').count()) === 1 && (await page.locator('.kpi').count()) === 3);
    await ctx.close();
  }

  // 9 · שני מצבי תצוגה + הפחתת תנועה
  {
    const { ctx, page } = await open({ cs: 'light', rm: 'reduce' });
    ok('מצב בהיר לפי המערכת', await page.evaluate(() => getComputedStyle(document.body).backgroundColor === 'rgb(245, 246, 252)'));
    await page.click('#themeBtn');
    ok('כפתור מצב-תצוגה מעביר לכהה', (await page.getAttribute('html', 'data-theme')) === 'dark');
    await selectAll(page); await buildNow(page);
    ok('הפחתת תנועה: אין אנימציות רצות', (await page.evaluate(() => document.getAnimations().length)) === 0);
    await ctx.close();
  }

  // 10 · axe-core (WCAG 2.0/2.1 A+AA) בשני המצבים
  if (axeSrc) {
    for (const cs of ['dark', 'light']) {
      const { ctx, page } = await open({ cs, rm: 'reduce', bypassCSP: true }); // ה-CSP חוסם הזרקה — נכון; כאן מזריקים רק את axe
      await selectAll(page); await buildNow(page);
      await page.addScriptTag({ content: axeSrc });
      const v = await page.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] })).violations.map((x) => x.id + '×' + x.nodes.length));
      ok(`axe ${cs}: אפס הפרות WCAG A/AA`, v.length === 0, v.join(', '));
      await ctx.close();
    }
  } else console.log('⚪ axe-core לא נמצא — דלג (AXE_CORE_PATH)');

  // 11 · עבודה בלי אינטרנט + התקנה כאפליקציה
  {
    // התקנה נבדקת בפרופיל רגיל (לא גלישה-בסתר — שם Chrome לעולם לא מציע התקנה)
    const dir = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'orbit-gen-'));
    const ctx = await chromium.launchPersistentContext(dir, { executablePath: exe, viewport: { width: 1280, height: 900 } });
    const page = ctx.pages()[0] || await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'load' });
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload({ waitUntil: 'load' });
    const cdp = await ctx.newCDPSession(page);
    const inst = await cdp.send('Page.getInstallabilityErrors');
    ok('אפשר להתקין כאפליקציה (אפס שגיאות התקנה)', inst.installabilityErrors.length === 0, JSON.stringify(inst.installabilityErrors));
    await ctx.setOffline(true);
    await page.reload({ waitUntil: 'load' });
    ok('בלי אינטרנט: המסך עולה', /משפט אחד/.test(await page.textContent('h1')));
    await ctx.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }

  // 11ב · עוד התנהגויות: מיון, דפדוף, העתקה, מקלדת-טלפון, עץ-נגישות, שמירה-חסומה, תגובה-מיידית, אורך-קלט
  {
    const { ctx, page } = await open();
    await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.click('.chip[data-id="families"]');
    const t0 = await page.evaluate(() => { window.__t0 = performance.now(); return 0; });
    await page.click('#buildBtn');
    const firstMs = await page.evaluate(() => new Promise((r) => { const f = () => document.querySelector('.mod.in') ? r(performance.now() - window.__t0) : requestAnimationFrame(f); f(); }));
    ok('תגובה מיידית: החלק הראשון מופיע תוך 100ms', firstMs < 100, Math.round(firstMs) + 'ms');
    ok('אחרי הבנייה מוצג הצעד הבא', await page.isVisible('#next .cta'));
    await page.click('th button[data-k="1"]');
    ok('מיון לפי עיר', (await page.getAttribute('th:nth-child(2)', 'aria-sort')) === 'ascending' && (await page.textContent('tbody tr td:nth-child(2)')) === 'אשדוד');
    await page.evaluate(() => window.__orbitGen.setFamilies(Array.from({ length: 20 }, (_, i) => ['שם ' + i, 'עיר', '0500000' + String(100 + i), 'active'])));
    await page.click('.pager [data-act="next"]');
    ok('דפדוף לעמוד הבא', /עמוד 2 מתוך 3/.test(await page.textContent('.pager')));
    await page.click('#copySpec'); await page.waitForTimeout(200);
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    ok('העתקת המפרט ללוח', clip.split('\n').length >= 3 && /כרטיס/.test(clip));
    await page.fill('#say', 'א'.repeat(500));
    ok('קלט ארוך נחתך ב-200 תווים', (await page.inputValue('#say')).length === 200);
    const ax = await page.accessibility.snapshot({ interestingOnly: true });
    const flat = []; (function walk(n) { if (!n) return; flat.push(n); (n.children || []).forEach(walk); })(ax);
    const chipsAx = flat.filter((n) => n.role === 'button' && n.pressed !== undefined && !/טלפונים/.test(n.name));
    ok('קורא מסך: הצ׳יפים מוכרזים ככפתורים עם מצב לחוץ', chipsAx.length === 5, chipsAx.map((n) => n.name + ':' + n.pressed).join(', '));
    ok('קורא מסך: לכל כפתור וקישור יש שם', flat.filter((n) => (n.role === 'button' || n.role === 'link') && !String(n.name || '').trim()).length === 0);
    ok('קורא מסך: שדה המשפט מוכרז עם התווית', flat.some((n) => n.role === 'textbox' && /במשפט/.test(n.name)));
    await ctx.close();
  }
  {
    const { ctx, page } = await open({ viewport: { width: 360, height: 300 }, mobile: true });
    await page.tap('#say'); await page.waitForTimeout(700);
    const r = await page.evaluate(() => { const b = document.querySelector('#say').getBoundingClientRect(); return b.top >= 0 && b.bottom <= innerHeight; });
    ok('מקלדת פתוחה (גובה 300): תיבת המשפט נשארת גלויה', r);
    await ctx.close();
  }
  {
    const { ctx, page } = await open({ init: () => { Storage.prototype.setItem = () => { throw new Error('blocked'); }; } });
    await page.click('.chip[data-id="kpi"]');
    ok('שמירה חסומה בדפדפן ⇒ חיווי "לא נשמרה"', /לא נשמרה/.test(await page.textContent('#saved')));
    await ctx.close();
  }

  // 12 · חיבור למחולל: כל שורת-מפרט מתחילה במילת-צורה מהלקסיקון
  {
    const lex = JSON.parse(fs.readFileSync(path.join(ROOT, 'engine/knowledge/lexicon.json'), 'utf8'));
    const { ctx, page } = await open();
    await selectAll(page); await buildNow(page);
    const lines = await page.evaluate(() => window.__orbitGen.specLines());
    const bad = lines.slice(1).filter((l) => !Object.prototype.hasOwnProperty.call(lex, l.split(/\s+/)[0]));
    ok('מפרט למחולל: כל שורה במילת-צורה מוכרת', bad.length === 0, bad.join(' | '));
    await ctx.close();
  }
} finally {
  await browser.close();
  server.close();
}

const failed = results.filter((r) => !r.pass);
console.log(`\n${failed.length ? '🚨' : '✅'} ${results.length - failed.length}/${results.length} בדיקות ירוקות`);
process.exit(failed.length ? 1 : 0);
