/** 🪨 טיוטת-חוט (דרגת-מחצבה) · pushDonations — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:175-200 (26 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): pushDonations, requireDb, encryptDoc, scopedDonations, writeBatch, commit
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function pushDonations(diff, dek) {
    const db = requireDb();
    const ops = [];
    for (const d of diff.sets) {
        // pkey נשמר plaintext (מחוץ למעטפה) כדי ש-where-pkey-in + Rules יעבדו גם בארגון-מוצפן.
        const payload = { supporterId: d.supporterId, ...d.donation };
        const body = dek ? { pkey: d.pkey, ...(await encryptDoc(payload, dek)) } : { pkey: d.pkey, ...payload };
        ops.push((b) => b.set(doc(db, scopedDonations(), d.id), body));
    }
    for (const id of diff.deletes) {
        ops.push((b) => b.delete(doc(db, scopedDonations(), id)));
    }
    for (let i = 0; i < ops.length; i += 400) {
        const batch = writeBatch(db);
        for (const op of ops.slice(i, i + 400))
            op(batch);
        await batch.commit();
    }
}
/**
 * מסלול-B פאזה-4 — מיגרציית-פיצול חד-פעמית (חלון-בעלים): מפרקת את **כל** תרומות
 * התומכים לאוסף-התרומות-הנפרד (upsert לפי rid). **אינה נוגעת ב-donationSeq** ולא
 * מוחקת את התרומות המקוננות (הפיך: כיבוי-הדגל ⇒ הנתונים המקוננים עדיין שם).
 * אידמפוטנטית — הרצה חוזרת כותבת את אותם מסמכים. מריצים לפני הדלקת donationSplit.
 * מחזירה את מספר התרומות שהוגרו.
 */
