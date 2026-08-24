/** חוט · sort-support-threads — קודם אוטומטית (אפיון-Golden). חוזה: sort-support-threads.contract.md */
export function sortSupportThreads(threads) {
    return [...threads].sort((a, b) => {
        const ua = supportUnread(a, 'admin');
        const ub = supportUnread(b, 'admin');
        if ((ua > 0) !== (ub > 0))
            return ua > 0 ? -1 : 1; // לא-נקרא ראשון
        const la = a.lastAt ?? '';
        const lb = b.lastAt ?? '';
        return la < lb ? 1 : la > lb ? -1 : 0; // חדש ראשון
    });
}
