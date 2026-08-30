/** קופסת-חיבורים · אימות-קלט ישראלי (lib-validate). חוזה: validate.contract.md
 *  מחווטת את 6 חוטי maor/src/lib/validate.ts — ת"ז · טלפון (נרמול/עיצוב) ·
 *  נרמול-חיפוש · נרמול-שם · מפתח-שם. זה המקום היחיד שבו החוטים נפגשים (LAW.md).
 *  אפס-IO: כל הפונקציות טהורות — אין שקעי DOM/localStorage/fetch להזרקה. */
import { validIsraeliId as atomValidId } from '../atoms/valid-israeli-id.mjs';
import { normalizePhone as atomNormPhone } from '../atoms/normalize-phone.mjs';
import { formatIsraeliPhone as atomFormatPhone } from '../atoms/format-israeli-phone.mjs';
import { normSearch as __pure_normSearch } from '../atoms/norm-search.mjs';
import { NORM_SEARCH_T as __d_normSearch_NORM_SEARCH_T } from '../atoms/norm-search-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const atomNormSearch = (...a) => __pure_normSearch(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_normSearch_NORM_SEARCH_T);
import { normName as atomNormName } from '../atoms/norm-name.mjs';
import { nameSortKey as atomNameSortKey } from '../atoms/name-sort-key.mjs';

// ── מילון-ההכרעה של הקופסה (verbatim מ-maor/src/lib/validate.ts:73-78) ──
// תארים/כינויי-כבוד עבריים (אחרי normSearch — בלי גרש/גרשיים/ניקוד). מוסרים
// מהשם רק כטוקן-שלם (כדי ש-"מרים" לא ייחתך מ-"מר"). לא כולל בן/בר (פטרונים לגיטימי).
const NAME_TITLES = new Set([
  'ר', 'רבי', 'הרב', 'הרבנית', 'הרהג', 'הרהח', 'הגר', 'מוהרר', 'אדמור', 'מרת', 'מר', 'גב', 'הגב',
  'דר', 'פרופ', 'הבחור', 'הבהח', 'הת', 'משפ', 'משפחת',
  // סיומות-כבוד:
  'שליטא', 'זצל', 'זצוקל', 'זקל', 'זל', 'עה', 'היד', 'נרו', 'ניו', 'ני', 'היו',
]);

// ── החיווט (לפי גרף-המקור: normName←normSearch · nameSortKey←normSearch+NAME_TITLES) ──
export const validIsraeliId = atomValidId;
export const normalizePhone = atomNormPhone;
export const formatIsraeliPhone = atomFormatPhone;
export const normSearch = atomNormSearch;
export const normName = (t) => atomNormName(t, atomNormSearch);
export const nameSortKey = (t) => atomNameSortKey(t, atomNormSearch, NAME_TITLES);
