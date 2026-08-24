/** חוט · need-label — תווית-תצוגה לצורך-ארגוני לפי מזהה. חוזה: need-label.contract.md
 *  חולץ כלשונו מ-maor/src/lib/signupWizard.ts:94-97; הקבוע-השכן ORG_NEEDS
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function needLabel(id, orgNeeds) {
  return orgNeeds.find((n) => n.id === id)?.label ?? id;
}
