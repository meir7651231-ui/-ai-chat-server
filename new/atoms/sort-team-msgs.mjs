/** חוט · sort-team-msgs — קודם אוטומטית (אפיון-Golden). חוזה: sort-team-msgs.contract.md */
export function sortTeamMsgs(msgs) {
    return [...msgs].sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0));
}
/** מיון רשימת-שיחות (לוח-הבקרה): לא-נקראות-לתמיכה קודם, ואז לפי lastAt יורד. */
