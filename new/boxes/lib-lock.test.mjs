/** בדיקת-קצה: קופסת-הנעילה המלאה — מפתח-תחום · קריאה/כתיבה · תיקוף/גיבוב/אימות.
 *  DoD: `node lib-lock.test.mjs` ⇒ exit 0. מייבאת אך-ורק את הקופסה-שלה (חוק-4). */
import {
  LOCK_ZONES, DEFAULT_LOCK_ZONES,
  lockKey, readLock, writeLock, isValidPin, hashPin, verifyPin,
} from './lib-lock.mjs';
import assert from 'node:assert';

let f = 0;
const fail = (m) => { console.error('✗ ' + m); f = 1; };

// storage-דמה נשלט (localStorage-דמוי) עם מתג-זריקה למצב-פרטי
function mkStore(init = {}) {
  const m = new Map(Object.entries(init));
  let throwOn = null; // 'get' | 'set' | null
  return {
    obj: {
      getItem: (k) => { if (throwOn === 'get') throw new Error('blocked'); return m.has(k) ? m.get(k) : null; },
      setItem: (k, v) => { if (throwOn === 'set') throw new Error('blocked'); m.set(k, String(v)); },
      removeItem: (k) => { m.delete(k); },
    },
    map: m,
    setThrow: (t) => { throwOn = t; },
  };
}

// ── 1) קבועי-אזורים ──
assert.deepStrictEqual(LOCK_ZONES.map((z) => z.key), ['wizard', 'settings', 'supporters', 'reports']);
assert.deepStrictEqual(DEFAULT_LOCK_ZONES, ['wizard', 'settings']);

// ── 2) lockKey: nsLsKey מוזרק, הבסיס תמיד 'maor_lock' ──
if (lockKey((b) => b) !== 'maor_lock') fail('lockKey default');
if (lockKey((b) => `${b}:demo`) !== 'maor_lock:demo') fail('lockKey slug');

// ── 3) isValidPin: 4–8 ספרות ──
for (const [p, exp] of [['1234', true], ['123', false], ['12345678', true], ['123456789', false], ['12a4', false], ['', false]]) {
  if (isValidPin(p) !== exp) fail(`isValidPin(${JSON.stringify(p)})≠${exp}`);
}

// ── 4) hashPin: ווקטורים מספריים מהמקור (SALT מוזרק בקופסה) ──
const H1234 = 'c4891e76dc712dd3dd24f7409c935524c99ea8a4fc677e76a260f33ed6d78c20';
const H0000 = 'bdedd3bab37144fe1536d5c7481c18624ed1c0de572a5978049b2553aa16a47d';
const H8765 = 'ea82e3faa05f2bf3cb024f49bc0c27d885213f6323cb32f8b8d746309672f6f5';
if (await hashPin('1234') !== H1234) fail('hashPin 1234');
if (await hashPin('0000') !== H0000) fail('hashPin 0000');
if (await hashPin('87654321') !== H8765) fail('hashPin 87654321');
if (await hashPin('1234') !== await hashPin('1234')) fail('hashPin לא-דטרמיניסטי');

// ── 5) verifyPin: שרשרת-המלח (hashPin המחווט) + גיבוב-חסר ⇒ false ──
if (!(await verifyPin('1234', H1234))) fail('verifyPin נכון');
if (await verifyPin('1234', H0000)) fail('verifyPin שגוי אמור false');
if (await verifyPin('1234', undefined)) fail('verifyPin undefined');
if (await verifyPin('1234', '')) fail('verifyPin ריק (falsy)');

// ── 6) writeLock/readLock round-trip + מחיקה-בריק ──
{
  const s = mkStore();
  const ns = (b) => `${b}:demo`;
  writeLock(ns, s.obj, { primary: 'h1' });
  if (s.map.get('maor_lock:demo') !== JSON.stringify({ primary: 'h1' })) fail('writeLock לא כתב לתחום');
  assert.deepStrictEqual(readLock(ns, s.obj), { primary: 'h1' });
  writeLock(ns, s.obj, {}); // ריק ⇒ מחיקה
  if (s.map.has('maor_lock:demo')) fail('writeLock ריק לא מחק');
  assert.deepStrictEqual(readLock(ns, s.obj), {});
}

// ── 7) מיגרציה-רכה: תחום בלי מפתח-משלו נופל ל-bare 'maor_lock' ──
{
  const s = mkStore({ maor_lock: JSON.stringify({ primary: 'old' }) });
  const ns = (b) => `${b}:demo`;
  assert.deepStrictEqual(readLock(ns, s.obj), { primary: 'old' });
  // default (bare) לא נופל לעצמו אינסופית — קורא ישירות
  assert.deepStrictEqual(readLock((b) => b, s.obj), { primary: 'old' });
}

// ── 8) עמידות: storage-שזורק ו-JSON-פגום ⇒ {} / נבלע ──
{
  const s = mkStore(); s.setThrow('get');
  assert.deepStrictEqual(readLock((b) => b, s.obj), {}, 'getItem-זורק ⇒ {}');
  s.setThrow('set');
  writeLock((b) => b, s.obj, { primary: 'x' }); // אמור להיבלע בלי זריקה
  const bad = mkStore({ maor_lock: '{לא-json' });
  assert.deepStrictEqual(readLock((b) => b, bad.obj), {}, 'JSON-פגום ⇒ {}');
}

/* 🛡 מגן-הכרעה: הבדיקה קוראת את מקור-הקופסה ומאמתת הכרעות verbatim. */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./lib-lock.mjs', import.meta.url), 'utf8');
if (!src.includes("const SALT = 'maor.lock.v1::';")) fail('מגן: המלח שונה מהמקור');
if (!src.includes("const LOCK_BASE = 'maor_lock';")) fail('מגן: בסיס-המיגרציה שונה');
// verifyPin חייב להזריק את hashPin המחווט (הנושא SALT), לא את החוט הגולמי
if (!src.includes('verifyPinAtom(pin, hash, hashPin)')) fail('מגן: verifyPin לא מזריק את hashPin המחווט — שרשרת-המלח נשברה');
if (src.includes('verifyPinAtom(pin, hash, hashPinAtom)')) fail('מגן: verifyPin מזריק חוט-גולמי בלי SALT');

if (f) process.exit(1);
console.log('✓ קופסת-הנעילה: אזורים · lockKey · תיקוף · גיבוב(3 ווקטורים) · אימות · round-trip · מיגרציה-רכה · עמידות — ירוק');
