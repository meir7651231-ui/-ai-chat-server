/** 🪨 טיוטת-חוט (דרגת-מחצבה) · donationSplitActive — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:104-111 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): donationSplitActive
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function donationSplitActive() {
    return splitOn;
}
// מסלול-B P3 — ייעודים מותרים לעובד/ת המחובר/ת: null=בלי-הגבלה (מנהל/בעלים ⇒ קריאה
// לא-מסוננת). מערך ⇒ שאילתת-donations מוגבלת ל-`where pkey in [...allowed, _shared_]`
// כדי ש-Firestore Rules יתירו את ה-list (רשימה לא-מסוננת של עובד-מוגבל נדחית).
let allowedPurposes = null;
