/** 🪨 טיוטת-חוט (דרגת-מחצבה) · deleteOrgMemberConfig — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:233-242 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): deleteOrgMemberConfig, updateDoc, cloudDb, deleteField, setDoc
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function deleteOrgMemberConfig(slug, email) {
    await updateDoc(doc(cloudDb(), PLATFORM_ORGS, slug), new FieldPath('memberConfigs', email), deleteField());
}
/**
 * מחיקת שדה-יחיד מכרטיס-העובד (תיקון 21.8, ממצא-נחיל): setDoc(merge:true) ממזג-עומק
 * מפות ⇒ `delete next.weeklyGoal` ואז כתיבה **לא מוחקת** את השדה בענן — יעד 40 היה
 * חוזר לנצח אחרי שהמנהל איפס ל-0. אותו דפוס כמו deleteOrgMemberConfig:
 * FieldPath('memberConfigs', email, field) + deleteField() (המייל מכיל נקודות — FieldPath מטפל).
 */
