// ══════════════════════════════════════════════════════════════════════════
//  yeshiva/ask.mjs — 🕯️ **המנוע שואל את הישיבה.** שכבה אחת, כמו `rminhu.mjs`.
//  ────────────────────────────────────────────────────────────────────────
//  למה שכבה ולא עותק בכל מנוע: אותו נימוק של `rminhu.mjs` — L111 מילה-במילה,
//  «פותר אחד, מיוצא». שני מנועים שכל אחד מאתר לבד את yeshiva-engine ומקודד
//  לבד = שתי אמיתות שסוחפות זו מזו.
//
//  מה הוא עושה: מאתר את הישיבה, מעביר קידוד (ממדים · מקורות-בדרגה · טענות ·
//  שאלות) ל-`yeshiva/ask.py`, ומחזיר את הפסק עם ה-trace. **אפס הכרעה כאן** —
//  אין שורה שמסתכלת על תוכן התשובה ומחליטה משהו. ההכרעה נולדת ב-`YeshivaEngine`.
//
//  🔎 האיתור הוא **לפי סימן בדיסק**, לא לפי שם-נתיב שזכרתי (L110 מילה-במילה:
//  «נתיב-ברירת-מחדל שנכון בקונטיינר אחד הוא באג שקט»). הסימן: `yeshiva/engine.py`
//  קיים בפועל. אין ⇒ `{ available:false, reason }` — **ולא ברירת-מחדל שקטה**:
//  הקורא חייב להישאר בהתנהגות-של-היום ולרשום «לא-נמדד» עם הסיבה (L27 · L110).
//
//  ⚠️ ואין כאן `catch {}` סביב בדיקת-קיום (L26 · L110-2): `existsSync` בלבד,
//  כדי ששגיאת-תכנות לא תיראה כמו «הישיבה לא כאן».
//
//  שימוש:
//    import { yeshivaHome, askYeshiva } from '<...>/yeshiva/ask.mjs';
//    const r = askYeshiva(kbSpec);
//    if (!r.available) { /* התנהגות-של-היום + רישום הסיבה */ }
//    else for (const a of r.answers) { /* a.outcome === true|false|null */ }
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

// דרגות-הסמכות של הישיבה, בשמותיהן. **`MAASEH` אינו כאן** — הוא `kind`, לא
// `rank` (‏L115 מילה-במילה: «המעשה בפועל AMORA+MAASEH, לא BRAITA מעל הדובר,
// אחרת הפסק מתהפך»). מי שיכתוב `rank: MAASEH` יקבל שגיאה מ-`ask.py`, לא פסק.
export const KATUV = 6, MISHNA = 5, BRAITA = 4, AMORA = 3, SEVARA = 2, HAVA_AMINA = 1;
export const MAASEH = 'מעשה';

/** הסימן שהישיבה כאן: `yeshiva/engine.py` בפועל על הדיסק (לא שם-נתיב שזכרתי). */
const SIGN = 'yeshiva/engine.py';
const CANDS = () => [
  process.env.YESHIVA_ENGINE,
  '/home/user/yeshiva-engine',
  path.resolve(HERE, '../../yeshiva-engine'),
  path.resolve(HERE, '../../../yeshiva-engine'),
].filter(Boolean);

/** נתיב yeshiva-engine, או null. הסיבה נשמרת ב-`yeshivaHome.reason`. */
export function yeshivaHome() {
  const tried = [];
  for (const d of CANDS()) {
    const p = path.join(d, SIGN);
    tried.push(p);
    if (fs.existsSync(p)) return d;
  }
  yeshivaHome.reason = `אין ${SIGN} באף אחד מ: ${tried.join(' · ')} (‏YESHIVA_ENGINE=<נתיב> · clone meir7651231-ui/yeshiva-engine)`;
  return null;
}

const PY = () => process.env.PYTHON || 'python3';

/**
 * 🕯️ שאלה אחת לישיבה — **בקשה אחת לריצה** (L114). `spec` הוא הקידוד המלא
 * (ראה החוזה ב-`ask.py`), ובו **כל** השאלות של הריצה יחד.
 * ⇒ `{ available, ok, answers[], sugya, ms, engine }` · אין-ישיבה ⇒ `{ available:false, reason }`.
 */
export function askYeshiva(spec, { timeout = 120000 } = {}) {
  const home = yeshivaHome();
  if (!home) return { available: false, ok: false, reason: yeshivaHome.reason, answers: [] };
  const t0 = Date.now();
  const r = spawnSync(PY(), [path.join(HERE, 'ask.py')], {
    input: JSON.stringify(spec), encoding: 'utf8', timeout,
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, PYTHONPATH: home + (process.env.PYTHONPATH ? ':' + process.env.PYTHONPATH : '') },
  });
  const wall = Date.now() - t0;
  let J = null;
  try { J = JSON.parse(String(r.stdout || '').trim()); } catch { J = null; }
  if (!J) {
    return { available: true, ok: false, engine: home, answers: [], wall,
      reason: `ask.py לא החזיר JSON (exit ${r.status}${r.signal ? ' · signal ' + r.signal : ''}): ${String(r.stderr || '').trim().split('\n').slice(-3).join(' | ').slice(0, 300)}` };
  }
  if (!J.ok) return { available: true, ok: false, engine: home, answers: [], wall, reason: J.error };
  return { available: true, ok: true, engine: home, answers: J.answers || [], sugya: J.sugya || null, ms: J.ms, wall };
}
