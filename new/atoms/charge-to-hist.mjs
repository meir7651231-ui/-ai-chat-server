/** חוט · charge-to-hist — בניית רשומת-hist מעסקת-סליקה (רק שדות לא-ריקים; d/a/c/clearer תמיד).
 *  חוזה: charge-to-hist.contract.md
 *  חולץ כלשונו מ-maor/src/lib/nedarimSync.ts:124-145 (תורגם TS→JS); השכנים
 *  curOf/providerClearer הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function chargeToHist(charge, curOf, providerClearer) {
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
