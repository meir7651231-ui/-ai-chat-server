/** 🪨 טיוטת-חוט (דרגת-מחצבה) · readCloudEnvelope — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:458-470 (13 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): readCloudEnvelope, getDoc, requireDb, scopedEnv, exists, data
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function readCloudEnvelope() {
    try {
        const snap = await getDoc(doc(requireDb(), scopedEnv()));
        if (!snap.exists())
            return null;
        const d = snap.data();
        // ולידציה רזה — envelope תקין בלבד; פורמט זר ⇒ מתעלמים (null).
        return d && typeof d === 'object' && d.$enc === 2 ? d : null;
    }
    catch {
        return null;
    }
}
/** כתיבת ה-envelope (הפעלת הצפנה — פעולת-בעלים). לא failure-safe: כשל = זריקה. */
