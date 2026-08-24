/** חוט · redemptions-csv-rows — שורות-CSV של כל מימושי-החנות (מבוטל מסומן, לא מוסתר).
 *  חוזה: redemptions-csv-rows.contract.md · שקעים: beneficiaryLabel, itemOf.
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:656-680 (קריאות-השכן שוקעו). */
export function redemptionsCsvRows(db, config, beneficiaryLabel, itemOf) {
  const rows = [['תאריך', 'מוטב', 'פריט', 'חבילה', 'שולם', 'שווי', 'אישור', 'מבוטל']];
  for (const a of db.shopAssignments) {
    const product = db.shopProducts.find((p) => p.id === a.productId);
    const who = beneficiaryLabel(db, a, config);
    for (const r of a.redemptions) {
      const comp = product?.components.find((c) => c.id === r.componentId);
      rows.push([
        r.date,
        who,
        comp ? itemOf(db, comp).name : '',
        product?.name ?? '',
        r.paid,
        r.value,
        r.rid ?? '',
        r.voidedAt ? 'בוטל ב-' + r.voidedAt : '',
      ]);
    }
  }
  return rows;
}
