/** קופסת-חיבורים · המדריך המהיר 📖 (lib-guide). חוזה: guide.contract.md
 *  זה המקום היחיד שבו חוטי-המדריך נפגשים (חוקי-החשמלאי, LAW.md).
 *  מקור-האמת: maor/src/lib/guide.ts — תוכן "המדריך המהיר" מהקובץ החי (legacy:2891-2912). */
import { GUIDE_INTRO_LABEL } from '../atoms/guide-intro-label.mjs';
import { GUIDE_INTRO } from '../atoms/guide-intro.mjs';
import { GUIDE_SECTIONS } from '../atoms/guide-sections.mjs';
import { GUIDE_RECIPES_LABEL } from '../atoms/guide-recipes-label.mjs';
import { GUIDE_RECIPES } from '../atoms/guide-recipes.mjs';
import { makeGUIDE_FOOT as __pure_makeGUIDE_FOOT } from '../atoms/guide-foot.mjs';
import { GUIDE_FOOT_T as __d_guide_foot_T } from '../atoms/guide-foot-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const GUIDE_FOOT = __pure_makeGUIDE_FOOT(__d_guide_foot_T);
import { guideSections as __pure_guideSections } from '../atoms/guide-sections-of.mjs';
import { GUIDE_SECTIONS_OF_T as __d_guideSections_GUIDE_SECTIONS_OF_T } from '../atoms/guide-sections-of-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const sectionsWire = (...a) => __pure_guideSections(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_guideSections_GUIDE_SECTIONS_OF_T);
import { termOf as __pure_termOf } from '../atoms/term-of.mjs';
import { INTEGRATION_SETTING_T as __d_termOf_TERM_OF_T } from '../atoms/integration-setting-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const termOf = (...a) => __pure_termOf(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_termOf_TERM_OF_T);

// ── החיווט ──
// swap — הכרעת-הקופסה (guide.ts:91-93): החלפת תת-מחרוזת גלובלית בלי regex.
// מוזרק כשקע לחוט guide-sections-of (החוט הצהיר עליו, הקופסה מספקת).
const swap = (s, from, to) => s.split(from).join(to);

// מילון-ההחלפות של "המתכונים המהירים" (guide.ts:124-132) — הכרעת-הקופסה.
// הסדר הוא *המשמעות* (כל החלפה רצה על תוצאת קודמתה) — סידור-מחדש = שינוי-מוצר.
// שורה: [from, קידומת, מפתח-termOf, fallback, סיפא] ⇒ ההחלפה = קידומת+T(מפתח,fallback)+סיפא.
const RECIPE_SWAPS = [
  ['ליד השיבוץ', 'ליד ה', 'entity.enrollment', 'שיבוץ', ''],
  ['כדי שיבוץ', 'כדי ', 'entity.enrollment', 'שיבוץ', ''],
  ['משפחה חדשה', '', 'entity.family', 'משפחה', ' חדשה'],
  ['חוג מתאים', '', 'entity.course', 'חוג', ' מתאים'],
  ['מצא חוג', 'מצא ', 'entity.course', 'חוג', ''],
  ['החוג', 'ה', 'entity.course', 'חוג', ''],
  ['למורה', 'ל', 'entity.teacher', 'מורה', ''],
  ['← ＋ תרומה', '← ＋ ', 'entity.donation', 'תרומה', ''],
  ['תרומה ←', '', 'entity.donation', 'תרומה', ' ←'],
];

// ── החשיפה ──
export { GUIDE_INTRO_LABEL, GUIDE_INTRO, GUIDE_SECTIONS, GUIDE_RECIPES_LABEL, GUIDE_RECIPES, GUIDE_FOOT };

/** סינון-ותרגום שורות-המדריך (guide.ts:101-115). שקעים: isModuleOn (מצב-הארגון), config (מילון-white-label; ריק = נוסח-לגאסי). */
export const guideSections = (isModuleOn, config) =>
  sectionsWire(isModuleOn, config, GUIDE_SECTIONS, termOf, swap);

/** "המתכונים המהירים" ממותג-מחדש (guide.ts:121-134); בלי config = GUIDE_RECIPES מילה-במילה. */
export function guideRecipes(config) {
  const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
  let r = GUIDE_RECIPES;
  for (const [from, pre, key, fb, post] of RECIPE_SWAPS) r = swap(r, from, pre + T(key, fb) + post);
  return r;
}
