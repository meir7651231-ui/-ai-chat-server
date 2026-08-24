/** 🔌 חוט · employee-sign-up-error — ולידציית הרשמת-עובד/ת (ORGADMIN, "קוד מהבוס"):
 *  מייל תקין · טלפון · סיסמה ≥6 · קוד-הזמנה לא-ריק ⇒ הודעת-שגיאה בעברית או '' כשתקין.
 *  מוצא: maor/src/lib/config.ts:762-768 כלשונו. */
export function employeeSignUpError(email, phone, password, code) {
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) return 'כתובת האימייל אינה תקינה';
  if (!/^[\d+][\d\s-]{6,}$/.test(phone.trim())) return 'מספר טלפון תקין הוא שדה חובה';
  if (password.length < 6) return 'הסיסמה חייבת להיות לפחות 6 תווים';
  if (!code.trim()) return 'קוד-ההזמנה מהמנהל הוא שדה חובה';
  return '';
}
