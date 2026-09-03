/** מחצב · root — שורש-העץ-הנמדד (c3 של PROTOCOL v4 §12).
 *  כלל: כל קריאה/כתיבה ל-fs (new/ · דאטה · baselines · gates.tsv · pins) עוברת דרך כאן; imports של קוד נשארים יחסיים.
 *  MACHTZEV_ROOT=<dir> ⇒ הכלים (הקוד הרץ) מודדים עץ אחר — זה מה שמאפשר למאמת-העצמאי להריץ כלים מ-tag
 *  ידוע-טוב על HEAD (PROTOCOL §5.2) ול-selftest להזריק רעל לעותק בנתיב האמיתי. ברירת-מחדל: הריפו שבו הקוד יושב.
 *  GEN_OUT / GEN_DATA_OUT ⇒ פלט-המחולל לתיקייה זמנית (עץ-נח ל-L14, במקום snapshot/restore). */
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
