/** חוט · is-data-image — האם מחרוזת היא תמונת-data: מותרת (png/jpeg/webp/gif, בלי svg). חוזה: is-data-image.contract.md
 *  חולץ כלשונו מ-maor/src/lib/photoGallery.ts:20-27. */
export function isDataImage(s, T) {
  return typeof s === T.k1 && /^data:image\/(png|jpe?g|webp|gif);base64,/.test(s);
}
