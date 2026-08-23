/** 🪨 טיוטת-חוט (דרגת-מחצבה) · orgCalEntries — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:326-339 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): orgCalEntries, supDonEvents
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function orgCalEntries(supporters) {
    const out = [];
    for (const sp of supporters) {
        for (const e of supDonEvents(sp))
            out.push({ date: e.date, amount: e.amount, cur: e.cur, src: e.src, name: sp.name, spId: sp.id });
        for (const l of sp.ayin?.log ?? []) {
            out.push({ date: l.date, amount: 0, cur: '', src: '🧿 ' + l.eyes + (l.name ? ' — ' + l.name : ''), name: sp.name, spId: sp.id });
        }
        for (const an of sp.ayin?.answers ?? [])
            out.push({ date: an.date, amount: 0, cur: '', src: '📞 תשובה: ' + an.note, name: sp.name, spId: sp.id });
        if (sp.ayin?.nextTalk)
            out.push({ date: sp.ayin.nextTalk, amount: 0, cur: '', src: '🔁 לדבר שוב', name: sp.name, spId: sp.id });
    }
    return out.filter((e) => !!e.date);
}
/** שורת סיכום החודש — 'N תרומות החודש · ₪X + $Y' (legacy supCalData monthLine). */
