/** חוט · sign-up — הרשמה עצמית (CLOUD2 ענן 3): יוצר משתמש, שולח מייל-אימות
 *  best-effort (כשל-שליחה לא מפיל), ומחזיר uid; קודי-כשל ידועים ⇒ Error עברי
 *  ספציפי, השאר דרך שקע-התרגום.
 *  חוזה: sign-up.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:318-337; השכנים createUserWithEmailAndPassword ·
 *  requireAuth · sendEmailVerification · hebrewAuthError הוזרקו כשקעים (חוק-1). */
export async function signUp(email, password, createUserWithEmailAndPassword, requireAuth, sendEmailVerification, hebrewAuthError) {
  try {
    const cred = await createUserWithEmailAndPassword(requireAuth(), email, password);
    // 🛡️ נחיל-אבטחה 17.8 (ממצא #1 · שלב-1, תוספתי/לא-שובר): שולחים מייל-אימות
    // מיד בהרשמה. כרגע לא-אוכף (אף בדיקת-הרשאה עדיין לא דורשת email_verified) ⇒
    // ביט-זהה למשתמשים הקיימים. זו נקודת-הפתיחה למיגרציה: כשכל החברים אימתו,
    // אפשר לדרוש email_verified ב-Rules (orgManager/superAdmin/allowedRoot) —
    // וזה יסגור את "חטיפת-זהות-מוקדמת של מנהל". שליחה best-effort (כשל-רך).
    void sendEmailVerification(cred.user).catch(() => { /* כשל-שליחה לא מפיל הרשמה */ });
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
