/** חוט · read-file-as-data-url — שער-גודל לקובץ-מסמך מוטמע ⇒ קורא-ה-data-URL.
 *  חוזה: read-file-as-data-url.contract.md
 *  חולץ כלשונו מ-maor/src/lib/imagePick.ts:39-46; השכן הפרטי readAsDataUrl
 *  (FileReader — דפדפן) הוזרק כפרמטר-שקע (חוק-1 — אפס import פנימי). */

/** תקרת-ההטמעה מהמקור: 3MB לקובץ מוטמע (localStorage ~5MB למסמך כולו). */
export const MAX_EMBED_BYTES = 3 * 1024 * 1024;

export async function readFileAsDataUrl(file, readAsDataUrl, maxBytes = MAX_EMBED_BYTES) {
  if (file.size > maxBytes)
    throw new Error('הקובץ גדול מדי להטמעה (מקסימום ' + Math.round(maxBytes / 1024 / 1024) + 'MB) — הוסיפו קישור במקום');
  return readAsDataUrl(file);
}
