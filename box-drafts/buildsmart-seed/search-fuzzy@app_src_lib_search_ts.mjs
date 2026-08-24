/** 🪨 טיוטת-חוט (דרגת-מחצבה) · searchFuzzy — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: buildsmart/app/src/lib/search.ts:65-91 (27 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): searchFuzzy, normalize, searchIndex, editDistance
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function searchFuzzy(query, limit = 6) {
    const q = normalize(query.trim());
    if (q.length < 2)
        return [];
    const tolerance = Math.floor(q.length / 3) + 1;
    const scored = [];
    for (const hit of searchIndex()) {
        let bestDist = Infinity;
        for (const kw of hit.keywords) {
            const norm = normalize(kw);
            const window = Math.min(norm.length, q.length + tolerance);
            for (let start = 0; start + q.length - tolerance <= norm.length; start++) {
                const slice = norm.slice(start, start + window);
                const d = editDistance(q, slice);
                if (d < bestDist)
                    bestDist = d;
                if (bestDist <= tolerance)
                    break;
            }
            if (bestDist <= tolerance)
                break;
        }
        if (bestDist <= tolerance) {
            scored.push({ hit, dist: bestDist + KIND_ORDER[hit.kind] * 0.1 });
        }
    }
    scored.sort((a, b) => a.dist - b.dist);
    return scored.slice(0, limit).map((s) => s.hit);
}
