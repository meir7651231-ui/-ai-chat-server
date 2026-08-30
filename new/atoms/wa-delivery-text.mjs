/** חוט · wa-delivery-text — נוסח הודעת-מסירה (חלוקה) לוואטסאפ.
 *  חוזה: wa-delivery-text.contract.md
 *  חולץ כלשונו מ-maor/src/lib/wa.ts:52-54; השכנים renderTemplate (תבניות-הודעה,
 *  lib/templates.ts) ו-orgOf (שם-ארגון-עם-נפילה, wa.ts:47-49) הוזרקו כשקעים
 *  (חוק-1 — אפס import פנימי). */
export function waDeliveryText(orgName, famName, cfg, renderTemplate, orgOf, T) {
  return renderTemplate(cfg, T.k1, { name: (T.k2 + famName).trim(), org: orgOf(orgName) });
}
