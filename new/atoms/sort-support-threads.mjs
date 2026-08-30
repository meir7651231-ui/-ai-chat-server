/** חוט · sort-support-threads — קודם אוטומטית (אפיון-Golden). חוזה: sort-support-threads.contract.md */
export function sortSupportThreads(threads, T) {
    // supportUnread מוטמע (חוק-3: אטום לא מייבא שכן; פונקציה-טהורה קטנה ⇒ inline).
    // מקור: maor/src/lib/supportChat.ts:82-86 — התנהגות זהה-ביט.
    const supportUnread = (thread, side) => {
        if (!thread) return 0;
        const n = side === T.k1 ? thread.unreadAdmin : thread.unreadUser;
        return typeof n === T.k2 && n > 0 ? n : 0;
    };
    return [...threads].sort((a, b) => {
        const ua = supportUnread(a, T.k1);
        const ub = supportUnread(b, T.k1);
        if ((ua > 0) !== (ub > 0))
            return ua > 0 ? -1 : 1; // לא-נקרא ראשון
        const la = a.lastAt ?? '';
        const lb = b.lastAt ?? '';
        return la < lb ? 1 : la > lb ? -1 : 0; // חדש ראשון
    });
}
