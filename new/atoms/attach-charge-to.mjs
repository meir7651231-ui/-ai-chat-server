/** חוט · attach-charge-to — חיבור-ידני של עסקה לכרטיס-תומך (דדופ-גלובלי C2, מגן-ביטול C10).
 *  חוזה: attach-charge-to.contract.md
 *  חולץ כלשונו מ-maor/src/lib/nedarimSync.ts:322-343 (תורגם TS→JS); השכנים
 *  chargeDedupKey/histDedupKey/chargeToHist/fillCardFromCharge/withNedarimHok
 *  הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function attachChargeTo(supporters, supId, charge, chargeDedupKey, histDedupKey, chargeToHist, fillCardFromCharge, withNedarimHok) {
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
