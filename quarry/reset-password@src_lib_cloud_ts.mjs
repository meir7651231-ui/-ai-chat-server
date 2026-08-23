/** 🪨 טיוטת-חוט (דרגת-מחצבה) · resetPassword — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:347-361 (15 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): resetPassword, sendPasswordResetEmail, requireAuth, toString, hebrewAuthError
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(requireAuth(), email);
    }
    catch (e) {
        const code = (e?.code ?? '').toString();
        if (code === 'auth/user-not-found')
            throw new Error('לא נמצא משתמש עם האימייל הזה');
        if (code === 'auth/invalid-email')
            throw new Error('כתובת האימייל אינה תקינה');
        throw hebrewAuthError(e);
    }
}
/**
 * שינוי סיסמה למשתמש מחובר — אימות-מחדש עם הסיסמה הנוכחית (דרישת Firebase
 * ל-recent-login) ואז החלפה. שגיאות בעברית; הסשן נשאר מחובר.
 */
