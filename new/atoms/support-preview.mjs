/** חוט · support-preview — קודם אוטומטית (אפיון-Golden). חוזה: support-preview.contract.md */
export function supportPreview(text, max = 40) {
    const t = (text ?? '').replace(/\s+/gu, ' ').trim();
    return t.length > max ? t.slice(0, max - 1) + '…' : t;
}
/** מספר "לא-נקרא" לצד נתון (לתג-מונה). לא-שלילי; חסר ⇒ 0. */
