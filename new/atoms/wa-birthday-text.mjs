/** חוט · wa-birthday-text — נוסח ברכת יום-הולדת לוואטסאפ.
 *  חוזה: wa-birthday-text.contract.md
 *  חולץ כלשונו מ-maor/src/lib/wa.ts:66-68; השכנים renderTemplate (תבניות-הודעה,
 *  lib/templates.ts) ו-orgOf (שם-ארגון-עם-נפילה, wa.ts:47-49) הוזרקו כשקעים
 *  (חוק-1 — אפס import פנימי). */
export function waBirthdayText(orgName, firstName, cfg, renderTemplate, orgOf) {
  return renderTemplate(cfg, 'wa.birthday', { first: firstName, org: orgOf(orgName) });
}
