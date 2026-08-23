/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supDonEvents — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:261-313 (53 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supDonEvents, termOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function supDonEvents(sp, config) {
    const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
    const out = (sp.donations || []).map((d) => ({
        date: d.date,
        amount: d.amount,
        cur: d.cur || '₪',
        src: 'קבלה ' + d.rid,
        rid: d.rid,
    }));
    for (const h of sp.hist || []) {
        // 13.8 — פירוט מטא-דאטת-הסליקה בשורת-ההיסטוריה (רק שדות שקיימים).
        const meta = [
            h.receipt && 'קבלה ' + h.receipt,
            h.txn && 'עסקה ' + h.txn,
            h.ref && 'אסמכתא ' + h.ref,
            h.brand,
            h.last4 && '•' + h.last4,
            h.clearer,
            h.pays && h.pays > 1 && h.pays + ' תשלומים',
            h.status,
        ]
            .filter(Boolean)
            .join(' · ');
        // הכרעת-בעלים 19.8 ("אין יותר קובץ היסטורי — נדרים זה חי"): רשומה שהגיעה מחברת-
        // סליקה (clearer, למשל נדרים) היא תרומה חיה — מוצגת כ"תרומה", לא "מהקובץ ההיסטורי".
        // רק ייבוא-קובץ-ישן (בלי חברה-סולקת) נשאר "מהקובץ ההיסטורי" (תאימות-לאחור).
        const label = h.clearer ? T('entity.donation', 'תרומה') : 'מהקובץ ההיסטורי';
        out.push({ date: h.d, amount: h.a, cur: h.c || '₪', src: label + (meta ? ' · ' + meta : '') });
    }
    if (!(sp.hist || []).length) {
        const seen = new Set(out.map((x) => x.date));
        if (sp.first && !seen.has(sp.first))
            out.push({ date: sp.first, amount: 0, cur: '', src: T('entity.donation', 'תרומה') + ' ראשונה (מהקובץ)' });
        if (sp.last && sp.last !== sp.first && !seen.has(sp.last))
            out.push({ date: sp.last, amount: 0, cur: '', src: T('entity.donation', 'תרומה') + ' אחרונה (מהקובץ)' });
    }
    return out.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}
/** שורות הלוח האישי של תומכת — legacy supCalMine (2940-2944). */
