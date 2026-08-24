/** חוט · expiring-intakes — קליטות מתכלות שפגו/עומדות-לפוג (SHOP10).
 *  חוזה: expiring-intakes.contract.md · שקע: isoOf
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts (SHOP_EXPIRY_WARN_DAYS=7 שוכן). */
export function expiringIntakes(db, todayIso, isoOf, windowDays = 7) {
  const horizon = new Date(todayIso + 'T12:00:00');
  horizon.setDate(horizon.getDate() + windowDays);
  const horizonIso = isoOf(horizon);
  const out = [];
  for (const it of db.shopIntakes) {
    if (!it.expiry || it.expiry > horizonIso) continue;
    out.push({
      intake: it,
      itemName: db.shopItems.find((s) => s.id === it.itemId)?.name ?? '—',
      expired: it.expiry < todayIso,
    });
  }
  return out.sort((a, b) => (a.intake.expiry ?? '').localeCompare(b.intake.expiry ?? ''));
}
