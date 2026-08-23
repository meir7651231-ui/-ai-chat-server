/** 🪨 טיוטת-חוט (דרגת-מחצבה) · allowedDesignationsFor — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/platform/lib.ts:226-238 (13 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): allowedDesignationsFor, isOrgManager, overrideOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function allowedDesignationsFor(email, org) {
    if (isOrgManager(email, org))
        return null;
    const d = overrideOf(email, org).designations;
    return d && d.length ? d : null;
}
/**
 * מי מנפיק קבלות-§46 (הכרעת-בעלים 14.8: "רק המנהל מפיק קבלות") — טהור.
 * מקצה-יחיד למספרי-הקבלה: מונע מרוץ דו-מכשירי על donationSeq (רצף קבלות-המס),
 * וגם כלל-עסקי — קבלת-מס רשמית = סמכות-מנהל. מותר: מייל-על · מנהל-ארגון ·
 * לקוח-שורש (הבעלים הקיים) · עבודה-מקומית-בלי-ענן. חסום: עובד/ת בארגון-פלטפורמה
 * שאינו/ה מנהל/ת. חוזה-הבטיחות: ברירת-מחדל מתירה (לקוח לא-מחובר/שורש) — לא שוברת אף לקוח קיים.
 */
