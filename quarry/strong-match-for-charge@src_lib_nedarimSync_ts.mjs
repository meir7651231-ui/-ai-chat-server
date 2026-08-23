/** 🪨 טיוטת-חוט (דרגת-מחצבה) · strongMatchForCharge — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/nedarimSync.ts:405-426 (22 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): strongMatchForCharge, keysOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function strongMatchForCharge(charge, supporters) {
    const ck = new Set(keysOf({ extId: charge.toremId, zeout: charge.zeout, phone: charge.phone, email: charge.email }));
    if (!ck.size)
        return null;
    let best = null;
    for (const sp of supporters) {
        let score = 0;
        for (const k of keysOf({ extId: sp.extId, idNum: sp.idNum, phone: sp.phone, email: sp.email })) {
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
        if (score && (!best || score > best.score))
            best = { sp, score };
    }
    return best?.sp ?? null;
}
/** שיוך-אוטומטי **מרובה ויעיל** על כל הממתינים: בונה אינדקס-מפתחות פעם-אחת
 *  (O(S)), ואז לכל עסקה מחזיר את הכרטיס עם המפתח-החזק-ביותר התואם (O(M)). כך
 *  אפשר לרוקן ערימה של אלפי-ממתינים בבת-אחת (לא רק 300 המוצגים). שם-בלבד לא
 *  נכלל (דורש שיוך-ידני, מונע התאמת-שווא). מחזיר {supId, charge} למחוברים. */
