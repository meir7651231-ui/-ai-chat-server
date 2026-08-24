/** חוט · hok-method-label — קודם אוטומטית (אפיון-Golden). חוזה: hok-method-label.contract.md */
export function hokMethodLabel(m) {
    if (m === 'bank')
        return 'הו"ק בנקאית';
    if (m === 'card')
        return 'אשראי בסליקה';
    if (m === 'cash')
        return 'מזומן חודשי';
    return m || 'אחר';
}
