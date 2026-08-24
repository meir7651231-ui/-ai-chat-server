/** חוט · pending-deliveries-today — מסירות פתוחות עד-היום שטרם נמסרו (מונה-הבית).
 *  חוזה: pending-deliveries-today.contract.md · טהור, אפס-שקעים.
 *  חולץ כלשונו מ-maor/src/components/shop7/lib.ts:73-85. */
export function pendingDeliveriesToday(db, todayIso) {
  const openDays = new Set(db.distributionDays.filter((d) => d.date <= todayIso && !d.closed).map((d) => d.id));
  return db.deliveries.filter((d) => openDays.has(d.dayId) && d.status !== 'delivered');
}
