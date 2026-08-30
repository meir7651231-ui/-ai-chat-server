/** חוט · hok-method-label — קודם אוטומטית (אפיון-Golden). חוזה: hok-method-label.contract.md */
export function hokMethodLabel(m, T) {
    if (m === T.k1)
        return T.k2;
    if (m === T.k3)
        return T.k4;
    if (m === T.k5)
        return T.k6;
    return m || T.k7;
}
