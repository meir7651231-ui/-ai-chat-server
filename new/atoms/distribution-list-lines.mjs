/** חוט · distribution-list-lines — רשימת-חלוקה מודפסת לחבילה. חוזה: distribution-list-lines.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:627-645; השכנים itemOf
 *  ו-beneficiaryLabel הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function distributionListLines(db, productId, config, itemOf, beneficiaryLabel, T) {
  const product = db.shopProducts.find((p) => p.id === productId);
  const lines = [T.k1 + (product?.name ?? ''), '='.repeat(30)];
  const active = db.shopAssignments.filter((a) => a.productId === productId && a.status === T.k2);
  for (const a of active) {
    const fam = db.families.find((f) => f.id === a.famId);
    const comps = (product?.components ?? []).map((c) => itemOf(db, c).name).filter(Boolean).join(' + ');
    lines.push(
      [
        beneficiaryLabel(db, a, config),
        fam ? [fam.address, fam.city].filter(Boolean).join(', ') : '',
        fam?.phone ?? '',
        comps,
        T.k3,
      ]
        .filter(Boolean)
        .join(' · '),
    );
  }
  if (active.length === 0) lines.push(T.k4);
  return lines;
}
