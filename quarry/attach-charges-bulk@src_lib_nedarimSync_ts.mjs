/** 🪨 טיוטת-חוט (דרגת-מחצבה) · attachChargesBulk — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/nedarimSync.ts:449-540 (92 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): attachChargesBulk, histDedupKey, chargeDedupKey, withNedarimHok, fillCardFromCharge, chargeToHist, supFromDonor, normId, supFromCharge, nameSortKey
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function attachChargesBulk(supporters, items) {
    const byId = new Map(supporters.map((s, i) => [s.id, i]));
    const next = supporters.slice();
    // 🐛 נחיל-סולה C2 (HIGH): דדופ **גלובלי** — מפתח שכבר יושב על כרטיס כלשהו
    // (או שנוסף במהלך האצווה) לא נרשם שוב בשום כרטיס אחר.
    const globalKeys = new Set();
    for (const s of supporters)
        for (const h of s.hist ?? []) {
            const k = histDedupKey(h);
            if (k)
                globalKeys.add(k);
        }
    let added = 0;
    for (const { supId, charge } of items) {
        const idx = byId.get(supId);
        if (idx == null)
            continue;
        if (!charge.amount)
            continue; // 🐛 C10: ביטול (amount=0) אינו כסף
        const key = chargeDedupKey(charge);
        if (key && globalKeys.has(key))
            continue;
        if (key)
            globalKeys.add(key);
        next[idx] = withNedarimHok(fillCardFromCharge({ ...next[idx], hist: [...(next[idx].hist || []), chargeToHist(charge)] }, charge), charge);
        added++;
    }
    return { supporters: next, added };
}
/** כרטיס-תומך חדש מרשומת-תורם נדרים (מזהה דטרמיניסטי לאידמפוטנטיות). */
function supFromDonor(d) {
    const phone = (d.phone || d.phone2 || d.phone3 || '').trim();
    const extraPhones = [d.phone2, d.phone3].map((p) => (p || '').trim()).filter((p) => p && p !== phone);
    const notes = [d.notes, extraPhones.length ? 'טל׳ נוספים: ' + extraPhones.join(', ') : '']
        .map((s) => (s || '').trim())
        .filter(Boolean)
        .join(' · ');
    return {
        id: 'sup-ned-' + d.toremId,
        name: d.name.trim(),
        phone,
        email: (d.email || '').trim(),
        address: (d.address || '').trim(),
        city: '',
        idNum: normId(d.zeout) ? String(d.zeout).replace(/\D/g, '') : '',
        extId: d.toremId,
        cat: '',
        forWho: '',
        notes,
        count: 0,
        ils: 0,
        usd: 0,
        first: '',
        last: '',
        nextDate: '',
        donations: [],
    };
}
/** כרטיס-תומך חדש מעסקה (כשאין תורם/כרטיס תואם) — אפס-אובדן-חיוב.
 *  עסקה **חסרת-שם וחסרת-מזהה** מנותבת לכרטיס-אוסף יחיד ('sup-ned-unassigned')
 *  במקום כרטיס-לכל-עסקה (מונע ריבוי-כרטיסי-'תורם נדרים' ב-CRM). כולם אנונימיים
 *  ⇒ איגום בטוח (לא ממזג אנשים מזוהים). */
function supFromCharge(c, seq) {
    const anon = !c.toremId && !nameSortKey(c.name || '');
    const id = c.toremId
        ? 'sup-ned-' + c.toremId
        : anon
            ? 'sup-ned-unassigned'
            : 'sup-ned-txn-' + (c.txnId || String(seq));
    return {
        id,
        name: (c.name || (anon ? 'תרומות נדרים ללא שיוך' : 'תורם נדרים')).trim(),
        phone: (c.phone || '').trim(),
        email: (c.email || '').trim(),
        address: '',
        city: '',
        idNum: normId(c.zeout) ? String(c.zeout).replace(/\D/g, '') : '',
        ...(c.toremId ? { extId: c.toremId } : {}),
        cat: (c.category || '').trim(),
        forWho: '',
        notes: '',
        count: 0,
        ils: 0,
        usd: 0,
        first: '',
        last: '',
        nextDate: '',
        donations: [],
    };
}
/**
 * מייצר תוכנית-סנכרון. טהור — לא משנה קלט (מחזיר מערך-תומכים חדש).
 * @param existing תומכים קיימים במאור
 * @param donors רשימת-התורמים מנדרים
 * @param charges העסקאות מנדרים (incomingPayments)
 * @param opts attachOnly=true (החיבור-החי): עסקה שאין-לה כרטיס-תואם **לא** יוצרת
 *   כרטיס (נשארת ל-🔄 הידני עם תצוגה-מקדימה) — מונע ריבוי כרטיסים-אוטומטיים.
 */
