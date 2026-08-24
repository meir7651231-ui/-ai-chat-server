/** חוט · clean-sup-phones — ניקוי מערך-טלפונים לשמירה. חוזה: clean-sup-phones.contract.md
 *  חולץ מ-maor/src/components/supporters/lib.ts:300-304.
 *  שקע: fixPhone(num) ⇒ string — מוזרק (חוק-1, אפס import פנימי). */
export function cleanSupPhones(phones, fixPhone) {
  return (phones ?? [])
    .map((p) => ({ ...p, num: fixPhone((p.num || '').trim()) }))
    .filter((p) => p.num);
}
