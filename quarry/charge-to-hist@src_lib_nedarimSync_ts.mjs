/** 🪨 טיוטת-חוט (דרגת-מחצבה) · chargeToHist — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/nedarimSync.ts:124-145 (22 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): chargeToHist, curOf, providerClearer
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function chargeToHist(charge) {
    const h = {
        d: (charge.d || (charge.at || '').slice(0, 10) || '').trim(),
        a: charge.amount,
        c: curOf(charge),
        clearer: providerClearer(charge.provider),
    };
    const ref = (charge.reference || '').trim();
    const txn = (charge.txnId || '').trim();
    const rec = (charge.receipt || '').trim();
    const l4 = (charge.last4 || '').trim();
    const keva = (charge.kevaId || '').trim();
    if (ref)
        h.ref = ref;
    if (txn)
        h.txn = txn;
    if (rec)
        h.receipt = rec;
    if (l4)
        h.last4 = l4;
    if (keva)
        h.kevaId = keva; // חיוב חוזר — נשמר ל-hist לזיהוי-הו"ק מדויק בעתיד
    return h;
}
/** מפתח-דדופ לעסקה: txn ראשון, נפילה ל-**אסמכתא** (reference) — כך CallBack-כפול
 *  בלי TransactionId (ספק-אחר/CallBack-חלקי) לא משכפל שורת-hist. ריק ⇒ אין דדופ. */
