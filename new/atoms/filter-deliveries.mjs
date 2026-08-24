/** חוט · filter-deliveries — קודם אוטומטית (אפיון-Golden). חוזה: filter-deliveries.contract.md */
export function filterDeliveries(rows, q) {
    if (!q.trim())
        return rows;
    return smartFilter(q, rows, (r) => [r.familyName, r.volunteerName, statusLabel(r.status)]);
}
