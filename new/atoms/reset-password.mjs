/** חוט · reset-password — שליחת מייל איפוס-סיסמה, שגיאות בעברית.
 *  חוזה: reset-password.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:347-356 (תורגם TS→JS); קריאות Firebase-Auth
 *  (requireAuth/sendReset) ומיפוי-השגיאות hebrewAuthError הוזרקו כשקעים (חוק-1). */
export async function resetPassword(email, requireAuth, sendReset, hebrewAuthError, T) {
    try {
        await sendReset(requireAuth(), email);
    }
    catch (e) {
        const code = (e?.code ?? '').toString();
        if (code === T.k1)
            throw new Error(T.k2);
        if (code === T.k3)
            throw new Error(T.k4);
        throw hebrewAuthError(e);
    }
}
