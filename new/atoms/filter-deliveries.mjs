/** חוט · filter-deliveries — קודם אוטומטית (אפיון-Golden). חוזה: filter-deliveries.contract.md */
export function filterDeliveries(rows, q, smartFilter, T) {
    if (!q.trim())
        return rows;
    const statusLabel = (status) => status === T.k1 ? T.k2 : status === T.k3 ? T.k4 : T.k5;
    return smartFilter(q, rows, (r) => [r.familyName, r.volunteerName, statusLabel(r.status)]);
}
