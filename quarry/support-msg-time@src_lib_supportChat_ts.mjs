/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supportMsgTime — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/supportChat.ts:51-60 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supportMsgTime, isNaN, getTime, toLocaleTimeString, isoToday
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
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
