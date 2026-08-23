/** 🪨 טיוטת-חוט (דרגת-מחצבה) · removeOrgMember — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:259-271 (13 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): removeOrgMember, updateDoc, cloudDb, arrayRemove
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function removeOrgMember(slug, email) {
    const variants = [...new Set([email.trim(), email.trim().toLowerCase()])];
    await updateDoc(doc(cloudDb(), PLATFORM_ORGS, slug), { members: arrayRemove(...variants) });
}
/**
 * 🗑 מחיקת-לקוח מלאה (5.8.2026 — "איך אני מוחק לקוחות"): ב-Firestore מחיקת
 * מסמך **לא** מוחקת תתי-אוספים — לכן מוחקים מסודר: כל אוספי-הנתונים של הארגון
 * (‏ENTITY_COLLECTIONS + התורים + meta + envelope), בקשות-ההצטרפות, ולבסוף
 * מסמך-הארגון עצמו. מייל-על בלבד (Rules). חשבונות-Auth נמחקים בקונסולה —
 * ל-SDK-הדפדפן אין הרשאת-מחיקת-משתמשים.
 * מחזירה את מספר-המסמכים שנמחקו (לחיווי-בעלים).
 */
