/** 🪨 טיוטת-חוט (דרגת-מחצבה) · personalCalEntries — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:314-325 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): personalCalEntries, supDonEvents
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function personalCalEntries(sp) {
    const out = supDonEvents(sp).map((e) => ({ date: e.date, amount: e.amount, cur: e.cur, src: e.src }));
    if (sp.nextDate)
        out.push({ date: sp.nextDate, amount: 0, cur: '', src: '🎯 תאריך יעד לקשר הבא' });
    for (const l of sp.ayin?.log ?? []) {
        out.push({ date: l.date, amount: 0, cur: '', src: '🧿 ' + l.eyes + (l.name ? ' — ' + l.name : '') });
    }
    for (const an of sp.ayin?.answers ?? [])
        out.push({ date: an.date, amount: 0, cur: '', src: '📞 תשובה: ' + an.note });
    if (sp.ayin?.nextTalk)
        out.push({ date: sp.ayin.nextTalk, amount: 0, cur: '', src: '🔁 לדבר שוב' });
    return out.filter((e) => !!e.date);
}
/** שורות הלוח הכלל-ארגוני — כל התומכות (legacy supCalAll, 2928-2937). */
