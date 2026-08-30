/** חוט · is-enc-doc — האם ערך הוא מסמך-מוצפן {enc,iv} (בדיקה מבנית). חוזה: is-enc-doc.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudCrypto.ts:30-34. */
export function isEncDoc(d, T) {
  return !!d && typeof d === T.k1 && typeof d.enc === T.k2 && typeof d.iv === T.k2;
}
