/** חוט · ayin-action-visible — גלוּת הכפתור-החכם בתיק מעקב-הטיפול.
 *  חוזה: ayin-action-visible.contract.md · שקעים: אין
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:145-153. */
export function ayinActionVisible(a) {
    const st = a.stage;
    if (st === 'done')
        return false;
    if (st === 'new')
        return a.names.length > 0;
    if (st === 'eyes')
        return a.names.some((n) => n.eyes !== '' && n.eyes != null);
    return true;
}
