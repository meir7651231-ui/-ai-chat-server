/** חוט · diff-db — השוואת שני מצבי-DB לסט-פעולות מינימלי (sets/deletes/meta).
 *  חוזה: diff-db.contract.md · שקעים: entityCollections, metaKeys, sameJson, metaOf
 *  חולץ כלשונו מ-maor/src/lib/cloud-diff.ts:147-172 (קריאות-השכן שוקעו). */
export function diffDb(prev, next, entityCollections, metaKeys, sameJson, metaOf) {
    const sets = [];
    const deletes = [];
    for (const col of entityCollections) {
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
    for (const k of metaKeys) {
        if (!sameJson(prev[k], next[k])) {
            meta = metaOf(next);
            break;
        }
    }
    return { sets, deletes, meta };
}
