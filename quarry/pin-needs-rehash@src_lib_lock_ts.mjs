/** 🪨 טיוטת-חוט (דרגת-מחצבה) · pinNeedsRehash — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/lock.ts:106-110 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): pinNeedsRehash
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function pinNeedsRehash(hash) {
    return !!hash && !hash.startsWith('v2:');
}
/** בדיקת קוד מול גיבוב שמור (v2 או לגאסי). גיבוב חסר/ריק → תמיד false. */
