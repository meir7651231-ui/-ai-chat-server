/** 🔌 חוט · employee-sign-up-error — ולידציית הרשמת-עובד/ת (ORGADMIN, "קוד מהבוס"):
 *  מייל תקין · טלפון · סיסמה ≥6 · קוד-הזמנה לא-ריק ⇒ הודעת-שגיאה בעברית או '' כשתקין.
 *  מוצא: maor/src/lib/config.ts:762-768 כלשונו. */
export function employeeSignUpError(email, phone, password, code, T) {
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) return T.k1;
  if (!/^[\d+][\d\s-]{6,}$/.test(phone.trim())) return T.k2;
  if (password.length < 6) return T.k3;
  if (!code.trim()) return T.k4;
  return '';
}
