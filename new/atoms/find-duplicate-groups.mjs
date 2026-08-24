/** חוט · find-duplicate-groups — רכיבי-קשירות של משפחות כפולות (טלפון/שם+עיר).
 *  חוזה: find-duplicate-groups.contract.md
 *  חולץ כלשונו מ-maor/src/lib/dedup.ts:42-108 (תורגם TS→JS);
 *  השכנים phonesOf·nameCityKey הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function findDuplicateGroups(families, phonesOf, nameCityKey) {
    const parent = new Map();
    const find = (x) => {
        let r = x;
        while (parent.get(r) !== r)
            r = parent.get(r);
        // דחיסת-נתיב
        let c = x;
        while (parent.get(c) !== r) {
            const nx = parent.get(c);
            parent.set(c, r);
            c = nx;
        }
        return r;
    };
    const union = (a, b) => {
        const ra = find(a);
        const rb = find(b);
        if (ra !== rb)
            parent.set(ra, rb);
    };
    for (const f of families)
        parent.set(f.id, f.id);
    const byPhone = new Map();
    const byNameCity = new Map();
    for (const f of families) {
        for (const p of phonesOf(f)) {
            const prev = byPhone.get(p);
            if (prev)
                union(prev, f.id);
            else
                byPhone.set(p, f.id);
        }
        const nk = nameCityKey(f);
        if (nk) {
            const prev = byNameCity.get(nk);
            if (prev)
                union(prev, f.id);
            else
                byNameCity.set(nk, f.id);
        }
    }
    const groups = new Map();
    for (const f of families) {
        const r = find(f.id);
        (groups.get(r) ?? groups.set(r, []).get(r)).push(f.id);
    }
    return [...groups.values()].filter((g) => g.length >= 2);
}
