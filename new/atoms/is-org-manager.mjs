/** חוט · is-org-manager — האם המייל הוא מנהל-הארגון (השוואה מנורמלת).
 *  חוזה: is-org-manager.contract.md
 *  חולץ כלשונו מ-maor/src/components/platform/lib.ts:124-128; השכן normEmail
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function isOrgManager(email, org, normEmail) {
  const m = (org.manager ?? '').trim().toLowerCase();
  return !!m && normEmail(email) === m;
}
