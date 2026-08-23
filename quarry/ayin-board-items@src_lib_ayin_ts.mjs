/** 🪨 טיוטת-חוט (דרגת-מחצבה) · ayinBoardItems — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:335-357 (23 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): ayinBoardItems, emptyAyin
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function ayinBoardItems(supporters) {
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
/** סינון מסך-הטיפול — טקסט חופשי (תומכ/ת + שם + הערה), סטטוס ושלב. טהור. */
