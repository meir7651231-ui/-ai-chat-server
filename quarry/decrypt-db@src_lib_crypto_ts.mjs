/** 🪨 טיוטת-חוט (דרגת-מחצבה) · decryptDb — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/crypto.ts:123-127 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): decryptDb, decode, aesDec
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function decryptDb(env, dek) {
    return dec.decode(await aesDec(dek, env.data));
}
/** הצפנת JSON חדש עם DEK קיים (שמירה שוטפת) — שומר על אותה מעטפת/עטיפות. */
