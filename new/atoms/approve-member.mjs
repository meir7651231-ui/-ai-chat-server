/** חוט · approve-member — אישור בקשת-הצטרפות (רשימת-חברים מנורמלת, בלי כפילויות).
 *  חוזה: approve-member.contract.md
 *  חולץ כלשונו מ-maor/src/components/platform/lib.ts:249-253; השכן normEmail
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function approveMember(org, email, normEmail) {
  const e = normEmail(email);
  const members = [...new Set([...(org.members ?? []).map((m) => m.trim().toLowerCase()), e])];
  return { members };
}
