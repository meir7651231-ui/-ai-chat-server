/** 🪨 טיוטת-חוט (דרגת-מחצבה) · itemOf — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:49-78 (30 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): itemOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
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
/** האם החג רלוונטי לפריט מתנת-חג — ריק/חסר = כל החגים (הכרעה 17). */
