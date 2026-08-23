/** 🪨 טיוטת-חוט (דרגת-מחצבה) · siteUi — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/publicSite.ts:198-217 (20 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): siteUi
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function siteUi(lang, key) {
    return (SITE_UI[lang] ?? SITE_UI.he)[key] ?? SITE_UI.he[key] ?? '';
}
/**
 * מחשב התקדמות-קמפיין וספירה-לאחור. ‏nowMs מוזרק (טהור/בדיק). יעד לא-חיובי
 * ⇒ show=false. אחוז חסום ל-0–100 גם כשנגבה מעל היעד.
 */
