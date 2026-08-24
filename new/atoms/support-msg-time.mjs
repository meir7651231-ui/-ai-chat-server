/** חוט · support-msg-time — קודם אוטומטית (אפיון-Golden). חוזה: support-msg-time.contract.md */
export function supportMsgTime(at) {
    const d = new Date(at.includes('T') ? at : at + 'T12:00:00');
    if (Number.isNaN(d.getTime()))
        return '';
    return d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
}
/**
 * תווית-יום למפריד-שיחה: "היום" / "אתמול" / dd/mm/yyyy. הבסיס (todayIso) מוזרם
 * כדי לשמור טוהר (בלי Date.now במנוע) — הרכיב מזרים isoToday().
 */
