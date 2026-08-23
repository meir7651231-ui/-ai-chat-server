/** 🪨 טיוטת-חוט (דרגת-מחצבה) · intakeLog — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:588-609 (22 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): intakeLog
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function intakeLog(db) {
    const rows = db.shopIntakes
        .map((intake) => ({ intake, itemName: db.shopItems.find((i) => i.id === intake.itemId)?.name ?? '—' }))
        .sort((a, b) => b.intake.date.localeCompare(a.intake.date));
    return { rows, totalCost: rows.reduce((s, r) => s + r.intake.cost, 0) };
}
/**
 * המשפחות הזכאיות לשיוך המוני: משפחות פעילות שיש להן — ברמת שיוך קיים
 * כלשהו — את **כל** הקריטריונים שנבחרו (איחוד על-פני השיוכים), או כל
 * המשפחות הפעילות כשלא נבחר קריטריון. מסונן ממי שכבר מחזיקה שיוך active
 * לאותה חבילה (אין כפל).
 */
