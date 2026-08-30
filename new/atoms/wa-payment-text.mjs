/** חוט · wa-payment-text — נוסח תזכורת-תשלום ידידותית (חוגים) לוואטסאפ.
 *  חוזה: wa-payment-text.contract.md
 *  חולץ כלשונו מ-maor/src/lib/wa.ts:58-64; השכנים renderTemplate (תבניות-הודעה,
 *  lib/templates.ts) ו-orgOf (שם-ארגון-עם-נפילה, wa.ts:47-49) הוזרקו כשקעים
 *  (חוק-1 — אפס import פנימי). */
export function waPaymentText(orgName, what, balance, cfg, renderTemplate, orgOf, T) {
  return renderTemplate(cfg, T.k1, {
    org: orgOf(orgName),
    what,
    amount: Math.round(balance).toLocaleString('he-IL'),
  });
}
