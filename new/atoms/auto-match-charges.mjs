/** חוט · auto-match-charges — שיוך אוטומטי של חיובי-סנכרון לתומכים.
 *  חוזה: auto-match-charges.contract.md · שקע: keysOf
 *  חולץ כלשונו מ-maor/src/lib/nedarimSync.ts:427-448 (קריאת-השכן שוקעה). */
export function autoMatchCharges(charges, supporters, keysOf) {
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
