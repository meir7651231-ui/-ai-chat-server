/** קופסת-חיבורים · csvx — עזרי-CSV משותפים. חוזה: csvx.contract.md
 *  ההלחמות-לשעבר מ-maor/src/lib/csvx.ts (csvEscape · toCsv · downloadCsv ·
 *  decodeCsvBuffer · readCsvFileText · parseCsv · parseAnyDate) — עכשיו חיווט
 *  גלוי אחד מאטומים בלבד (חוק-2/3).
 *  toCsv/readCsvFileText מקבלים את שכניהם המיוצאים כשקעים — הקופסה מלחימה (חוק-3).
 *  downloadCsv (⚠️ לא-טהור): שער-יציאה (guardExport) + DOM. שקעי-IO מוזרקים,
 *  מתועדים בחוזה (חוק-1/6 — שום ידית-DOM/מצב-מודול נצרב בקופסה). */
import { csvEscape } from '../atoms/csv-escape.mjs';
import { toCsv as toCsvAtom } from '../atoms/to-csv.mjs';
import { decodeCsvBuffer as __pure_decodeCsvBuffer } from '../atoms/decode-csv-buffer.mjs';
import { DECODE_CSV_BUFFER_T as __d_decodeCsvBuffer_DECODE_CSV_BUFFER_T } from '../atoms/decode-csv-buffer-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const decodeCsvBuffer = (...a) => __pure_decodeCsvBuffer(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_decodeCsvBuffer_DECODE_CSV_BUFFER_T);
import { readCsvFileText as readCsvFileTextAtom } from '../atoms/read-csv-file-text.mjs';
import { parseCsv } from '../atoms/parse-csv.mjs';
import { parseAnyDate as __pure_parseAnyDate } from '../atoms/parse-any-date.mjs';
import { PARSE_ANY_DATE_T as __d_parse_any_date_T } from '../atoms/parse-any-date-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const parseAnyDate = (...a) => __pure_parseAnyDate(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_parse_any_date_T);
import { guardExport } from '../atoms/guard-export.mjs';
import { CSVX_TERMS } from '../atoms/csvx-terms.mjs';

// ── מילון-הקופסה (הכרעות-הצבה, verbatim מ-maor/src/lib/csvx.ts) ──
// סוג-ה-Blob של CSV עם BOM כדי שאקסל יפתח עברית תקינה. — csvx.ts:30
const CSV_MIME = CSVX_TERMS.k1;
// חלון-שחרור ה-object-URL אחרי ה-click. — csvx.ts:33
const REVOKE_MS = 5000;

// ── החשיפה (ממשק lib/csvx.ts אחד-לאחד — L4) ──

/** בריחת תא: הגנת CSV injection ‏(=+-@) + ציטוט פסיקים/גרשיים/שורות. */
export { csvEscape };

/** שורות → טקסט CSV עם BOM. החיווט: escape שוקע ל-csvEscape (csvx.ts:23). */
export const toCsv = (rows) => toCsvAtom(rows, csvEscape);

/** זיהוי-קידוד ופענוח בייטי-CSV לטקסט (UTF-8/UTF-16/windows-1255). */
export { decodeCsvBuffer };

/** קריאת קובץ-ייבוא לטקסט. החיווט: decodeCsvBuffer שוקע (csvx.ts:65). */
export const readCsvFileText = (file) => readCsvFileTextAtom(file, decodeCsvBuffer);

/** פענוח CSV מלא (שדות מצוטטים, CRLF, TSV-אוטו, שורות-ריקות מדולגות). */
export { parseCsv };

/** תאריך מכל פורמט נפוץ בקבצי-ייבוא → ISO ‏(YYYY-MM-DD), או '' אם לא זוהה. */
export { parseAnyDate };

/**
 * מוריד קובץ CSV — שער-יציאת-מידע (guardExport) לפני כל נגיעת-DOM, נקודת-החנק
 * של core.export (המקור: `if (!guardExport()) return`). שקעי-ה-IO מוזרקים ב-io:
 *   blocked        ⇒ boolean — יציאת-מידע חסומה (App→setExportBlocked).
 *   notify         ⇒ (()=>void)|null — התרעת-סירוב; רק בחסימה.
 *   createElement  ⇒ (tag)=>el  (document.createElement).
 *   createObjectURL⇒ (blob)=>url (URL.createObjectURL).
 *   revokeObjectURL⇒ (url)=>void (URL.revokeObjectURL).
 *   setTimeout     ⇒ (fn,ms)=>void (window.setTimeout).
 * ‏Blob = סטנדרט-שפה (גלובלי) — לא שקע. BOM+mime מהמילון.
 */
export function downloadCsv(filename, rows, io) {
  const { blocked, notify, createElement, createObjectURL, revokeObjectURL, setTimeout } = io;
  if (!guardExport(blocked, notify)) return; // 🔐 שער יציאת-מידע (core.export)
  const a = createElement('a');
  a.href = createObjectURL(new Blob([toCsv(rows)], { type: CSV_MIME }));
  a.download = filename;
  a.click();
  setTimeout(() => revokeObjectURL(a.href), REVOKE_MS);
}
