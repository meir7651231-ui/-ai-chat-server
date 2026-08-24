/** חוט · sup-has-region — האם לתורם טלפון באזור מבוקש. חוזה: sup-has-region.contract.md
 *  חולץ מ-maor/src/components/supporters/lib.ts:295-297.
 *  שקע: allSupPhones(sp) ⇒ [{region,...}] — מוזרק (חוק-1, אפס import פנימי). */
export function supHasRegion(sp, region, allSupPhones) {
  return allSupPhones(sp).some((r) => r.region === region);
}
