/** 🪨 טיוטת-חוט (דרגת-מחצבה) · cloudDb — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:273-298 (26 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): cloudDb, requireDb, hebrewAuthError, toString
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function cloudDb() {
    return requireDb();
}
/** מיפוי קודי שגיאה של Firebase Auth להודעות בעברית. */
function hebrewAuthError(e) {
    const code = (e?.code ?? '').toString();
    switch (code) {
        case 'auth/invalid-credential':
        case 'auth/invalid-login-credentials':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
        case 'auth/invalid-email':
            return new Error('אימייל או סיסמה שגויים');
        case 'auth/network-request-failed':
            return new Error('אין חיבור לאינטרנט — בדקו את החיבור ונסו שוב');
        case 'auth/too-many-requests':
            return new Error('יותר מדי ניסיונות — המתינו מספר דקות ונסו שוב');
        case 'auth/user-disabled':
            return new Error('החשבון הושבת — פנו למנהל המערכת');
        default:
            return new Error('הכניסה נכשלה — נסו שוב');
    }
}
/** מעקב אחר מצב ההתחברות — מחזיר unsubscribe. */
