/** חוט · visible-supporters-for-designations — קודם אוטומטית (אפיון-Golden). חוזה: visible-supporters-for-designations.contract.md */
// שכן-פנימי מוטמע (חוק-החשמלאי: פונקציה-טהורה-קטנה ⇒ inline; מקור: maor/src/components/supporters/lib.ts:55-68)
function supporterVisibleForDesignations(sup, allowed) {
    if (!allowed || !allowed.length)
        return true;
    const fw = (sup.forWho ?? '').trim();
    if (!fw)
        return false;
    return new Set(allowed.map((s) => s.trim())).has(fw);
}
export function visibleSupportersForDesignations(supporters, allowed) {
    if (!allowed || !allowed.length)
        return supporters;
    const set = new Set(allowed.map((s) => s.trim()));
    return supporters
        .filter((sup) => supporterVisibleForDesignations(sup, allowed))
        .map((sup) => ({
        ...sup,
        donations: (sup.donations ?? []).filter((d) => {
            const p = (d.purpose ?? '').trim();
            return !p || set.has(p);
        }),
    }));
}
/** כל ייעודי-התרומה הקיימים (distinct, ממויין) — להצעה באשף ולבורר-הסינון.
 *  כולל את הייעוד-פר-תורם (`forWho`) — כך המנהל בוחר מהערכים הקיימים בפועל. */
