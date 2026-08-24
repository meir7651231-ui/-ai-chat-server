/** חוט · family-context — מוני "פתוחים" של משפחה לכרטיס-השיחה (screen-pop).
 *  חוזה: family-context.contract.md
 *  חולץ כלשונו מ-maor/src/lib/callerId.ts:113-117 (תורגם TS→JS). */
export function familyContext(db, famId) {
    const openDeliveries = (db.deliveries || []).filter((d) => d.familyId === famId && d.status !== 'delivered').length;
    const activeAssignments = (db.shopAssignments || []).filter((a) => a.famId === famId && a.status === 'active').length;
    return { openDeliveries, activeAssignments };
}
