/** קופסת-חיבורים · הסיור-המודרך (tour). חוזה: tour.contract.md
 *  זה המקום היחיד שבו חוטי-הסיור נפגשים (חוקי-החשמלאי, LAW.md).
 *  מקור-האמת: maor/src/lib/tour.ts (מצב הדגמה ▶ סיור spotlight, הכרעה 4). */
import { TOUR_STOP_LABEL } from '../atoms/tour-stop-label.mjs';
import { TOUR_STEPS } from '../atoms/tour-script.mjs';
import { tourSteps as __pure_tourSteps } from '../atoms/tour-steps.mjs';
import { TOUR_STEPS_T as __d_tourSteps_TOUR_STEPS_T } from '../atoms/tour-steps-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const tourSteps = (...a) => __pure_tourSteps(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_tourSteps_TOUR_STEPS_T);
import { tourAdvance } from '../atoms/tour-advance.mjs';
import { spotlightBox as __pure_spotlightBox } from '../atoms/spotlight-box.mjs';
import { SPOTLIGHT_BOX_T as __d_spotlight_box_T } from '../atoms/spotlight-box-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const spotlightBox = (...a) => __pure_spotlightBox(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_spotlight_box_T);
import { termOf as __pure_termOf } from '../atoms/term-of.mjs';
import { INTEGRATION_SETTING_T as __d_termOf_TERM_OF_T } from '../atoms/integration-setting-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const termOf = (...a) => __pure_termOf(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_termOf_TERM_OF_T);

// ── מילון-התסריט — הכרעת-הקופסה, חיה כדאטה באטום tour-script (הכרעה 19) ──
export { TOUR_STEPS };

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
