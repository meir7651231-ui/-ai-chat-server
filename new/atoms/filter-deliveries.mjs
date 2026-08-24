/** חוט · filter-deliveries — קודם אוטומטית (אפיון-Golden). חוזה: filter-deliveries.contract.md */
export function filterDeliveries(rows, q, smartFilter) {
    if (!q.trim())
        return rows;
    const statusLabel = (status) => status === 'pickup' ? 'איסוף' : status === 'enroute' ? 'בדרך' : 'נמסר';
    return smartFilter(q, rows, (r) => [r.familyName, r.volunteerName, statusLabel(r.status)]);
}
