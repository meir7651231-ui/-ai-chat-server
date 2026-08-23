/** 🪨 טיוטת-חוט (דרגת-מחצבה) · withNedarimHok — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/nedarimSync.ts:172-235 (64 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): withNedarimHok, curOf, hokDayFromDate, monthsAgo, modeOf, modeStr
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function withNedarimHok(sp, charge) {
    if (!(charge.amount > 0))
        return sp; // זיכוי/ביטול (Amount≤0) לא ממלא/מעדכן הו"ק
    const keva = (charge.kevaId || '').trim();
    if (!keva)
        return sp;
    if (sp.hok && !sp.hok.kevaId)
        return sp; // הו"ק ידני — לא דורסים
    const cd = (charge.d || charge.at || '').slice(0, 10);
    const prevStart = sp.hok?.startedAt || '';
    return {
        ...sp,
        hok: {
            amount: charge.amount,
            cur: curOf(charge),
            day: hokDayFromDate(cd),
            method: 'card',
            note: 'הו״ק נדרים · ' + keva,
            active: true,
            startedAt: prevStart && prevStart < cd ? prevStart : cd || prevStart || '',
            kevaId: keva,
        },
    };
}
/* ── זיהוי-רטרואקטיבי של הו"ק מהיסטוריה (הכרעת-בעלים 19.8) ──
   חיובים שכבר סונכרו לפני מנגנון-ההו"ק יושבים ב-hist בלי סימון. מזהים הו"ק
   מ**תבנית-החיובים**: תורם עם אותו סכום-נדרים בכמה חודשים שונים = הוראת-קבע.
   כשיש kevaId ב-hist (חיובים חדשים) — מדויק; אחרת — לפי סכום+מטבע חוזר. טהור. */
/** מספר-החודשים מ-dateIso עד todayIso (0=אותו חודש). */
function monthsAgo(dateIso, todayIso) {
    const [y1, m1] = dateIso.slice(0, 7).split('-').map(Number);
    const [y2, m2] = todayIso.slice(0, 7).split('-').map(Number);
    if (!y1 || !m1 || !y2 || !m2)
        return 999;
    return (y2 - y1) * 12 + (m2 - m1);
}
/** הערך-השכיח במערך (mode) — ליום-החיוב הטיפוסי. */
function modeOf(nums) {
    const c = new Map();
    let best = nums[0] ?? 1;
    let bestN = 0;
    for (const n of nums) {
        const k = (c.get(n) ?? 0) + 1;
        c.set(n, k);
        if (k > bestN) {
            bestN = k;
            best = n;
        }
    }
    return best;
}
/** המחרוזת-השכיחה (mode) — לסכום|מטבע הטיפוסי של ההו"ק (עמיד לסכום משתנה). */
function modeStr(strs) {
    const c = new Map();
    let best = strs[0] ?? '';
    let bestN = 0;
    for (const s of strs) {
        const k = (c.get(s) ?? 0) + 1;
        c.set(s, k);
        if (k > bestN) {
            bestN = k;
            best = s;
        }
    }
    return best;
}
/** מזהה הוראות-קבע מתבנית-ה-hist וממלא את משבצת-ההו"ק. תורם עם אותו סכום-נדרים
 *  ב-≥`minMonths` חודשים שונים = הו"ק (day=היום-השכיח, active=חויב ב-≤2 חודשים).
 *  הו"ק **ידני** (בלי kevaId) לא נדרס. מחזיר { supporters, detected }. */
