/** 🪨 טיוטת-חוט (דרגת-מחצבה) · DEFAULT_PRICES — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/pricing.ts:57-75 (19 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): —
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export const DEFAULT_PRICES = {
    base: 290, // ליבה: בית · משפחות · לוח · הגדרות (CRM בסיסי)
    modules: {
        families: 0, // כלול בבסיס (CRM ליבה)
        calendar: 0, // כלול בבסיס
        courses: 120, // חוגים · שיבוצים · נוכחות — מודול כבד
        diary: 70,
        supporters: 180, // תורמים + קבלות §46 — הערך הגבוה ביותר
        reports: 60,
        tzedaka: 90,
        shop: 90,
        shop7: 80, // חלוקה
    },
    integrations: DEFAULT_INTEGRATION_PRICES,
    sizeMult: { small: 1, medium: 1.6, large: 2.4 },
    setup: 1500, // הקמה/הטמעה חד-פעמית — נורמת-שוק (הבעלים יכול לאפס כמנוף-מכירה)
    enterprise: { oneTime: 55000, annualMaintenance: 9000 },
};
