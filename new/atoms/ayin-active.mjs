/** חוט · ayin-active — קודם אוטומטית (אפיון-Golden). חוזה: ayin-active.contract.md */
export function ayinActive(a, T) {
    if (!a)
        return false;
    return (a.stage !== T.k1 ||
        a.names.length > 0 ||
        !!a.lastTouch ||
        a.answers.length > 0 ||
        a.log.length > 0);
}
/** סכום המונים על פני כל הפריטים. */
