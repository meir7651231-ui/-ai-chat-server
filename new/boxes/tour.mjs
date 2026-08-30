/** קופסת-חיבורים · הסיור-המודרך (tour). חוזה: tour.contract.md
 *  זה המקום היחיד שבו חוטי-הסיור נפגשים (חוקי-החשמלאי, LAW.md).
 *  מקור-האמת: maor/src/lib/tour.ts (מצב הדגמה ▶ סיור spotlight, הכרעה 4). */
import { TOUR_STOP_LABEL } from '../atoms/tour-stop-label.mjs';
import { tourSteps as __pure_tourSteps } from '../atoms/tour-steps.mjs';
import { TOUR_STEPS_T as __d_tourSteps_TOUR_STEPS_T } from '../atoms/tour-steps-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const tourSteps = (...a) => __pure_tourSteps(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_tourSteps_TOUR_STEPS_T);
import { tourAdvance } from '../atoms/tour-advance.mjs';
import { spotlightBox } from '../atoms/spotlight-box.mjs';
import { termOf as __pure_termOf } from '../atoms/term-of.mjs';
import { INTEGRATION_SETTING_T as __d_termOf_TERM_OF_T } from '../atoms/integration-setting-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const termOf = (...a) => __pure_termOf(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_termOf_TERM_OF_T);

// ── מילון-התסריט — הכרעת-הקופסה (באטום tour-steps זה שקע `steps`) ──
// 14 צעדים, כיתובים מילה-במילה מכיתובי-ההדמיה של הלגאסי (script:1133-1256),
// בסדר-הלגאסי; מקור verbatim: maor/src/lib/tour.ts:36-57.
export const TOUR_STEPS = [
  { view: 'home', caption: '👋 הדמיה מלאה — המערכת מדגימה את עצמה, על הנתונים האמיתיים' },
  { view: 'home', caption: 'סטטיסטיקות חיות — כל אריח לחיץ', anchorText: 'מדד אמינות' },
  { view: 'home', caption: '⌘K — חיפוש חכם מכל מקום', anchorText: 'חיפוש' },
  {
    view: 'families',
    module: 'families',
    caption: '🎡 מאתר המשפחות — גלגל בתוך הדף',
    anchorText: 'סינון מורחב',
  },
  { view: 'families', module: 'families', caption: 'ניקוב נוכחות — היתרה יורדת + 5 נק׳ אמינות' },
  { view: 'families', module: 'families', caption: 'רישום חיסור — עם כלל 48 השעות' },
  { view: 'courses', module: 'courses', caption: '🎡 מאתר החוגים', anchorText: 'מצא חוג' },
  { view: 'courses', module: 'courses', caption: 'חיזוי חוגים: רק תואמי גיל ומגדר' },
  { view: 'calendar', module: 'calendar', caption: '📅 עברי + לועזי · שכבות סינון' },
  // העמודות המבודדות (CONNECT חיבור 5) — צעד לכל עמודה, מגודר במודול שלה
  { view: 'tzedaka', module: 'tzedaka', caption: '🪙 קופות צדקה — רכזים, קופות בבתים, ריקונים ומבצעים' },
  { view: 'shop', module: 'shop', caption: '🛍 החנות — חבילות שירות, מלאי משותף ומימושים עם אישור' },
  { view: 'settings', caption: '⚙ ארגון, התראות, דוחות, מנוע אמינות' },
  { view: 'home', caption: 'ובחזרה הביתה — הכל התעדכן' },
  { view: 'home', caption: 'זו המערכת. חיה, מלאה, במקום אחד ✦' },
];

// ── החיווט ──
// שקע-IO מוזרק: isModuleOn(module)⇒boolean — מצב-המודולים חי ב-store/config
// של המארח (moduleOn), לא כאן. config (OrgConfig) אופציונלי — בלעדיו הנוסח
// המקורי מילה-במילה וזהות-האובייקט נשמרת (tour.ts:65,72).
export const steps = (isModuleOn, config) => tourSteps(TOUR_STEPS, isModuleOn, termOf, config);

// ניווט הבא/הקודם: לפני-ההתחלה נצמד ל-0, אחרי-הסוף = null (סיום). tour.ts:80-85.
export const advance = tourAdvance;

// גאומטריית ה-spotlight: rect + vw/vh = מדידת-DOM מוזרקת (חוק-1, אפס DOM כאן);
// ריפוד ברירת-מחדל pad=10 מהמקור (tour.ts:98) חי באטום.
export const spotlight = spotlightBox;

export { TOUR_STOP_LABEL };
