/** חוט · charge-dedup-key — מפתח-דדופ לעסקת-סליקה: txn ראשון, נפילה לאסמכתא, ריק ⇒ אין-דדופ.
 *  חוזה: charge-dedup-key.contract.md
 *  חולץ כלשונו מ-maor/src/lib/nedarimSync.ts:146-152 (תורגם TS→JS) — טהור, אפס שקעים. */
export function chargeDedupKey(charge, T) {
    const txn = (charge.txnId || '').trim();
    if (txn)
        return T.k1 + txn;
    const ref = (charge.reference || '').trim();
    return ref ? T.k2 + ref : '';
}
