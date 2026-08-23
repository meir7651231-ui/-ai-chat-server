/** 🪨 טיוטת-חוט (דרגת-מחצבה) · fetchOrgRequests — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:178-189 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): fetchOrgRequests, getDocs, collection, cloudDb, data
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function fetchOrgRequests() {
    const snap = await getDocs(collection(cloudDb(), PLATFORM_REQUESTS));
    return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}
/**
 * ניתוב-עצמי בכניסה (ORGADMIN): הסלאגים של ארגוני-הפלטפורמה שבהם המייל חבר.
 * מאפשר ל"כפתור הכניסה" בשורש להכניס את המנהל/העובד ישירות לאתר שלו (?org=slug),
 * בלי קישור נפרד. שאילתה מוגבלת-לעצמי (array-contains המייל) — כלל ה-list ב-Rules
 * מתיר רק מסמכים שבהם המייל ב-members. בלי הכלל (או בלי הרשאה/רשת) ⇒ [] (נפילה
 * בטוחה: המשתמש נשאר במסך-המתנה, כמו קודם — אין רגרסיה).
 */
