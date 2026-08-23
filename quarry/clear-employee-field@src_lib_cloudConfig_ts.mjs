/** 🪨 טיוטת-חוט (דרגת-מחצבה) · clearEmployeeField — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:243-254 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): clearEmployeeField, updateDoc, cloudDb, deleteField
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function clearEmployeeField(slug, email, field) {
    await updateDoc(doc(cloudDb(), PLATFORM_ORGS, slug), new FieldPath('memberConfigs', email, field), deleteField());
}
/**
 * הוספת/הסרת חבר-ארגון **אטומית** (תיקון 21.8, ממצא-נחיל): הדפוס הישן בנה את
 * members המלא מ-state בזיכרון (אולי-ישן) וכתב אותו — כתיבה-מקבילה (מנהל+בעלים,
 * שני מסכים) הייתה מוחקת בשקט עובד/ת שאושרו במקביל (last-writer-wins).
 * arrayUnion/arrayRemove פועלים על הערך העדכני בשרת — אין דריסה.
 * ההוספה במייל מנורמל (כמו approveMember); ההסרה מסירה גם את הצורה הגולמית —
 * רשומות-עבר לא-מנורמלות לא נתקעות.
 */
