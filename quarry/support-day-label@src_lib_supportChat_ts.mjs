/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supportDayLabel — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/supportChat.ts:61-75 (15 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supportDayLabel, setDate, getDate, getFullYear, getMonth
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
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
