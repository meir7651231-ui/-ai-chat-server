/** חוט · change-password — שינוי-סיסמה: אימות-מחדש ואז החלפה, שגיאות בעברית.
 *  חוזה: change-password.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:362-383 (תורגם TS→JS); קריאות Firebase-Auth
 *  (getUser/reauth/update) ומיפוי-השגיאות hebrewAuthError הוזרקו כשקעים (חוק-1). */
export async function changePassword(currentPass, nextPass, getUser, reauth, update, hebrewAuthError) {
    const u = getUser();
    if (!u || !u.email)
        throw new Error('אין משתמש מחובר — התחברו ונסו שוב');
    try {
        await reauth(u, currentPass);
    }
    catch (e) {
        const code = (e?.code ?? '').toString();
        if (code === 'auth/wrong-password' || code === 'auth/invalid-credential' || code === 'auth/invalid-login-credentials')
            throw new Error('הסיסמה הנוכחית שגויה');
        throw hebrewAuthError(e);
    }
    try {
        await update(u, nextPass);
    }
    catch (e) {
        const code = (e?.code ?? '').toString();
        if (code === 'auth/weak-password')
            throw new Error('הסיסמה החדשה חלשה מדי — לפחות 6 תווים');
        throw hebrewAuthError(e);
    }
}
