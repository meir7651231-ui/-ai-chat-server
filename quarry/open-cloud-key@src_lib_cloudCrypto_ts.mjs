/** 🪨 טיוטת-חוט (דרגת-מחצבה) · openCloudKey — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudCrypto.ts:72-77 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): openCloudKey, openDek
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function openCloudKey(env, secret, via) {
    return openDek(env, secret, via);
}
export { isEncrypted };
