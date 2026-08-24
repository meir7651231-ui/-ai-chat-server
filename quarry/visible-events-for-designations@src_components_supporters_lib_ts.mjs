/** 🪨 טיוטת-חוט (דרגת-מחצבה) · visibleEventsForDesignations — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:98-113 (16 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supporterVisibleForDesignations
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function visibleEventsForDesignations(events, supporters, allowed) {
    if (!allowed || !allowed.length)
        return events;
    const byId = new Map(supporters.map((s) => [s.id, s]));
    return events.filter((ev) => {
        if (!ev.spId)
            return true; // אירוע לא-מקושר-לתורם — לא בתחום-ההגבלה
        const sp = byId.get(ev.spId);
        return sp ? supporterVisibleForDesignations(sp, allowed) : false;
    });
}
/** כל ייעודי-התרומה הקיימים (distinct, ממויין) — להצעה באשף ולבורר-הסינון.
 *  כולל את הייעוד-פר-תורם (`forWho`) — כך המנהל בוחר מהערכים הקיימים בפועל. */
