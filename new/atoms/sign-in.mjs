/** חוט · sign-in — כניסה באימייל+סיסמה: מפעיל את שקע-הכניסה על ה-auth,
 *  וכל כשל (כולל auth-לא-מאותחל) מתורגם לשגיאה עברית דרך שקע-התרגום ונזרק.
 *  חוזה: sign-in.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:306-317; השכנים signInWithEmailAndPassword ·
 *  requireAuth · hebrewAuthError הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export async function signIn(email, password, signInWithEmailAndPassword, requireAuth, hebrewAuthError) {
  try {
    await signInWithEmailAndPassword(requireAuth(), email, password);
  }
  catch (e) {
    throw hebrewAuthError(e);
  }
}
