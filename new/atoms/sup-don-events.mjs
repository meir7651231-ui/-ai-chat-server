/** חוט · sup-don-events — מיזוג תרומות+היסטוריה לרשימת-תצוגה ממוינת מהחדש לישן.
 *  חוזה: sup-don-events.contract.md
 *  חולץ כלשונו מ-maor/src/components/supporters/lib.ts:261-296 (verbatim מהלגאסי
 *  legacy-main-script.js:1486-1495); הקריאה-לשכן termOf(config,…) הפכה לשקע
 *  term(key, fallback) מוזרק (חוק-1) — לא-מוזרק ⇒ ה-fallback כמות-שהוא. */
export function supDonEvents(sp, term, T2) {
    const T = (k, fb) => (term ? term(k, fb) : fb);
    const out = (sp.donations || []).map((d) => ({
        date: d.date,
        amount: d.amount,
        cur: d.cur || '₪',
        src: T2.k1 + d.rid,
        rid: d.rid,
    }));
    for (const h of sp.hist || []) {
        // 13.8 — פירוט מטא-דאטת-הסליקה בשורת-ההיסטוריה (רק שדות שקיימים).
        const meta = [
            h.receipt && T2.k1 + h.receipt,
            h.txn && T2.k2 + h.txn,
            h.ref && T2.k3 + h.ref,
            h.brand,
            h.last4 && '•' + h.last4,
            h.clearer,
            h.pays && h.pays > 1 && h.pays + T2.k4,
            h.status,
        ]
            .filter(Boolean)
            .join(' · ');
        // הכרעת-בעלים 19.8 ("אין יותר קובץ היסטורי — נדרים זה חי"): רשומה שהגיעה מחברת-
        // סליקה (clearer, למשל נדרים) היא תרומה חיה — מוצגת כ"תרומה", לא "מהקובץ ההיסטורי".
        // רק ייבוא-קובץ-ישן (בלי חברה-סולקת) נשאר "מהקובץ ההיסטורי" (תאימות-לאחור).
        const label = h.clearer ? T(T2.k5, T2.k6) : T2.k7;
        out.push({ date: h.d, amount: h.a, cur: h.c || '₪', src: label + (meta ? ' · ' + meta : '') });
    }
    if (!(sp.hist || []).length) {
        const seen = new Set(out.map((x) => x.date));
        if (sp.first && !seen.has(sp.first))
            out.push({ date: sp.first, amount: 0, cur: '', src: T(T2.k5, T2.k6) + T2.k8 });
        if (sp.last && sp.last !== sp.first && !seen.has(sp.last))
            out.push({ date: sp.last, amount: 0, cur: '', src: T(T2.k5, T2.k6) + T2.k9 });
    }
    return out.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}
