/** 🪨 טיוטת-חוט (דרגת-מחצבה) · candidateSupportersForCharge — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/nedarimSync.ts:279-302 (24 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): candidateSupportersForCharge, keysOf, nameSortKey
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function candidateSupportersForCharge(charge, supporters, limit = 8) {
    const ck = new Set(keysOf({ extId: charge.toremId, zeout: charge.zeout, phone: charge.phone, email: charge.email }));
    const cName = nameSortKey(charge.name || '');
    const scored = [];
    for (const sp of supporters) {
        const sk = keysOf({ extId: sp.extId, idNum: sp.idNum, phone: sp.phone, email: sp.email });
        let score = 0;
        for (const k of sk) {
            if (!ck.has(k))
                continue;
            if (k.startsWith('ext:'))
                score = Math.max(score, 5);
            else if (k.startsWith('id:'))
                score = Math.max(score, 4);
            else if (k.startsWith('ph:'))
                score = Math.max(score, 3);
            else if (k.startsWith('em:'))
                score = Math.max(score, 2);
        }
        if (!score && cName && cName.includes(' ') && nameSortKey(sp.name) === cName)
            score = 1;
        if (score)
            scored.push({ sp, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((x) => x.sp);
}
/** 🧲 מילוי-אם-ריק (23.8, בקשת-הבעלים "שם יכנס לשם, טלפון לטלפון, הכל במקום"):
 *  פרטי-הקשר שהעסקה נושאת נכנסים לשדות-הכרטיס **הריקים** — לעולם לא דורסים
 *  ערך קיים (הכרטיס = מקור-האמת; העסקה רק משלימה חוסרים). */
