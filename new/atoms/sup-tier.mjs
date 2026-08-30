/** חוט · sup-tier — קודם אוטומטית (אפיון-Golden). חוזה: sup-tier.contract.md */
export function supTier(sc, T) {
    if (sc >= 800)
        return { label: T.k1, bg: T.k2, c: '#9a6414', dot: '#f3c76b' };
    if (sc >= 600)
        return { label: T.k3, bg: T.k4, c: '#44546a', dot: '#94a3b8' };
    if (sc >= 400)
        return { label: T.k5, bg: T.k6, c: '#9a6414', dot: '#d97706' };
    return { label: T.k7, bg: T.k8, c: '#8b8474', dot: '#a8a29e' };
}
