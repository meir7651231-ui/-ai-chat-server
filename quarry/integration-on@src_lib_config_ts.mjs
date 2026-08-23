/** 🪨 טיוטת-חוט (דרגת-מחצבה) · integrationOn — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/config.ts:82-89 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): integrationOn
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function integrationOn(cfg, key) {
    return cfg.integrations?.[key]?.enabled === true;
}
/**
 * האם מודול-הטלפוניה פעיל — opt-in (חסר/false=כבוי, רק enabled:true מדליק), כמו
 * הרחבה. מגדיר את הופעת כפתורי-החיוג (📞) במסכי-הקשר (משפחה/תומך/מתנדב/רכז).
 */
