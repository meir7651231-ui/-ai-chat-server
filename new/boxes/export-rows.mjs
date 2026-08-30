/** קופסת-חיבורים · שורות-הייצוא (lib-exportRows). חוזה: export-rows.contract.md
 *  שלושת יצרני-השורות של maor/src/lib/exportRows.ts — החיווט הגלוי:
 *  משפחות/תומכות = חוטים ישירים; אירועים = חוט + שרשרת-התאריך-העברי + מילון-הסוגים.
 *  ‏toCsv/ההורדה (DOM) אינם כאן — שקע של שער-הייצוא/לוח-האם. */
import { familiesImportFormatRows } from '../atoms/families-import-format-rows.mjs';
import { supportersImportFormatRows } from '../atoms/supporters-import-format-rows.mjs';
import { eventsCsvRows as eventsCsvRowsWire } from '../atoms/events-csv-rows.mjs';
import { termOf } from '../atoms/term-of.mjs';
import { hebDateFull } from '../atoms/heb-date-full.mjs';
import { gem as __pure_gem } from '../atoms/gematria.mjs';
import { U, T, H } from '../atoms/gematria-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const gem = (...a) => __pure_gem(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), U, T, H);
import { gemYear } from '../atoms/gem-year.mjs';
import { hebParts } from '../atoms/heb-parts.mjs';
import { EV_META } from '../atoms/ev-meta.mjs';

// ── החיווט: שרשרת-התאריך-העברי — הכרעת-הקופסה (hebrew.ts:160) ──
const hebFull = (iso) => hebDateFull(iso, gem, (y) => gemYear(y, gem), hebParts);

// ── החשיפה ──
export { familiesImportFormatRows, supportersImportFormatRows };
export const eventsCsvRows = (db, config) => eventsCsvRowsWire(db, config, termOf, hebFull, EV_META);
