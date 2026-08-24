/** חוט · is-member — האם המייל חבר בארגון (מנהל או ברשימת-members).
 *  חוזה: is-member.contract.md
 *  חולץ כלשונו מ-maor/src/components/platform/lib.ts:163-168; השכנים normEmail
 *  ו-isOrgManager הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function isMember(email, org, normEmail, isOrgManager) {
  const e = normEmail(email);
  if (isOrgManager(e, org)) return true;
  return (org.members ?? []).map((m) => m.trim().toLowerCase()).includes(e);
}
