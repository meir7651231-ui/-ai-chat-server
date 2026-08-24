/** 🪨 טיוטת-חוט (דרגת-מחצבה) · searchExact — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: buildsmart/app/src/lib/search.ts:16-64 (49 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): searchExact, normalize, searchIndex, editDistance
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function searchExact(query, limit = 40) {
    const q = normalize(query.trim());
    if (!q)
        return [];
    const prefix = [];
    const contains = [];
    for (const hit of searchIndex()) {
        let bestPos = -1;
        for (const kw of hit.keywords) {
            const pos = normalize(kw).indexOf(q);
            if (pos >= 0 && (bestPos < 0 || pos < bestPos))
                bestPos = pos;
        }
        if (bestPos < 0)
            continue;
        const bucket = bestPos === 0 ? prefix : contains;
        bucket.push({ hit, score: bestPos * 100 + KIND_ORDER[hit.kind] });
    }
    prefix.sort((a, b) => a.score - b.score);
    contains.sort((a, b) => a.score - b.score);
    return [...prefix, ...contains].slice(0, limit).map((x) => x.hit);
}
/* Damerau-style Levenshtein for short Hebrew strings */
function editDistance(a, b) {
    if (a === b)
        return 0;
    const m = a.length;
    const n = b.length;
    if (!m)
        return n;
    if (!n)
        return m;
    let prev = new Array(n + 1);
    let cur = new Array(n + 1);
    for (let j = 0; j <= n; j++)
        prev[j] = j;
    for (let i = 1; i <= m; i++) {
        cur[0] = i;
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        }
        [prev, cur] = [cur, prev];
    }
    return prev[n];
}
/**
 * Fuzzy fallback. Only runs when `searchExact` returned nothing AND the
 * query is at least 2 characters. Tolerance is roughly 1 edit per 3 chars.
 */
