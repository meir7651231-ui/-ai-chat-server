/** חוט · pin-needs-rehash — האם גיבוב-PIN לגאסי שצריך שדרוג. חוזה: pin-needs-rehash.contract.md
 *  חולץ כלשונו מ-maor/src/lib/lock.ts:106-108. אטום טהור, אפס תלות. */
export function pinNeedsRehash(hash) {
  return !!hash && !hash.startsWith('v2:');
}
