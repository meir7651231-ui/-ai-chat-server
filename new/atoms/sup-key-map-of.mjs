/** חוט · sup-key-map-of — מפת spId→skey מרשימת-התומכים (אכיפת-הרשאה, פאזה-1).
 *  חוזה: sup-key-map-of.contract.md
 *  חולץ כלשונו מ-maor/src/lib/supporterPartition.ts:52-60; הקריאה-לשכן
 *  supKeyOf הפכה לשקע מוזרק (חוק-1) — האטום ממפה, השקע גוזר את המפתח. */
export function supKeyMapOf(supporters, supKeyOf) {
    return new Map(supporters.map((sp) => [sp.id, supKeyOf(sp)]));
}
