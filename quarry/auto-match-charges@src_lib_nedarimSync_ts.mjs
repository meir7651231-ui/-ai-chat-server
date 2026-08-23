/** 🪨 טיוטת-חוט (דרגת-מחצבה) · autoMatchCharges — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/nedarimSync.ts:427-448 (22 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): autoMatchCharges, keysOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function autoMatchCharges(charges, supporters) {
    const idx = new Map(); // מפתח → supId (ראשון גובר)
    for (const sp of supporters) {
        for (const k of keysOf({ extId: sp.extId, idNum: sp.idNum, phone: sp.phone, email: sp.email })) {
            if (!idx.has(k))
                idx.set(k, sp.id);
        }
    }
    const out = [];
    for (const c of charges) {
        let supId;
        // סדר keysOf: ext → id → ph → em ⇒ הראשון-שנמצא = המפתח-החזק-ביותר.
        for (const k of keysOf({ extId: c.toremId, zeout: c.zeout, phone: c.phone, email: c.email })) {
            const hit = idx.get(k);
            if (hit) {
                supId = hit;
                break;
            }
        }
        if (supId)
            out.push({ supId, charge: c });
    }
    return out;
}
/** שיוך-אצווה: מחבר רשימת {supId, charge} בבת-אחת (setDb יחיד). דדופ-txn פר-כרטיס
 *  (כולל בתוך האצווה עצמה). מחזיר { supporters, added } — added=מספר החיובים שנוספו. */
