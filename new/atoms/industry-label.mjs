/** חוט · industry-label — תווית תחום-עסק מ-id (לוח-הבקרה). חוזה: industry-label.contract.md
 *  חולץ כלשונו מ-maor/src/lib/signupWizard.ts:88-90; הקבוע-השכן WIZARD_INDUSTRIES
 *  (נגזר מ-VERTICAL_PACKS) הוזרק כשקע-נתונים (חוק-1 — אפס import פנימי). */
export function industryLabel(id, industries) {
  return industries.find((i) => i.id === id)?.label ?? id ?? '—';
}
