/** 🪨 טיוטת-חוט (דרגת-מחצבה) · deleteOrgJoinRequest — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:223-232 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): deleteOrgJoinRequest, deleteDoc, cloudDb, deleteField
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function deleteOrgJoinRequest(slug, uid) {
    await deleteDoc(doc(cloudDb(), PLATFORM_ORGS, slug, 'joinRequests', uid));
}
/**
 * מחיקת כרטיס-העובד של מייל מהענן. ‏writeOrgCloudDoc משתמש ב-merge:true שממזג-עומק
 * מפות ⇒ השמטת מפתח *לא מוחקת* אותו (הכרטיס והמייל היו נשארים לנצח, וחוזרים באישור-מחדש).
 * FieldPath('memberConfigs', email) + deleteField() מוחק את המפתח הנקודתי בבטחה (המייל
 * מכיל נקודות — FieldPath מטפל בהן, לא נתיב-נקודה). ‏updateDoc — המסמך תמיד קיים כאן.
 */
