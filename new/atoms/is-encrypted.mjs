/** חוט · is-encrypted — האם הערך מעטפת-הצפנה ($enc===2). חוזה: is-encrypted.contract.md
 *  חולץ כלשונו מ-maor/src/lib/crypto.ts:101-104. */
export function isEncrypted(raw) {
  return !!raw && typeof raw === 'object' && raw.$enc === 2;
}
