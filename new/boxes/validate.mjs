/** קופסת-חיבורים · אימות-קלט ישראלי (lib-validate). חוזה: validate.contract.md
 *  מחווטת את 6 חוטי maor/src/lib/validate.ts — ת"ז · טלפון (נרמול/עיצוב) ·
 *  נרמול-חיפוש · נרמול-שם · מפתח-שם. זה המקום היחיד שבו החוטים נפגשים (LAW.md).
 *  אפס-IO: כל הפונקציות טהורות — אין שקעי DOM/localStorage/fetch להזרקה. */
import { validIsraeliId as __pure_validIsraeliId } from '../atoms/valid-israeli-id.mjs';
import { VALID_ISRAELI_ID_T as __d_valid_israeli_id_T } from '../atoms/valid-israeli-id-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const atomValidId = (...a) => __pure_validIsraeliId(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_valid_israeli_id_T);
import { normalizePhone as atomNormPhone } from '../atoms/normalize-phone.mjs';
import { formatIsraeliPhone as __pure_formatIsraeliPhone } from '../atoms/format-israeli-phone.mjs';
import { FORMAT_ISRAELI_PHONE_T as __d_format_israeli_phone_T } from '../atoms/format-israeli-phone-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const atomFormatPhone = (...a) => __pure_formatIsraeliPhone(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_format_israeli_phone_T);
import { normSearch as __pure_normSearch } from '../atoms/norm-search.mjs';
import { NORM_SEARCH_T as __d_normSearch_NORM_SEARCH_T } from '../atoms/norm-search-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const atomNormSearch = (...a) => __pure_normSearch(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_normSearch_NORM_SEARCH_T);
import { normName as atomNormName } from '../atoms/norm-name.mjs';
import { nameSortKey as atomNameSortKey } from '../atoms/name-sort-key.mjs';
import { VALIDATE_TERMS } from '../atoms/validate-terms.mjs';

// ── מילון-ההכרעה של הקופסה (verbatim מ-maor/src/lib/validate.ts:73-78) ──
// תארים/כינויי-כבוד עבריים (אחרי normSearch — בלי גרש/גרשיים/ניקוד). מוסרים
// מהשם רק כטוקן-שלם (כדי ש-"מרים" לא ייחתך מ-"מר"). לא כולל בן/בר (פטרונים לגיטימי).
const NAME_TITLES = new Set([
  VALIDATE_TERMS.k1, VALIDATE_TERMS.k2, VALIDATE_TERMS.k3, VALIDATE_TERMS.k4, VALIDATE_TERMS.k5, VALIDATE_TERMS.k6, VALIDATE_TERMS.k7, VALIDATE_TERMS.k8, VALIDATE_TERMS.k9, VALIDATE_TERMS.k10, VALIDATE_TERMS.k11, VALIDATE_TERMS.k12, VALIDATE_TERMS.k13,
  VALIDATE_TERMS.k14, VALIDATE_TERMS.k15, VALIDATE_TERMS.k16, VALIDATE_TERMS.k17, VALIDATE_TERMS.k18, VALIDATE_TERMS.k19, VALIDATE_TERMS.k20,
  // סיומות-כבוד:
  VALIDATE_TERMS.k21, VALIDATE_TERMS.k22, VALIDATE_TERMS.k23, VALIDATE_TERMS.k24, VALIDATE_TERMS.k25, VALIDATE_TERMS.k26, VALIDATE_TERMS.k27, VALIDATE_TERMS.k28, VALIDATE_TERMS.k29, VALIDATE_TERMS.k30, VALIDATE_TERMS.k31,
]);

// ── החיווט (לפי גרף-המקור: normName←normSearch · nameSortKey←normSearch+NAME_TITLES) ──
export const validIsraeliId = atomValidId;
export const normalizePhone = atomNormPhone;
export const formatIsraeliPhone = atomFormatPhone;
export const normSearch = atomNormSearch;
export const normName = (t) => atomNormName(t, atomNormSearch);
export const nameSortKey = (t) => atomNameSortKey(t, atomNormSearch, NAME_TITLES);
