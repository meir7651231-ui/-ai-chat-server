/** חוט · is-safe-accent — קודם אוטומטית (אפיון-Golden). חוזה: is-safe-accent.contract.md */
export function isSafeAccent(a) {
    return (/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(a) ||
        /^(?:rgb|rgba|hsl|hsla)\([0-9.,%\s/]+\)$/i.test(a) ||
        /^[a-zA-Z]{3,20}$/.test(a));
}
/** החלת ערכת נושא + דריסת צבע הדגשה (+ סגנון-תנועה) על ה-DOM. */
