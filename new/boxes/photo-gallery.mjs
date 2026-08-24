/** קופסת-חיבורים · גלריית-תמונות — עזרי-טוהר (תקרות · יחס-ממדים · אימות · חיטוי).
 *  מחווטת מ-maor/src/lib/photoGallery.ts (גרף-הקריאות של המקור): canAddPhoto←PHOTO_MAX ·
 *  sanitizePhotos←isDataImage+PHOTO_MAX_LEN+PHOTO_MAX. הקטנת-התמונה עצמה (canvas/DOM)
 *  היא שקע-IO של לוח-האם — לא כאן; הקופסה טהורה. חוזה: photo-gallery.contract.md */
import { PHOTO_MAX } from '../atoms/photo-max.mjs';
import { PHOTO_MAX_DIM } from '../atoms/photo-max-dim.mjs';
import { PHOTO_MAX_LEN } from '../atoms/photo-max-len.mjs';
import { canAddPhoto as canAddPhotoAtom } from '../atoms/can-add-photo.mjs';
import { isDataImage } from '../atoms/is-data-image.mjs';
import { fitDimensions as fitDimensionsAtom } from '../atoms/fit-dimensions.mjs';
import { sanitizePhotos as sanitizePhotosAtom } from '../atoms/sanitize-photos.mjs';

// ── שקעי-הכרעה (מילון הקופסה — ערכי-המוצא מ-photoGallery.ts) ──
// התקרות חיות כאן כתוכנית-חיווט; לנתק/לשנות תקרה = לגעת בקופסה בלבד, לא באטומים.
export { PHOTO_MAX, PHOTO_MAX_DIM, PHOTO_MAX_LEN };

// ── החיווט ──

/** האם ניתן להוסיף עוד תמונה (מתחת לתקרת-הכמות PHOTO_MAX). */
export function canAddPhoto(current) {
  return canAddPhotoAtom(current, PHOTO_MAX);
}

/** מחרוזת היא תמונת-data תקינה (png/jpe?g/webp/gif; בלי svg). */
export { isDataImage };

/** ממדי-יעד אחרי הקטנה — שימור-יחס, בלי הגדלה. הכרעת-הקופסה: הצלע-המרבית
 *  ברירת-מחדל = PHOTO_MAX_DIM (המקור מזין 800 מהקומפוננטה). */
export function fitDimensions(w, h, max = PHOTO_MAX_DIM) {
  return fitDimensionsAtom(w, h, max);
}

/** שער-חיטוי לפני התמדה — רק תמונות-data תקינות מתחת לתקרת-המשקל, עד תקרת-הכמות.
 *  מחווט: isDataImage (בודק-פורמט) · PHOTO_MAX_LEN (תקרת-משקל) · PHOTO_MAX (תקרת-כמות). */
export function sanitizePhotos(raw) {
  return sanitizePhotosAtom(raw, isDataImage, PHOTO_MAX_LEN, PHOTO_MAX);
}
