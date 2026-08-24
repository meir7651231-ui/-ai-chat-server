/** חוט · remove-member — הסרת עובד/ת מארגון (members + memberConfigs), טהור.
 *  חוזה: remove-member.contract.md
 *  חולץ כלשונו מ-maor/src/components/platform/lib.ts:266-276; השכן normEmail
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function removeMember(org, email, normEmail) {
  const e = normEmail(email);
  const members = (org.members ?? []).map((m) => m.trim().toLowerCase()).filter((m) => m !== e);
  const memberConfigs = { ...org.memberConfigs };
  delete memberConfigs[e];
  return { members, memberConfigs };
}
