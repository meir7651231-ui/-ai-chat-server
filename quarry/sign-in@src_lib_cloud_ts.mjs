/** 🪨 טיוטת-חוט (דרגת-מחצבה) · signIn — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:306-317 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): signIn, signInWithEmailAndPassword, requireAuth, hebrewAuthError
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function signIn(email, password) {
    try {
        await signInWithEmailAndPassword(requireAuth(), email, password);
    }
    catch (e) {
        throw hebrewAuthError(e);
    }
}
/**
 * הרשמה עצמית (CLOUD2 ענן 3) — יוצרת משתמש Auth ומחזירה את ה-uid; המשתמש
 * מחובר אך לא רואה כלום עד שהבעלים מאשר (שער החברות). שגיאות בעברית.
 */
