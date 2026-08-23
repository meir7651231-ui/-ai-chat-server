/** 🪨 טיוטת-חוט (דרגת-מחצבה) · orgEnabledFeatures — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/platform/lib.ts:145-162 (18 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): orgEnabledModules
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function orgEnabledFeatures(orgConfig, features) {
    const enabledMods = new Set(orgEnabledModules(orgConfig));
    return features.filter((f) => {
        const isRealModule = ALL_MODULES.includes(f.module);
        if (isRealModule && !enabledMods.has(f.module))
            return false; // מודול-אב כבוי
        // דגל-opt-in (תיקון 21.8, ממצא-נחיל): חסר = **כבוי** — הקריאה הגולמית `=== false`
        // הציגה למנהל צ'יפ-עובד ליכולת שהארגון מעולם לא הדליק/קנה (13 דגלי-opt-in).
        // שיקוף featureEffectiveOn (builder/sections) — משוכפל מקומית כדי להשאיר את
        // ה-lib טהור וגנרי (מקבל את מרשם-הדגלים מבחוץ, בלי תלות ברכיבי-builder).
        if (f.optIn === true)
            return orgConfig.features?.[f.key] === true;
        return orgConfig.features?.[f.key] !== false; // דגל רגיל: רק false מכבה
    });
}
/** האם המייל חבר בארגון (עובד/ת מאושרת או מנהל)? */
