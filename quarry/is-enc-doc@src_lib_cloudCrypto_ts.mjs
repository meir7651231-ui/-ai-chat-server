/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isEncDoc — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudCrypto.ts:30-34 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isEncDoc
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isEncDoc(d) {
    return !!d && typeof d === 'object' && typeof d.enc === 'string' && typeof d.iv === 'string';
}
/** הצפנת מסמך (אובייקט) ל-{enc,iv} עם ה-DEK. IV אקראי לכל כתיבה (חובה ל-GCM). */
