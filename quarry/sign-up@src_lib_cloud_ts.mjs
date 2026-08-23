/** 🪨 טיוטת-חוט (דרגת-מחצבה) · signUp — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:318-337 (20 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): signUp, createUserWithEmailAndPassword, requireAuth, sendEmailVerification, catch, toString, hebrewAuthError
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function signUp(email, password) {
    try {
        const cred = await createUserWithEmailAndPassword(requireAuth(), email, password);
        // 🛡️ נחיל-אבטחה 17.8 (ממצא #1 · שלב-1, תוספתי/לא-שובר): שולחים מייל-אימות
        // מיד בהרשמה. כרגע לא-אוכף (אף בדיקת-הרשאה עדיין לא דורשת email_verified) ⇒
        // ביט-זהה למשתמשים הקיימים. זו נקודת-הפתיחה למיגרציה: כשכל החברים אימתו,
        // אפשר לדרוש email_verified ב-Rules (orgManager/superAdmin/allowedRoot) —
        // וזה יסגור את "חטיפת-זהות-מוקדמת של מנהל". שליחה best-effort (כשל-רך).
        void sendEmailVerification(cred.user).catch(() => { });
        return cred.user.uid;
    }
    catch (e) {
        const code = (e?.code ?? '').toString();
        if (code === 'auth/email-already-in-use')
            throw new Error('האימייל כבר רשום — נסו להתחבר או לאפס סיסמה');
        if (code === 'auth/weak-password')
            throw new Error('הסיסמה חלשה מדי — לפחות 6 תווים');
        if (code === 'auth/invalid-email')
            throw new Error('כתובת האימייל אינה תקינה');
        if (code === 'auth/operation-not-allowed')
            throw new Error('ההרשמה סגורה כרגע — פנו למנהל המערכת');
        throw hebrewAuthError(e);
    }
}
