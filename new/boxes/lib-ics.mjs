/** קופסת-חיבורים · lib-ics — מנוע ICS (RFC 5545). חוזה: lib-ics.contract.md
 *  ההלחמות-לשעבר מ-maor/src/lib/ics.ts (icsEscape · foldIcsLine · buildIcs ·
 *  downloadIcs) — עכשיו חיווט גלוי אחד מאטומים בלבד (חוק-2/3).
 *  buildIcs מקבל את שני שכניו כשקעים — הקופסה מחווטת (חוק-3).
 *  downloadIcs (⚠️ לא-טהור): שער-יציאה + DOM. שקעי-IO מוזרקים, מתועדים בחוזה
 *  (חוק-1/6 — שום ידית-DOM/מצב-מודול נצרב בקופסה). */
import { icsEscape } from '../atoms/ics-escape.mjs';
import { foldIcsLine } from '../atoms/fold-ics-line.mjs';
import { buildIcs as __pure_buildIcs } from '../atoms/build-ics.mjs';
import { BUILD_ICS_T as __d_buildIcs_BUILD_ICS_T } from '../atoms/build-ics-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const buildIcsAtom = (...a) => __pure_buildIcs(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_buildIcs_BUILD_ICS_T);
import { guardExport } from '../atoms/guard-export.mjs';
import { LIB_ICS_TERMS } from '../atoms/lib-ics-terms.mjs';

// ── מילון-הקופסה (הכרעות-הצבה, verbatim מ-maor/src/lib/ics.ts:132-139) ──
// mime יומן, בלי BOM (בניגוד ל-CSV — יומנים לא אוהבים BOM). — ics.ts:132,136
const CAL_MIME = LIB_ICS_TERMS.k1;
// חלון-שחרור ה-object-URL אחרי ה-click. — ics.ts:139
const REVOKE_MS = 5000;

// ── החשיפה (ממשק lib/ics.ts אחד-לאחד — L4) ──

/** escaping לפי RFC 5545 (\\ ; , \n). */
export { icsEscape };

/** קיפול-שורה ל-≤75 אוקטטים (בטוח-UTF8). */
export { foldIcsLine };

/** בניית קובץ ICS שלם. now מוזרק (DTSTAMP) — טהור ודטרמיניסטי.
 *  החיווט: שני השכנים המיוצאים של המקור (icsEscape · foldIcsLine) שוקעו לחוט. */
export const buildIcs = (occurrences, calName, now) =>
  buildIcsAtom(occurrences, calName, now, icsEscape, foldIcsLine);

/**
 * הורדת קובץ ICS. שער-יציאת-מידע (guardExport) לפני כל נגיעת-DOM — נקודת-החנק
 * של core.export (המקור: `if (!guardExport()) return`). שקעי-ה-IO מוזרקים ב-io:
 *   blocked        ⇒ boolean — יציאת-מידע חסומה (App→setExportBlocked).
 *   notify         ⇒ (()=>void)|null — התרעת-סירוב; רק בחסימה.
 *   createElement  ⇒ (tag)=>el  (document.createElement).
 *   createObjectURL⇒ (blob)=>url (URL.createObjectURL).
 *   revokeObjectURL⇒ (url)=>void (URL.revokeObjectURL).
 *   setTimeout     ⇒ (fn,ms)=>void (window.setTimeout).
 * ‏Blob = סטנדרט-שפה (גלובלי) — לא שקע. אין BOM, mime מהמילון.
 */
export function downloadIcs(filename, text, io) {
  const { blocked, notify, createElement, createObjectURL, revokeObjectURL, setTimeout } = io;
  if (!guardExport(blocked, notify)) return; // 🔐 שער יציאת-מידע (core.export)
  const a = createElement('a');
  a.href = createObjectURL(new Blob([text], { type: CAL_MIME }));
  a.download = filename;
  a.click();
  setTimeout(() => revokeObjectURL(a.href), REVOKE_MS);
}
