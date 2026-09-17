/** מחצב · root — שורש-העץ-הנמדד (c3 של PROTOCOL v4 §12).
 *  כלל: כל קריאה/כתיבה ל-fs (new/ · דאטה · baselines · gates.tsv · pins) עוברת דרך כאן; imports של קוד נשארים יחסיים.
 *  MACHTZEV_ROOT=<dir> ⇒ הכלים (הקוד הרץ) מודדים עץ אחר — זה מה שמאפשר למאמת-העצמאי להריץ כלים מ-tag
 *  ידוע-טוב על HEAD (PROTOCOL §5.2) ול-selftest להזריק רעל לעותק בנתיב האמיתי. ברירת-מחדל: הריפו שבו הקוד יושב.
 *  GEN_OUT / GEN_DATA_OUT ⇒ פלט-המחולל לתיקייה זמנית (עץ-נח ל-L14, במקום snapshot/restore). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = (process.env.MACHTZEV_ROOT ? path.resolve(process.env.MACHTZEV_ROOT) : path.resolve(here, '..')) + '/';
export const MACH = path.join(ROOT, 'machtzev') + '/';
export const NEW = path.join(ROOT, 'new') + '/';
export const GEN_DIR = path.join(MACH, 'generator') + '/';
export const p = (...s) => path.join(ROOT, ...s);
export const outDir = () => (process.env.GEN_OUT ? path.resolve(process.env.GEN_OUT) : path.join(NEW, 'dart-gen-bs'));
export const dataOutDir = () => (process.env.GEN_DATA_OUT ? path.resolve(process.env.GEN_DATA_OUT) : path.join(NEW, 'dart-data-bs/auto'));

// 🔎 **buildsmart — מאתר, לא מנחש.** נמדד 17.9: 20 מנועים נשאו נתיב-ברירת-מחדל
// קשיח (`/home/user/buildsmart`), והריפו יושב ב-`/home/user/meir7651231-ui/buildsmart`.
// התוצאה: `genverify` · `balagan-run` · `goldenharness` · `appgen` דיווחו «אין
// buildsmart — מדולג» בזמן שהוא **היה שם, עם אתר בנוי**. נתיב-ברירת-מחדל שנכון
// בקונטיינר אחד הוא באג שקט — הוא לא נכשל, הוא מדלג.
const BS_CANDS = [
  process.env.BUILDSMART && path.resolve(process.env.BUILDSMART).replace(/\/app_flutter\/?$/, ''),
  path.resolve(ROOT, '../buildsmart'),
  path.resolve(ROOT, '../meir7651231-ui/buildsmart'),
];
/** שורש-buildsmart, או null. `pubspec.yaml` תחת app_flutter = הסימן. */
export const bsRoot = () => {
  for (const c of BS_CANDS) if (c && fs.existsSync(path.join(c, 'app_flutter/pubspec.yaml'))) return c;
  return null;
};   // ⚠️ בלי try/catch: הגרסה הראשונה עטפה ב-`catch {}` ובלעה ReferenceError על `fs`
     //    שלא היה מיובא — המאתר החזיר null בשקט, ו-4 שערים המשיכו לדלג. L26.
/** תיקיית-האפליקציה (‏app_flutter), או null. */
export const bsApp = () => { const r = bsRoot(); return r ? path.join(r, 'app_flutter') : null; };
