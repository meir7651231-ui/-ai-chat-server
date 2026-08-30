/** חוט · change-password — שינוי-סיסמה: אימות-מחדש ואז החלפה, שגיאות בעברית.
 *  חוזה: change-password.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:362-383 (תורגם TS→JS); קריאות Firebase-Auth
 *  (getUser/reauth/update) ומיפוי-השגיאות hebrewAuthError הוזרקו כשקעים (חוק-1). */
export async function changePassword(currentPass, nextPass, getUser, reauth, update, hebrewAuthError, T) {
    const u = getUser();
    if (!u || !u.email)
        throw new Error(T.k1);
    try {
        await reauth(u, currentPass);
    }
    catch (e) {
        const code = (e?.code ?? '').toString();
        if (code === T.k2 || code === T.k3 || code === T.k4)
            throw new Error(T.k5);
        throw hebrewAuthError(e);
    }
    try {
        await update(u, nextPass);
    }
    catch (e) {
        const code = (e?.code ?? '').toString();
        if (code === T.k6)
            throw new Error(T.k7);
        throw hebrewAuthError(e);
    }
}
