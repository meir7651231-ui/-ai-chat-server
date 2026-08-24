/** חוט · provider-clearer — תווית-סליקה ('סולה'/'נדרים') לפי ספק-העסקה.
 *  חוזה: provider-clearer.contract.md
 *  חולץ כלשונו מ-maor/src/lib/nedarimSync.ts:119-121 (אפס שכנים — אפס שקעים). */
export function providerClearer(provider) {
  return /sola/i.test(provider || '') ? 'סולה' : 'נדרים';
}
