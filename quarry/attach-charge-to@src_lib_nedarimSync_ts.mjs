/** 🪨 טיוטת-חוט (דרגת-מחצבה) · attachChargeTo — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/nedarimSync.ts:322-343 (22 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): attachChargeTo, chargeDedupKey, histDedupKey, withNedarimHok, fillCardFromCharge, chargeToHist
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function attachChargeTo(supporters, supId, charge) {
    const idx = supporters.findIndex((s) => s.id === supId);
    if (idx < 0)
        return { supporters, added: false };
    // 🐛 נחיל-סולה C10: ביטול (amount=0) אינו כסף — המנוע המלא מדלג, וגם המיזוג הידני.
    if (!charge.amount)
        return { supporters, added: false };
    const sp = supporters[idx];
    const key = chargeDedupKey(charge);
    // 🐛 נחיל-סולה C2 (HIGH): הדדופ היה פר-כרטיס — אותה עסקה נרשמה בשני כרטיסים
    // שונים = כסף נספר פעמיים. עכשיו המפתח נבדק מול hist של **כל** התומכים.
    if (key && supporters.some((s) => (s.hist ?? []).some((h) => histDedupKey(h) === key))) {
        return { supporters, added: false };
    }
    const hist = sp.hist || [];
    const next = supporters.slice();
    next[idx] = withNedarimHok(fillCardFromCharge({ ...sp, hist: [...hist, chargeToHist(charge)] }, charge), charge);
    return { supporters: next, added: true };
}
/** ריפוי-תוויות רטרואקטיבי: רשומות-hist שמפתח-הדדופ שלהן (txn/ref) שייך לספק
 *  נתון מקבלות את התווית הנכונה. 🐛 (23.8): עסקאות-סולה שמוזגו לפני התיקון
 *  נרשמו 'נדרים' — גם תווית-מקור שגויה בכרטיס, וגם נמחקות ב"ביטול ייבוא נדרים".
 *  אידמפוטנטי; נוגע רק בשורות שבאמת ברשימת-המזהים. */
