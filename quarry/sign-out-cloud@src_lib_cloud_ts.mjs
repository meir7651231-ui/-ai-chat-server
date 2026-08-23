/** 🪨 טיוטת-חוט (דרגת-מחצבה) · signOutCloud — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:338-346 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): signOutCloud, signOut, requireAuth
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function signOutCloud() {
    try {
        await signOut(requireAuth());
    }
    catch {
        /* ניתוק נכשל (רשת) — מצב ה-auth המקומי יתעדכן בהזדמנות הבאה */
    }
}
/** שליחת מייל איפוס סיסמה — זורק Error בעברית. */
