/** חוט · ayin-action-visible — גלוּת הכפתור-החכם בתיק מעקב-הטיפול.
 *  חוזה: ayin-action-visible.contract.md · שקעים: אין
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:145-153. */
export function ayinActionVisible(a, T) {
    const st = a.stage;
    if (st === T.k1)
        return false;
    if (st === T.k2)
        return a.names.length > 0;
    if (st === T.k3)
        return a.names.some((n) => n.eyes !== '' && n.eyes != null);
    return true;
}
