/** חוט · is-enc-doc — האם ערך הוא מסמך-מוצפן {enc,iv} (בדיקה מבנית). חוזה: is-enc-doc.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudCrypto.ts:30-34. */
export function isEncDoc(d) {
  return !!d && typeof d === 'object' && typeof d.enc === 'string' && typeof d.iv === 'string';
}
