/** חוט · ayin-board-items — פריטי-לוח שטוחים מכרטיסי מעקב-הטיפול.
 *  חוזה: ayin-board-items.contract.md · שקע: emptyAyin
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:335-357 (קריאת-השכן שוקעה). */
export function ayinBoardItems(supporters, emptyAyin) {
    const out = [];
    for (const sp of supporters) {
        if (!sp.ayin)
            continue;
        const a = { ...emptyAyin(), ...sp.ayin };
        for (const n of a.names) {
            if (!n.name.trim())
                continue;
            out.push({
                supporterId: sp.id,
                supporter: sp.name,
                phone: sp.phone || '',
                name: n.name,
                eyes: n.eyes !== '' && n.eyes != null ? +n.eyes : '',
                note: n.note || '',
                done: !!n.done,
                stage: a.stage,
            });
        }
    }
    return out;
}
