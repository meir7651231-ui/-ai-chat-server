/** חוט · sort-support-msgs — קודם אוטומטית (אפיון-Golden). חוזה: sort-support-msgs.contract.md */
export function sortSupportMsgs(msgs) {
    return [...msgs].sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0));
}
/** שעת-ההודעה HH:MM (מקומי) — פרסור עמיד (T אם חסר). */
