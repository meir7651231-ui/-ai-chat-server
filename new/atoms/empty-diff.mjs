/** חוט · empty-diff — האם diff-הענן ריק (אין מה לדחוף). חוזה: empty-diff.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud-diff.ts:184-187. טהור — אפס שקעים. */
export function emptyDiff(d) {
  return d.sets.length === 0 && d.deletes.length === 0 && d.meta === null;
}
