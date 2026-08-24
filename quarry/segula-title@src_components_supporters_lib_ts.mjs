/** 🪨 טיוטת-חוט (דרגת-מחצבה) · segulaTitle — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:338-342 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): segulaTitle
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function segulaTitle(name, r, target) {
    return (r.final ? '🎯 סיום סגולה' : '🕯 סגולה') + ' — ' + (name || '') + ' · יום ' + r.day + '/' + target;
}
/** "₪1,200 + $300" או "—" כשאין כלום — כולל היסטוריה (הכרעת 9.8). */
