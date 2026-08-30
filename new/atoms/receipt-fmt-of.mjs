/** חוט · receipt-fmt-of — הפורמט האפקטיבי למסירת-קבלה: הבחירה השמורה, רק בדגל דלוק.
 *  חוזה: receipt-fmt-of.contract.md
 *  חולץ כלשונו מ-maor/src/lib/receipt.ts:234-237; השכן featureOn (מנוע-הדגלים
 *  של הקונפיג) הוזרק כפרמטר-שקע (חוק-1 — אפס import פנימי). */
export function receiptFmtOf(config, ui, featureOn, T) {
  return featureOn(config, T.k1) ? ui.receiptFmt : undefined;
}
