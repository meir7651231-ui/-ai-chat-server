/** 🪨 טיוטת-חוט (דרגת-מחצבה) · segulaReminders — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:324-337 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): segulaReminders, setDate, getDate, getFullYear, getMonth
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function segulaReminders(startIso, offsets = SEGULA_OFFSETS) {
    const base = new Date(`${startIso}T12:00:00`);
    const max = Math.max(...offsets);
    return offsets.map((day) => {
        const d = new Date(base);
        d.setDate(d.getDate() + day);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return { day, date: `${y}-${m}-${dd}`, final: day === max };
    });
}
/** כותרת-תזכורת לסגולה (יום N מתוך היעד). */
