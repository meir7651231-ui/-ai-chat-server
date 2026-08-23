/** 🪨 טיוטת-חוט (דרגת-מחצבה) · diffDb — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud-diff.ts:147-172 (26 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): diffDb, sameJson, metaOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function diffDb(prev, next) {
    const sets = [];
    const deletes = [];
    for (const col of ENTITY_COLLECTIONS) {
        const prevList = prev[col];
        const nextList = next[col];
        if (prevList === nextList)
            continue;
        const prevById = new Map(prevList.map((x) => [x.id, x]));
        for (const item of nextList) {
            const old = prevById.get(item.id);
            prevById.delete(item.id);
            if (!old || !sameJson(old, item))
                sets.push({ col, id: item.id, data: item });
        }
        for (const id of prevById.keys())
            deletes.push({ col, id });
    }
    let meta = null;
    for (const k of META_KEYS) {
        if (!sameJson(prev[k], next[k])) {
            meta = metaOf(next);
            break;
        }
    }
    return { sets, deletes, meta };
}
/** ה-DB המלא כ-diff — להעלאה ראשונה של נתונים מקומיים לפרויקט ענן ריק. */
