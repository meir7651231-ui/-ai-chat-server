/** חוט · sup-tier — קודם אוטומטית (אפיון-Golden). חוזה: sup-tier.contract.md */
export function supTier(sc) {
    if (sc >= 800)
        return { label: 'זהב', bg: '#fdf3dd', c: '#9a6414', dot: '#f3c76b' };
    if (sc >= 600)
        return { label: 'כסף', bg: '#eef1f5', c: '#44546a', dot: '#94a3b8' };
    if (sc >= 400)
        return { label: 'ארד', bg: '#f6ead1', c: '#9a6414', dot: '#d97706' };
    return { label: 'רדומה', bg: '#eceae2', c: '#8b8474', dot: '#a8a29e' };
}
