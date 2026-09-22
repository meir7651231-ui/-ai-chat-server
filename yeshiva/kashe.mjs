// ══════════════════════════════════════════════════════════════════════════
//  yeshiva/kashe.mjs — 🕯️ **המקשה.** המנוע שואל את הישיבה את השאלה הקשה,
//  לפני שהוא כותב שורה. שכבה אחת, אחות ל-`ask.mjs` (המתרץ).
//  ────────────────────────────────────────────────────────────────────────
//  הממצא שזה מתקן (MAP-yeshiva · 19.9): «המחולל לקח את המתרץ ולא את המקשה».
//  `ask.mjs` מעביר לישיבה טענות-להשוואה (engine.py — המתרץ). כאן, לעומת זאת,
//  אנחנו שואלים את **maimatai** דרך `gate detect`: אילו שאלות הבקשה מעלה
//  לפני שמכריעים משהו. זה המסלול שהמחולל דילג עליו.
//
//  איתור הישיבה: **אותו** `yeshivaHome()` של `ask.mjs` (מקור-אחד, L111) —
//  סימן בדיסק, לא נתיב-שזכרתי. אין ישיבה ⇒ `{ available:false, reason }`,
//  ולא ברירת-מחדל שקטה: הקורא נשאר בהתנהגות-של-היום ורושם «לא-נמדד».
//
//  🔒 אפס-הכרעה כאן: אין שורה שמסתכלת על תוכן שאלה ומחליטה משהו. השאלות
//  מוחזרות כפי שהמקשה העלה אותן. ההכרעה מה לעשות בהן — לא כאן.
//
//  שימוש:
//    import { askMaimatai } from '<...>/yeshiva/kashe.mjs';
//    const k = askMaimatai("<משפט חופשי>");
//    if (!k.available) { /* התנהגות-של-היום + רישום k.reason */ }
//    else for (const s of k.seeds) { /* s.kind, s.text */ }
// ══════════════════════════════════════════════════════════════════════════
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { yeshivaHome } from './ask.mjs';   // מקור-אחד לאיתור הישיבה (L111)

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PY = () => process.env.PYTHON || 'python3';

/** שורת-detect ⇒ `{ kind, text, page }`. הצורה: «<kind>: <text>[  [זרע מ…]]». */
function parseSeed(line) {
  const i = line.indexOf(':');
  if (i < 0) return null;
  const kind = line.slice(0, i).trim();
  let text = line.slice(i + 1).trim();
  let page = null;
  const m = text.match(/\s*\[([^\]]+)\]\s*$/);   // תגית-מקור בסוף: [זרע מהדף] / [זרע מרש"י …]
  if (m) { page = m[1].trim(); text = text.slice(0, m.index).trim(); }
  return { kind, text, page };
}

/**
 * 🕯️ המקשה על משפט — **בקשה אחת לריצה** (L114). מריץ `gate detect` במנוע
 * הישיבה ומחזיר את הזרעים שהמקשה העלה. **לא נועל, לא דורך משטרה, אפס
 * תופעות-לוואי** — זה `detect` הטהור, לא `gate prompt`.
 * ⇒ `{ available, ok, seeds:[{kind,text,page}], engine, wall }`
 *    אין-ישיבה ⇒ `{ available:false, reason, seeds:[] }`
 */
export function askMaimatai(sentence, { timeout = 60000 } = {}) {
  const home = yeshivaHome();
  if (!home) return { available: false, ok: false, reason: yeshivaHome.reason, seeds: [] };
  const t0 = Date.now();
  const r = spawnSync(PY(), ['-m', 'yeshiva.gate', 'detect', String(sentence)], {
    cwd: home, encoding: 'utf8', timeout, maxBuffer: 16 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],   // stdin סגור — detect לא קורא stdin, וכך לא נתלה
    env: { ...process.env, PYTHONPATH: home + (process.env.PYTHONPATH ? ':' + process.env.PYTHONPATH : '') },
  });
  const wall = Date.now() - t0;
  if (r.status !== 0 || r.error) {
    return { available: true, ok: false, engine: home, seeds: [], wall,
      reason: `gate detect נכשל (exit ${r.status}${r.signal ? ' · signal ' + r.signal : ''}): ${String(r.stderr || r.error || '').trim().split('\n').slice(-2).join(' | ').slice(0, 240)}` };
  }
  const seeds = String(r.stdout || '').split('\n').map((l) => l.trimEnd()).filter(Boolean).map(parseSeed).filter(Boolean);
  return { available: true, ok: true, engine: home, seeds, wall };
}

// ── חוט-1 צעד-2: השאלה של המקשה רוכבת על המתג ─────────────────────────────
//  🕯️ §20-ג מילה-במילה: שדה בלי מקור ⇒ **מתג-לבעלים עם השאלה המדויקת**. עד כה
//  ה-∅ נשא סיבה גנרית («אין מקור בשרשרת-המטרה») ואפס שאלה. למקשה **יש** שאלה
//  על בדיוק אותן מילים — `מאן קתני` (מי זה?) ו`מאי` (הגדרה אחת ויחידה?).
//  כאן היא נקשרת למילה. אפס-הכרעה: הטקסט הוא של המקשה כלשונו, לא ניסוח שלי.

const _qCache = new Map();   // משפט ⇒ תוצאה. בקשה אחת לריצה (L114) — לא פעם לכל צרכן.

/** מילים בין « » בטקסט-זרע. */
const quoted = (t) => [...String(t).matchAll(/«([^»]+)»/g)].map((m) => m[1]);

/**
 * 🕯️ מילה ⇒ השאלה של המקשה עליה. `מאן קתני` (ספציפי) גובר על `מאי` (כללי).
 * ⇒ `{ available, ok, reason, map: Map<מילה, שאלה> }` · אין ישיבה ⇒ map ריקה **ולא ניחוש**.
 */
export function kasheQuestions(sentence) {
  const key = String(sentence);
  if (_qCache.has(key)) return _qCache.get(key);
  const k = askMaimatai(key);
  const map = new Map();
  if (k.ok) {
    for (const s of k.seeds) if (s.kind === 'מאן קתני') for (const w of quoted(s.text).slice(0, 1)) map.set(w, s.text);
    for (const s of k.seeds) if (s.kind === 'מאי') for (const w of quoted(s.text)) if (!map.has(w)) map.set(w, s.text);
  }
  const out = { available: k.available, ok: !!k.ok, reason: k.reason || null, map };
  _qCache.set(key, out);
  return out;
}

/**
 * שאלת-המקשה על מילה, עם התאמה סלחנית לאותיות-שימוש (המחולל מנרמל, המקשה
 * מצטט מהמשפט הגולמי: «וטלפון» מול «טלפון»). אין התאמה ⇒ `null` — **לא ניחוש**.
 */
export function askFor(kq, word) {
  if (!kq || !kq.map.size) return null;
  const w = String(word);
  if (kq.map.has(w)) return kq.map.get(w);
  for (const [k, v] of kq.map) if (k.endsWith(w) || w.endsWith(k)) return v;
  return null;
}
