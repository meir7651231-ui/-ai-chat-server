/** בדיקת-קצה · קופסת-המדריך — דוגמאות-החוזה guide.contract.md דרך הקופסה בלבד.
 *  DoD (נכתב לפני הקוד): node new/boxes/guide.test.mjs ⇒ exit 0. */
import assert from 'node:assert';
import {
  GUIDE_INTRO_LABEL, GUIDE_INTRO, GUIDE_SECTIONS, GUIDE_RECIPES_LABEL, GUIDE_RECIPES,
  GUIDE_FOOT, guideSections, guideRecipes,
} from './guide.mjs';

// ── קבועים: נוסח-הלגאסי מילה-במילה (עוגנים: guide.ts:25-88) ──
assert.strictEqual(GUIDE_INTRO_LABEL, 'לפני הכל:');
assert.ok(GUIDE_INTRO.startsWith('אי אפשר לקלקל') && GUIDE_INTRO.endsWith('▶ הדמיה מראה את המערכת לבד.'));
assert.strictEqual(GUIDE_RECIPES_LABEL, 'המתכונים המהירים:');
assert.strictEqual(GUIDE_FOOT, 'המדריך המלא והמפורט נמצא בקובץ "מדריך למשתמש" — מסך-מסך וכפתור-כפתור.');
assert.strictEqual(GUIDE_SECTIONS.length, 9, '9 שורות-מסך');

// ── בלי config: זהות-הפניה פר-שורה (guide.ts:112) + מילה-במילה ──
const all = guideSections(() => true);
assert.strictEqual(all.length, 9);
all.forEach((s, i) => assert.strictEqual(s, GUIDE_SECTIONS[i], 'שורה שלא-השתנתה = אותו אובייקט'));
assert.strictEqual(guideRecipes(), GUIDE_RECIPES, 'בלי config ⇒ מילה-במילה');

// ── config ריק {} (אין terms) ⇒ ביט-זהה לבלי-config ──
guideSections(() => true, {}).forEach((s, i) => assert.strictEqual(s, GUIDE_SECTIONS[i]));
assert.strictEqual(guideRecipes({}), GUIDE_RECIPES);

// ── סינון-מודולים: בלי-module תמיד נשאר; families כבוי ⇒ 7; הכול כבוי ⇒ בית+הגדרות ──
assert.deepStrictEqual(
  guideSections((m) => m !== 'families').map((s) => s.title),
  ['בית', 'קורסים', 'תומכות', 'לוח שנה', 'קופות צדקה', 'חנות', 'הגדרות'],
);
assert.deepStrictEqual(guideSections(() => false).map((s) => s.title), ['בית', 'הגדרות']);

// ── מילון-הבוחן מהחוזה — הפלט חושב מהמקור החי (טרנספילציית guide.ts), לא ביד ──
const terms = {
  'entity.family': 'לקוח', 'entity.teacher': 'מדריכה', 'entity.course': 'קורס',
  'entity.donation': 'עסקה', 'entity.room': 'סטודיו', 'entity.rooms': 'סטודיואים',
  'entity.enrollment': 'רישום',
};
const loc = guideSections(() => true, { terms });
assert.strictEqual(loc[0].text, 'תקציר הבוקר, "דורש טיפול" (המשימות שלך), סטודיואים חיים וגרפים.');
assert.strictEqual(loc[2].title, 'כרטיס לקוח');
assert.strictEqual(loc[3].text, 'לחיצה על סטודיו = היומן שלו; בתוך קורס: קבוצות, שיבוץ, ⬇ תדפיס למדריכה.');
assert.strictEqual(loc[4].text, 'דרגות זהב/כסף/ארד, ＋ עסקה עם קבלה, 🎯 יעד קשר.');
assert.ok(loc[7].text.includes('שיוך ללקוח ו-🎁 מימוש'));
assert.strictEqual(loc[1], GUIDE_SECTIONS[1], 'שורה בלי מונחי-ישות ⇒ אותו אובייקט');
assert.strictEqual(
  guideRecipes({ terms }),
  'תשלום + קבלה ← ⚙ ליד הרישום ← 💳 ← ＋ קבלת תשלום · ניקוב ← כפתור "ניקוב" בכרטיס · ' +
  'לקוח חדשה תוך כדי רישום ← "לא נמצא/ה במערכת?" · קורס מתאים לילד ← ✦ מצא קורס · ' +
  'עסקה ← תומכות ← לחיצה על השם ← ＋ עסקה · רשימה למדריכה ← הקורס ← ⬇ תדפיס למדריכה · ' +
  'גיבוי ← הגדרות ← גיבוי מלא.',
  '"לקוח חדשה" = התנהגות-המקור מילה-במילה (דיבר 2 — לא משפרים)',
);

// ── עדשה-עוינת: דריסה ריקה/רווחים = אין דריסה (term-of מנקה); terms=null לא מפיל ──
assert.strictEqual(guideRecipes({ terms: { 'entity.course': '  ' } }), GUIDE_RECIPES);
assert.strictEqual(guideRecipes({ terms: null }), GUIDE_RECIPES);
assert.deepStrictEqual(guideSections(() => true, { terms: null }), GUIDE_SECTIONS);

/* 🛡 מגן-הכרעה (דפוס theme.test): ההכרעות חיות בקופסה — verbatim במקור-הקופסה. */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./guide.mjs', import.meta.url), 'utf8');
const swaps = readFileSync(new URL('../atoms/guide-recipe-swaps.mjs', import.meta.url), 'utf8');
let f = 0;
if (!src.includes('s.split(from).join(to)')) { console.error('✗ מגן: swap שונה (guide.ts:92)'); f = 1; }
for (const from of ['ליד השיבוץ', 'כדי שיבוץ', 'משפחה חדשה', 'חוג מתאים', 'מצא חוג', 'החוג', 'למורה', '← ＋ תרומה', 'תרומה ←'])
  if (!swaps.includes(`['${from}', `)) { console.error(`✗ מגן: חסרה החלפה '${from}' במילון-המתכונים`); f = 1; }
if (swaps.indexOf("['← ＋ תרומה', ") > swaps.indexOf("['תרומה ←', ")) { console.error('✗ מגן: סדר-ההחלפות התהפך — הסדר הוא המשמעות'); f = 1; }
if (!src.includes('sectionsWire(isModuleOn, config, GUIDE_SECTIONS, termOf, swap)')) { console.error('✗ מגן: חיווט-הסעיפים שונה'); f = 1; }
if (f) process.exit(1);
console.log('✓ קופסת-המדריך: 9 שורות-מסך · סינון-מודולים · מילון-בוחן (7 מונחים) · מתכונים ממותגים · מגן-הכרעה');
