/** חוט · support-day-label — קודם אוטומטית (אפיון-Golden). חוזה: support-day-label.contract.md */
export function supportDayLabel(at, todayIso) {
    const day = at.slice(0, 10);
    if (day === todayIso)
        return 'היום';
    // אתמול = יום-אחד לפני todayIso (חישוב על ה-ISO, צהריים מקומי)
    const t = new Date(todayIso + 'T12:00:00');
    t.setDate(t.getDate() - 1);
    const y = t.getFullYear();
    const m = String(t.getMonth() + 1).padStart(2, '0');
    const dd = String(t.getDate()).padStart(2, '0');
    if (day === `${y}-${m}-${dd}`)
        return 'אתמול';
    const [yy, mm, d2] = day.split('-');
    return d2 && mm && yy ? `${d2}/${mm}/${yy}` : day;
}
/** קיצור-תצוגה של הודעה אחרונה ברשימת-השיחות (עד N תווים). */
