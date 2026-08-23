/** 🪨 טיוטת-חוט (דרגת-מחצבה) · watchAuth — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:299-305 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): watchAuth, onAuthStateChanged, requireAuth
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function watchAuth(cb) {
    return onAuthStateChanged(requireAuth(), (u) => {
        cb(u ? { uid: u.uid, email: u.email ?? '' } : null);
    });
}
/** כניסה באימייל+סיסמה — זורק Error עם הודעה בעברית. אין הרשמה עצמית. */
