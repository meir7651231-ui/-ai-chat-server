/** חוט · filter-volunteers — קודם אוטומטית (אפיון-Golden). חוזה: filter-volunteers.contract.md */
export function filterVolunteers(vols, q) {
    if (!q.trim())
        return vols;
    return smartFilter(q, vols, (v) => [v.name, v.phone, v.area ?? '']);
}
/** סינון מסירות (שם-משפחה/סטטוס) — familyName נגזר ב-caller ומוזרק. */
