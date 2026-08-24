/** חוט · size-label — תווית גודל-ארגון מ-id (לוח-הבקרה). חוזה: size-label.contract.md
 *  חולץ כלשונו מ-maor/src/lib/signupWizard.ts:91-93; הקבוע-השכן ORG_SIZES
 *  (רשימת-הגדלים של אשף-ההרשמה) הוזרק כשקע-נתונים (חוק-1 — אפס import פנימי). */
export function sizeLabel(id, sizes) {
  return sizes.find((s) => s.id === id)?.label ?? id ?? '—';
}
