/** חוט · redemptions-csv-rows — שורות-CSV של כל מימושי-החנות (מבוטל מסומן, לא מוסתר).
 *  חוזה: redemptions-csv-rows.contract.md · שקעים: beneficiaryLabel, itemOf.
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:656-680 (קריאות-השכן שוקעו). */
export function redemptionsCsvRows(db, config, beneficiaryLabel, itemOf, T) {
  const rows = [[T.k1, T.k2, T.k3, T.k4, T.k5, T.k6, T.k7, T.k8]];
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
        r.voidedAt ? T.k9 + r.voidedAt : '',
      ]);
    }
  }
  return rows;
}
