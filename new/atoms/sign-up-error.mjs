/** חוט · sign-up-error — ולידציית טופס-הרשמה עצמית (CLOUD2): הודעת-שגיאה בעברית או ''.
 *  חוזה: sign-up-error.contract.md
 *  חולץ כלשונו מ-maor/src/lib/config.ts:739-761 — טהור, אפס שקעים. */
export function signUpError(orgName, contactName, phone, email, password, password2, T) {
  if (!orgName.trim())
    return T.k1;
  // הזרימה מבוססת שיחה חוזרת (עדכון פקודה 30.7) — איש קשר וטלפון חובה
  if (!contactName.trim())
    return T.k2;
  if (!/^[\d+][\d\s-]{6,}$/.test(phone.trim()))
    return T.k3;
  if (!/^\S+@\S+\.\S+$/.test(email.trim()))
    return T.k4;
  if (password.length < 6)
    return T.k5;
  if (password !== password2)
    return T.k6;
  return '';
}
