/** 🪨 טיוטת-חוט (דרגת-מחצבה) · chargeDedupKey — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/nedarimSync.ts:146-171 (26 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): chargeDedupKey, histDedupKey, hokDayFromDate, isFinite
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function chargeDedupKey(charge) {
    const txn = (charge.txnId || '').trim();
    if (txn)
        return 'txn:' + txn;
    const ref = (charge.reference || '').trim();
    return ref ? 'ref:' + ref : '';
}
/** מפתח-דדופ מרשומת-hist קיימת (מקביל ל-chargeDedupKey). */
function histDedupKey(h) {
    const txn = (h.txn || '').trim();
    if (txn)
        return 'txn:' + txn;
    const ref = (h.ref || '').trim();
    return ref ? 'ref:' + ref : '';
}
/* ── מילוי-אוטומטי של משבצת-ההו"ק מחיוב-נדרים חוזר (הכרעת-בעלים 19.8:
   "שיתמלא אוטומטית מנדרים ישר למשבצת של הו"ק") — חיוב עם kevaId ⇒ הכרטיס מסומן
   כהו"ק פעיל (סכום/מטבע/יום מהחיוב). הו"ק **ידני** של המשרד (בלי kevaId) לא נדרס. */
/** יום-החיוב מתאריך-העסקה (1–28 — כך קיים בכל חודש). ברירת-מחדל 1. */
function hokDayFromDate(iso) {
    const d = Number((iso || '').slice(8, 10));
    return isFinite(d) && d >= 1 ? Math.min(28, Math.floor(d)) : 1;
}
/** אם העסקה חוזרת (kevaId) — ממלא/מעדכן את משבצת-ההו"ק של הכרטיס. משמר startedAt
 *  מוקדם-ביותר; מעדכן סכום/מטבע/יום מהעסקה. הו"ק-ידני (בלי kevaId) לא נגוע. */
