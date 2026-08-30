/** קופסת-חיבורים · שורות-הייצוא (lib-exportRows). חוזה: export-rows.contract.md
 *  שלושת יצרני-השורות של maor/src/lib/exportRows.ts — החיווט הגלוי:
 *  משפחות/תומכות = חוטים ישירים; אירועים = חוט + שרשרת-התאריך-העברי + מילון-הסוגים.
 *  ‏toCsv/ההורדה (DOM) אינם כאן — שקע של שער-הייצוא/לוח-האם. */
import { familiesImportFormatRows as __pure_familiesImportFormatRows } from '../atoms/families-import-format-rows.mjs';
import { FAMILIES_IMPORT_FORMAT_ROWS_T as __d_familiesImportFormatRows_FAMILIES_IMPORT_FORMAT_ROWS_T } from '../atoms/families-import-format-rows-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const familiesImportFormatRows = (...a) => __pure_familiesImportFormatRows(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_familiesImportFormatRows_FAMILIES_IMPORT_FORMAT_ROWS_T);
import { supportersImportFormatRows as __pure_supportersImportFormatRows } from '../atoms/supporters-import-format-rows.mjs';
import { SUPPORTERS_IMPORT_FORMAT_ROWS_T as __d_supportersImportFormatRows_SUPPORTERS_IMPORT_FORMAT_ROWS_T } from '../atoms/supporters-import-format-rows-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const supportersImportFormatRows = (...a) => __pure_supportersImportFormatRows(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_supportersImportFormatRows_SUPPORTERS_IMPORT_FORMAT_ROWS_T);
import { eventsCsvRows as __pure_eventsCsvRows } from '../atoms/events-csv-rows.mjs';
import { EVENTS_CSV_ROWS_T as __d_eventsCsvRows_EVENTS_CSV_ROWS_T } from '../atoms/events-csv-rows-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const eventsCsvRowsWire = (...a) => __pure_eventsCsvRows(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_eventsCsvRows_EVENTS_CSV_ROWS_T);
import { termOf as __pure_termOf } from '../atoms/term-of.mjs';
import { INTEGRATION_SETTING_T as __d_termOf_TERM_OF_T } from '../atoms/integration-setting-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const termOf = (...a) => __pure_termOf(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_termOf_TERM_OF_T);
import { hebDateFull as __pure_hebDateFull } from '../atoms/heb-date-full.mjs';
import { HEB_DATE_FULL_T as __d_hebDateFull_HEB_DATE_FULL_T } from '../atoms/heb-date-full-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const hebDateFull = (...a) => __pure_hebDateFull(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_hebDateFull_HEB_DATE_FULL_T);
import { gem as __pure_gem } from '../atoms/gematria.mjs';
import { GEMATRIA_T as __d_gem_GEMATRIA_T } from '../atoms/gematria-strings.mjs';
import { U, T, H } from '../atoms/gematria-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const gem = (...a) => __pure_gem(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), U, T, H, __d_gem_GEMATRIA_T);
import { gemYear as __pure_gemYear } from '../atoms/gem-year.mjs';
import { GEM_YEAR_T as __d_gem_year_T } from '../atoms/gem-year-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const gemYear = (...a) => __pure_gemYear(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_gem_year_T);
import { hebParts as __pure_hebParts } from '../atoms/heb-parts.mjs';
import { HEB_PARTS_T as __d_hebParts_HEB_PARTS_T } from '../atoms/heb-parts-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const hebParts = (...a) => __pure_hebParts(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_hebParts_HEB_PARTS_T);
import { EV_META } from '../atoms/ev-meta.mjs';

// ── החיווט: שרשרת-התאריך-העברי — הכרעת-הקופסה (hebrew.ts:160) ──
const hebFull = (iso) => hebDateFull(iso, gem, (y) => gemYear(y, gem), hebParts);

// ── החשיפה ──
export { familiesImportFormatRows, supportersImportFormatRows };
export const eventsCsvRows = (db, config) => eventsCsvRowsWire(db, config, termOf, hebFull, EV_META);
