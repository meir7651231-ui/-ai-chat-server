/** חוט · is-encrypted — האם הערך מעטפת-הצפנה ($enc===2). חוזה: is-encrypted.contract.md
 *  חולץ כלשונו מ-maor/src/lib/crypto.ts:101-104. */
export function isEncrypted(raw, T) {
  return !!raw && typeof raw === T.k1 && raw.$enc === 2;
}
