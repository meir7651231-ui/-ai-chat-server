/** חוט · holiday-allowed — האם חג רלוונטי לפריט מתנת-חג. חוזה: holiday-allowed.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:79-86 — טהור, אפס שקעים. */
export function holidayAllowed(ri, holidayName) {
  return !ri.holidays?.length || ri.holidays.includes(holidayName);
}
