// 🧬 regen — סדר-הריצה האחד של צנרת-המחולל (GENMAX). מקור-אמת יחיד: ship.mjs (נחיתה) ו-one.mjs (המנוע-האחד) מריצים את אותה
//   רשימה — לא שני עותקים (G22 · הכרעה-26 "תחבר את כל המנועים למנוע האחד" · L94). שלב חדש = שורה כאן (וגם שער ב-gates.tsv, L80).
//   כל פריט: rel (יחסי-לשורש) · args · note. runRegen(node) מקבל מריץ-חיצוני (כדי שכל צנרת תשמור על הלוג/הכשל שלה).
import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
export const REGEN = [
  { rel: 'machtzev/ds-forge.mjs', args: [], note: 'Pure ⇒ אטומי-forge + מניפסט' },
  { rel: 'machtzev/generator/auto-skin.mjs', args: [], note: 'G17b · בורר-אטום-לפי-ייעוד ⇒ auto-skin.json (שער autoskin)' },
  { rel: 'machtzev/generator/tighten-types.mjs', args: ['--record', '--apply'], note: 'G20 · הידוק-טיפוסים מראיית-בדיקות + הוכחות-קופסאות (שער tighten)' },
  { rel: 'machtzev/census/logic-census.mjs', args: [], quiet: true, note: 'חתימות-הלוגיקה המהודקות' },
  { rel: 'machtzev/census/oracle.mjs', args: ['--write'], quiet: true, note: 'אינדקס-האמת לפני הבורר' },
  { rel: 'machtzev/generator/auto-logic.mjs', args: [], note: 'G18 · בורר-מנוע-לוגיקה-לפי-ייעוד ⇒ auto-logic.json (שער autologic)' },
  { rel: 'machtzev/generator/skin-golden.mjs', args: [], note: 'מודולי-הזהב בעור-forge' },
  { rel: 'machtzev/generator/core-from-shape.mjs', args: [], note: 'הגרעין מהסכמה+מונחים (שער core)' },
  { rel: 'machtzev/generator/core-dart.mjs', args: [], note: 'gen_core_<entity>.dart (שער coredart)' },
  { rel: 'machtzev/generator/app-from-sentences.mjs', args: [], note: 'משפט ⇒ אפליקציה (שער appgen)' },
  // G23a · מסלול-ב׳ (ישויות-מהמשפט): כל ספק ב-machtzev/generator/specs-ds/*.txt ⇒ app-ds --name <stem> -f <spec> --skin (עיצוב-forge). נגזר מהתיקייה — לא רשימה (הכרעה-27)
  ...dsSpecs(),
];
function dsSpecs() {
  const dir = fileURLToPath(new URL('./specs-ds/', import.meta.url));
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.txt')).sort().map((f) => ({ rel: 'machtzev/generator/app-ds.mjs', args: ['-f', `machtzev/generator/specs-ds/${f}`, '--name', f.replace(/\.txt$/, ''), '--skin'], quiet: true, note: `מסלול-ב׳ · ${f}` }));
}
export const INDEX = [
  { rel: 'machtzev/census/logic-census.mjs', args: [], quiet: true, note: 'חתימות-הלוגיקה (מהודקות) לפני האורקל' },
  { rel: 'machtzev/census/atom-index.mjs', args: [], quiet: true, note: 'אינדקס-התצוגה' },
  { rel: 'machtzev/census/oracle.mjs', args: ['--write'], quiet: true, note: 'אינדקס-האמת המאוחד' },
  { rel: 'machtzev/generator/quarry-golden.mjs', args: [], quiet: true, note: 'L92 · קטלוג-שברי-הזהב (שער goldquarry)' },
  { rel: 'machtzev/generator/op-census.mjs', args: [], quiet: true, note: 'L92 · ops-map.json מהאינדקס הטרי (שער opcensus/cover)' },
  { rel: 'machtzev/truth.mjs', args: ['--write'], quiet: true, note: 'TRUTH.md + בלוק-האמת ב-CLAUDE.md' },
];
export const label = (steps) => steps.map((s) => s.rel.split('/').pop().replace(/\.mjs$/, '')).join(' ⇒ ');
export function runRegen(node, steps = REGEN) { for (const s of steps) node(s.rel, s.args, { quiet: !!s.quiet }); }
