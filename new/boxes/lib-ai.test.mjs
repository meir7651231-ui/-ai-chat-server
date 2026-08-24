/** בדיקת-קצה: הקופסה המלאה — כספת-מפתח (nsLsKey/storage מוזרקים) · פרומפט-תודה ·
 *  קריאה-ל-Claude (doFetch מוזרק). DoD: node lib-ai.test.mjs ⇒ exit 0. */
import { readAiKey, writeAiKey, thanksPrompt, askClaude } from './lib-ai.mjs';
let f = 0;

// שקע-אחסון דמוי, עם מתג-זריקה (מצב-פרטי)
function makeStore(init = {}, opts = {}) {
  const m = { ...init };
  return {
    m,
    getItem: (k) => { if (opts.throwGet) throw new Error('blocked'); return k in m ? m[k] : null; },
    setItem: (k, v) => { if (opts.throwSet) throw new Error('blocked'); m[k] = v; },
    removeItem: (k) => { if (opts.throwSet) throw new Error('blocked'); delete m[k]; },
  };
}
const id = (b) => b;
const org = (b) => b + ':org1';

// ── readAiKey ──
if (readAiKey(id, makeStore({ maor_ai_key: 'sk-abc' })) !== 'sk-abc') { console.error('✗ קריאת-מפתח'); f = 1; }
if (readAiKey(id, makeStore({})) !== '') { console.error('✗ חסר ⇒ ריק'); f = 1; }
if (readAiKey(id, makeStore({}, { throwGet: true })) !== '') { console.error('✗ storage-זורק ⇒ ריק'); f = 1; }
if (readAiKey(org, makeStore({ 'maor_ai_key:org1': 'sk-x' })) !== 'sk-x') { console.error('✗ מרחב-שם בקריאה'); f = 1; }

// ── writeAiKey ──
let s = makeStore();
writeAiKey(id, s, '  sk-abc  ');
if (s.m.maor_ai_key !== 'sk-abc') { console.error('✗ כתיבה+גזימה'); f = 1; }
s = makeStore({ maor_ai_key: 'old' });
writeAiKey(id, s, '   ');
if ('maor_ai_key' in s.m) { console.error('✗ רווחים ⇒ מחיקה'); f = 1; }
s = makeStore({ maor_ai_key: 'old' });
writeAiKey(id, s, '');
if ('maor_ai_key' in s.m) { console.error('✗ ריק ⇒ מחיקה'); f = 1; }
s = makeStore();
writeAiKey(org, s, 'sk-y');
if (s.m['maor_ai_key:org1'] !== 'sk-y') { console.error('✗ מרחב-שם בכתיבה'); f = 1; }
try { writeAiKey(id, makeStore({}, { throwSet: true }), 'sk-z'); } catch { console.error('✗ storage-חסום לא נבלע'); f = 1; }

// round-trip: כתיבה ⇒ קריאה מחזירה את מה שנכתב
s = makeStore();
writeAiKey(id, s, 'sk-round');
if (readAiKey(id, s) !== 'sk-round') { console.error('✗ round-trip כספת'); f = 1; }

// ── thanksPrompt ──
const pMin = thanksPrompt({ orgName: 'מאור', supporterName: 'דנה', lastAmount: '₪500' });
if (pMin.split('\n').length !== 4) { console.error('✗ פרומפט-מינימלי ≠ 4 שורות'); f = 1; }
if (!thanksPrompt({ orgName: '', supporterName: 'א', lastAmount: '₪1' }).includes('מארגון "הארגון"')) { console.error('✗ ברירת-הארגון'); f = 1; }
const pFull = thanksPrompt({ orgName: 'מאור', supporterName: 'ר׳ כהן', lastAmount: '₪500', designation: 'אמץ חתן', totalSoFar: '₪2,000' });
if (pFull.split('\n').length !== 6 || !pFull.includes('התרומה יועדה ל: אמץ חתן.')) { console.error('✗ פרומפט-מלא'); f = 1; }

// ── askClaude (doFetch מוזרק, אפס רשת) ──
const okFetch = async (_u, init) => ({ ok: true, status: 200, json: async () => ({ content: [{ type: 'text', text: '  שלום  ' }] }), _init: init });
const bad = (status) => async () => ({ ok: false, status, json: async () => ({}) });
let captured = null;
const capFetch = async (u, init) => { captured = { u, init }; return okFetch(u, init); };
if (await askClaude('sk', 'פרומפט', capFetch) !== 'שלום') { console.error('✗ askClaude הצלחה+גזימה'); f = 1; }
if (captured.u !== 'https://api.anthropic.com/v1/messages') { console.error('✗ URL'); f = 1; }
if (captured.init.headers['x-api-key'] !== 'sk' || captured.init.headers['anthropic-dangerous-direct-browser-access'] !== 'true') { console.error('✗ כותרות'); f = 1; }
if (JSON.parse(captured.init.body).model !== 'claude-haiku-4-5-20251001') { console.error('✗ מודל'); f = 1; }
for (const [st, msg] of [[401, 'מפתח ה-API לא תקין — בדקו בהגדרות'], [429, 'חריגה ממכסת-השימוש — נסו בעוד רגע'], [500, 'הקריאה לעוזר נכשלה (500)']]) {
  try { await askClaude('sk', 'p', bad(st)); console.error('✗ ' + st + ' לא זרק'); f = 1; }
  catch (e) { if (e.message !== msg) { console.error('✗ הודעת-' + st + ': ' + e.message); f = 1; } }
}
try { await askClaude('sk', 'p', async () => ({ ok: true, status: 200, json: async () => ({ content: [] }) })); console.error('✗ טקסט-ריק לא זרק'); f = 1; }
catch (e) { if (e.message !== 'לא התקבלה תשובה — נסו שוב') { console.error('✗ הודעת-ריק'); f = 1; } }

/* 🛡 מגן-הכרעה: KEY_BASE verbatim + ייבוא-אטומים-בלבד (אפס ייבוא-קופסה). */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./lib-ai.mjs', import.meta.url), 'utf8');
if (!src.includes("const KEY_BASE = 'maor_ai_key';")) { console.error('✗ מגן: KEY_BASE שונה מהמקור'); f = 1; }
const imports = [...src.matchAll(/from\s+'([^']+)'/g)].map((m) => m[1]);
if (!imports.every((p) => p.startsWith('../atoms/'))) { console.error('✗ מגן: ייבוא שאינו-אטום (חוק-2/3)'); f = 1; }
if (!imports.includes('../atoms/thanks-prompt.mjs') || !imports.includes('../atoms/ask-claude.mjs')) { console.error('✗ מגן: חסר ייבוא-אטום מהגרף'); f = 1; }

if (f) process.exit(1);
console.log('✓ קופסת-lib-ai: כספת-מפתח (מרחב-שם/גזימה/מחיקה/storage-חסום) + פרומפט + askClaude — כל תרחישי-הקצה ירוקים');
