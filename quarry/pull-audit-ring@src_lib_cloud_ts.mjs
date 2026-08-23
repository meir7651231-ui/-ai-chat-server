/** 🪨 טיוטת-חוט (דרגת-מחצבה) · pullAuditRing — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:158-174 (17 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): pullAuditRing, requireDb, getDocs, collection, scopedCol, decryptDoc, data
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function pullAuditRing(dek) {
    if (!auditReadable)
        return null;
    const db = requireDb();
    const snap = await getDocs(collection(db, scopedCol('auditlog')));
    const all = [];
    for (const d of snap.docs) {
        const data = (dek ? await decryptDoc(d.data(), dek) : d.data());
        if (Array.isArray(data.entries))
            all.push(...data.entries);
    }
    all.sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0));
    return all.slice(-AUDIT_CAP);
}
/**
 * מסלול-B — דחיפת אופרציות אוסף-התרומות (set/delete batched, ‏≤400). גוף-המסמך =
 * ‏{supporterId, pkey, ...donation}; ‏id=rid. מוצפן אם dek (כמו שאר האוספים).
 */
