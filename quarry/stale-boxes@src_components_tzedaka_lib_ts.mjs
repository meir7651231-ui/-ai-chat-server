/** 🪨 טיוטת-חוט (דרגת-מחצבה) · staleBoxes — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/tzedaka/lib.ts:80-100 (21 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): staleBoxes, setDate, getDate, isoOf, lastCollectionIso, termOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function staleBoxes(boxes, todayIso, days = TZ_STALE_DAYS) {
    const cutoff = new Date(todayIso + 'T12:00:00');
    cutoff.setDate(cutoff.getDate() - days);
    const cut = isoOf(cutoff);
    return boxes.filter((b) => {
        if (b.status !== 'home')
            return false;
        const last = lastCollectionIso(b) || b.since;
        return !!last && last <= cut;
    });
}
/** רשימת הטיפול המשרדי — ממוינת לפי סוג (ישנות → אבודות → רכזים → מבצעים).
 *  config (רשות, swarm-audit): 'קופה' היה קשיח ועקף את termOf('entity.tzBox') —
 *  דליפת-מונח בוורטיקלים; בלי config הנוסח ההיסטורי נשמר ביט-זהה. */
