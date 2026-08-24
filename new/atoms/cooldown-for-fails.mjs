/** חוט · cooldown-for-fails — כשלונות-PIN ⇒ מ״ש-קירור. חוזה: cooldown-for-fails.contract.md
 *  חולץ כלשונו מ-maor/src/lib/lock.ts:167-170. אטום-טהור. */
export function cooldownForFails(fails) {
  return fails >= 5 ? 30000 : fails >= 4 ? 15000 : fails >= 3 ? 5000 : 0;
}
