/** חוט · reset-password — שליחת מייל איפוס-סיסמה, שגיאות בעברית.
 *  חוזה: reset-password.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:347-356 (תורגם TS→JS); קריאות Firebase-Auth
 *  (requireAuth/sendReset) ומיפוי-השגיאות hebrewAuthError הוזרקו כשקעים (חוק-1). */
export async function resetPassword(email, requireAuth, sendReset, hebrewAuthError) {
    try {
        await sendReset(requireAuth(), email);
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
