/** חוט · fit-dimensions — ממדי-יעד להקטנת-תמונה (שימור-יחס, בלי הגדלה). חוזה: fit-dimensions.contract.md
 *  חולץ כלשונו מ-maor/src/lib/photoGallery.ts:28-37 — אפס תלויות, חוט טהור. */
export function fitDimensions(w, h, max) {
  if (w <= 0 || h <= 0) return { w: 0, h: 0 };
  const scale = Math.min(1, max / Math.max(w, h));
  return { w: Math.max(1, Math.round(w * scale)), h: Math.max(1, Math.round(h * scale)) };
}
