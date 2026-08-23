/** 🪨 טיוטת-חוט (דרגת-מחצבה) · visibleSupportersForDesignations — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:75-93 (19 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): visibleSupportersForDesignations, supporterVisibleForDesignations
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
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
