/** חוט · sanitize-photos — שער-חיטוי לגלריית-תמונות: סינון מערך מתקבל-מבחוץ
 *  לתמונות-data תקינות מתחת לתקרת-משקל, עד תקרת-כמות. חוזה: sanitize-photos.contract.md
 *  חולץ כלשונו מ-maor/src/lib/photoGallery.ts:38-41; השכנים isDataImage · PHOTO_MAX_LEN ·
 *  PHOTO_MAX הוזרקו כשקעים (חוק-1 — אפס import פנימי; ברירות-מחדל = ערכי-המוצא). */
export function sanitizePhotos(raw, isDataImage, photoMaxLen = 460_000, photoMax = 5) {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x) => isDataImage(x) && x.length <= photoMaxLen).slice(0, photoMax);
}
