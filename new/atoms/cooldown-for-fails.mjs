/** חוט · cooldown-for-fails — כשלונות-PIN ⇒ מ״ש-קירור. חוזה: cooldown-for-fails.contract.md
 *  חולץ כלשונו מ-maor/src/lib/lock.ts:167-170. אטום-טהור. */
export function cooldownForFails(fails, T) {
  return fails >= 5 ? T.k1 : fails >= 4 ? T.k2 : fails >= 3 ? T.k3 : 0;
}
