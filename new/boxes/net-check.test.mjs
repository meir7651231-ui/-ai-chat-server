/** בדיקת-קצה: הקופסה המלאה — יעדים ⇒ הרצה-מקבילית ⇒ טקסט-להקראה.
 *  DoD (דיבר 12): node net-check.test.mjs ⇒ exit 0. מייבאת רק את הקופסה-שלה. */
import { targets, run, script, diagnose } from './net-check.mjs';
import { readFileSync } from 'node:fs';
import assert from 'node:assert';

let f = 0;
const bad = (msg) => { console.error('✗ ' + msg); f = 1; };

// 1) מקומי-בלבד (firebase=null) ⇒ יעד יחיד, בלי googleapis
{
  const t = targets('https://a.co', null, 'X');
  if (t.length !== 1) bad('null-firebase: ציפיתי ליעד יחיד');
  assert.deepStrictEqual(t[0], { key: 'site', label: 'האתר עצמו', url: 'https://a.co/version.json?netcheck=X', domain: 'a.co' });
}

// 2) עם ענן מלא ⇒ 4 יעדים; token=POST; מזהים משורשרים ל-URL
{
  const t = targets('https://a.co', { projectId: 'p1', apiKey: 'k1' }, 'X');
  if (t.length !== 4) bad('cloud: ציפיתי ל-4 יעדים');
  if (t.map((x) => x.key).join(',') !== 'site,auth,token,db') bad('סדר-היעדים השתנה');
  const token = t.find((x) => x.key === 'token');
  if (token.method !== 'POST') bad('token אינו POST');
  if (!token.url.includes('key=k1')) bad('apiKey לא שורשר');
  if (token.body !== 'grant_type=refresh_token&refresh_token=netcheck') bad('token.body השתנה');
  if (!t.find((x) => x.key === 'db').url.includes('/projects/p1/')) bad('projectId לא שורשר');
}

// 3) firebase={} (חסר projectId/apiKey) ⇒ ברירת-מחדל 'netcheck', עדיין 4 יעדים
{
  const t = targets('https://a.co', {}, 'X');
  if (t.length !== 4) bad('firebase-ריק: ציפיתי ל-4 יעדים (אובייקט truthy)');
  if (!t.find((x) => x.key === 'token').url.includes('key=netcheck')) bad('ברירת-מחדל apiKey');
  if (!t.find((x) => x.key === 'db').url.includes('/projects/netcheck/')) bad('ברירת-מחדל projectId');
}

// 4) עדשה-עוינת: apiKey/projectId עם תו-מיוחד ⇒ encodeURIComponent
{
  const t = targets('https://a.co', { projectId: 'p/1', apiKey: 'k&x' }, 'X');
  if (!t.find((x) => x.key === 'token').url.includes('key=k%26x')) bad('apiKey לא קודד (&)');
  if (!t.find((x) => x.key === 'db').url.includes('/projects/p%2F1/')) bad('projectId לא קודד (/)');
}

// 5) עדשה-עוינת: origin עם נתיב/פורט ⇒ domain = host בלבד
{
  const t = targets('https://sub.a.co:8443/base', null, 'X');
  if (t[0].domain !== 'sub.a.co:8443') bad('domain אינו host נקי');
  if (t[0].url !== 'https://sub.a.co:8443/base/version.json?netcheck=X') bad('url site שגוי');
}

// 6) script — אין חסום ⇒ ריק; יש חסום ⇒ טקסט-פתיחה + דומיינים
if (script([{ ok: true }, { ok: true }]) !== '') bad('script: הכול-פתוח לא החזיר ריק');
{
  const s = script([{ ok: false, domain: 'firestore.googleapis.com' }, { ok: true, domain: 'a.co' }]);
  if (!s.includes('• firestore.googleapis.com')) bad('script: הדומיין החסום חסר');
  if (s.includes('• a.co')) bad('script: דומיין פתוח דלף לרשימה');
  if (!s.endsWith('תודה רבה!')) bad('script: חתימה חסרה');
}
// עדשה-עוינת: רשימת-תוצאות ריקה ⇒ ריק (אין חסום)
if (script([]) !== '') bad('script: ריק לא החזיר ריק');

// 7) run — עוטף את run-net-check: מקבילי, בסדר, ברירת-מחדל 8000
{
  const calls = [];
  const fake = (t, ms) => { calls.push([t.key, ms]); return Promise.resolve({ ...t, ok: true }); };
  const t = targets('https://a.co', { projectId: 'p', apiKey: 'k' }, 'X');
  const res = await run(t, undefined, fake);
  if (calls.length !== 4) bad('run: checkOne לא נקרא 4 פעמים');
  if (!calls.every(([, ms]) => ms === 8000)) bad('run: ברירת-מחדל timeout אינה 8000');
  if (res.map((r) => r.key).join(',') !== 'site,auth,token,db') bad('run: סדר-התוצאות השתנה');
}

// 8) diagnose — הזרימה המלאה targets→run→script עם timeout מפורש
{
  const seen = [];
  const fake = (t, ms) => { seen.push(ms); return Promise.resolve({ ...t, ok: t.key !== 'site' }); };
  const out = await diagnose({ origin: 'https://a.co', firebase: null, randToken: 'Z', checkOne: fake, timeoutMs: 500 });
  if (seen.length !== 1 || seen[0] !== 500) bad('diagnose: timeout מפורש לא הושחל');
  if (out.targets.length !== 1) bad('diagnose: יעדים שגויים');
  if (!out.script.includes('• a.co')) bad('diagnose: site החסום לא הופיע בטקסט');
}

/* 🛡 מגן-הכרעה: התוויות/ברירות-המחדל/סדר-החיווט חתומים במקור-הקופסה. */
const src = readFileSync(new URL('./net-check.mjs', import.meta.url), 'utf8');
for (const anchor of [
  "site: 'האתר עצמו'",
  "auth: 'כניסה לחשבון (Auth)'",
  "token: 'חידוש-חיבור (Token)'",
  "db: 'סנכרון נתונים (Firestore)'",
  "BUST_PREFIX = 'netcheck='",
  "PROBE = 'netcheck'",
  "method: 'POST'",
]) if (!src.includes(anchor)) bad('מגן-הכרעה: עוגן חסר — ' + anchor);
// שער-היעדים לפני ההרצה: targets מוגדר לפני run בגוף-הקובץ
if (src.indexOf('export function targets') > src.indexOf('export const run')) bad('מגן: run הוגדר לפני targets');

if (f) process.exit(1);
console.log('✓ קופסת net-check: יעדים+encode+script+run+diagnose+מגן-הכרעה — כל תרחישי-הקצה ירוקים');
