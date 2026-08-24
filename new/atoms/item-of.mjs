/** חוט · item-of — פענוח רכיב-בחבילה לפריט-הקטלוג שלו + דריסות (SHOP4, הכרעה 18).
 *  חוזה: item-of.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:49-78 (תורגם TS→JS);
 *  אפס שקעים — קריאה ישירה על db בלבד (חוק-1). */
export function itemOf(db, comp) {
    const item = db.shopItems.find((i) => i.id === comp.itemId);
    if (!item) {
        return {
            itemId: comp.itemId,
            name: comp.label,
            kind: comp.kind,
            storeId: comp.storeId,
            value: comp.value ?? 0,
            basePrice: comp.basePrice ?? 0,
            stock: comp.stock,
            validDays: comp.validDays,
            active: true,
        };
    }
    return {
        itemId: item.id,
        name: item.name,
        kind: item.kind,
        storeId: item.storeId,
        value: comp.value ?? item.value,
        basePrice: comp.basePrice ?? item.basePrice,
        stock: item.stock,
        validDays: item.validDays,
        holidays: item.holidays,
        active: item.active,
    };
}
