/** חוט · sup-enforce-on — האם הקונפיג מדליק אכיפת-תומכים בשכבת-הנתונים.
 *  חוזה: sup-enforce-on.contract.md
 *  חולץ כלשונו מ-maor/src/lib/config.ts:73-81; off-by-default במכוון (הפוך
 *  מחוזה-הדגלים: כאן חסר=כבוי) — רק supporterEnforce:true מפורש מדליק. */
export function supEnforceOn(cfg) {
    return cfg.supporterEnforce === true;
}
