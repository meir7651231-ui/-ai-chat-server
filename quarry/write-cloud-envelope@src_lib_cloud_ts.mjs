/** 🪨 טיוטת-חוט (דרגת-מחצבה) · writeCloudEnvelope — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:471-480 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): writeCloudEnvelope, setDoc, requireDb, scopedEnv, pushDiff, fullDbDiff
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function writeCloudEnvelope(env) {
    await setDoc(doc(requireDb(), scopedEnv()), env);
}
/**
 * מיגרציית-הצפנה חד-פעמית: כותבת מחדש את כל הנתונים (ישויות + meta) מוצפנים,
 * דרך נתיב ה-push הקיים והבדוק (`pushDiff(fullDbDiff(db), dek)` — כל `set` מוצפן
 * ל-{enc,iv}). ‏decryptDoc תואם-לאחור ⇒ מכשיר שקורא באמצע-מיגרציה לא קורס.
 * הבעלים מריץ (כפתור, אחרי גיבוי כפוי) — לא רץ אוטומטית.
 */
