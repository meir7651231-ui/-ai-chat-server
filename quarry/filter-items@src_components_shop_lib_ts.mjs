/** 🪨 טיוטת-חוט (דרגת-מחצבה) · filterItems — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:551-564 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): filterItems, itemRemaining, smartFilter
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function filterItems(db, q, stockState) {
    let list = [...db.shopItems];
    if (stockState) {
        list = list.filter((i) => {
            const rem = itemRemaining(db, i.id);
            if (stockState === 'untracked')
                return rem === null;
            if (stockState === 'out')
                return rem === 0;
            return rem !== null && rem > 0 && rem <= 2; // low
        });
    }
    return smartFilter(q, list, (i) => [i.name, ...i.name.split(/\s+/)]);
}
/** סינון מימושי שיוך — טווח כוללני (dateInRange המשותף); includeVoided=true (ברירת שקיפות). */
