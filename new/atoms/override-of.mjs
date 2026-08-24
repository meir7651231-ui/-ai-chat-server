/** חוט · override-of — כרטיס-העובד של מייל ממסמך-הארגון (ריק כשאין). חוזה: override-of.contract.md
 *  חולץ כלשונו מ-maor/src/components/platform/lib.ts:170-172; השכן normEmail
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function overrideOf(email, org, normEmail) {
  return org.memberConfigs?.[normEmail(email)] ?? {};
}
