/** חוט · can-add-photo — האם יש מקום לעוד תמונה בגלריה. חוזה: can-add-photo.contract.md
 *  חולץ מ-maor/src/lib/photoGallery.ts:15-17; השכן PHOTO_MAX הוזרק כשקע
 *  photoMax (חוק-1 — אפס import פנימי; ברירת-מחדל 5 = ערך-המוצא). */
export function canAddPhoto(current, photoMax = 5) {
    return (current?.length ?? 0) < photoMax;
}
