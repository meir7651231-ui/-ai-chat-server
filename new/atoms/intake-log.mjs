/** חוט · intake-log — יומן קליטות-מלאי: שורות חדש-ראשון + סה"כ עלויות.
 *  חוזה: intake-log.contract.md · חולץ כלשונו מ-maor/src/components/shop/lib.ts:588-593.
 *  אפס שכנים — טהור מהמקור (קורא רק את db.shopIntakes/db.shopItems). */
export function intakeLog(db) {
  const rows = db.shopIntakes
    .map((intake) => ({ intake, itemName: db.shopItems.find((i) => i.id === intake.itemId)?.name ?? '—' }))
    .sort((a, b) => b.intake.date.localeCompare(a.intake.date));
  return { rows, totalCost: rows.reduce((s, r) => s + r.intake.cost, 0) };
}
