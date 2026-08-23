/** 🪨 טיוטת-חוט (דרגת-מחצבה) · findDuplicateGroups — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/dedup.ts:42-108 (67 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): findDuplicateGroups, phonesOf, union, nameCityKey
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function findDuplicateGroups(families) {
    const parent = new Map();
    const find = (x) => {
        let r = x;
        while (parent.get(r) !== r)
            r = parent.get(r);
        // דחיסת-נתיב
        let c = x;
        while (parent.get(c) !== r) {
            const nx = parent.get(c);
            parent.set(c, r);
            c = nx;
        }
        return r;
    };
    const union = (a, b) => {
        const ra = find(a);
        const rb = find(b);
        if (ra !== rb)
            parent.set(ra, rb);
    };
    for (const f of families)
        parent.set(f.id, f.id);
    const byPhone = new Map();
    const byNameCity = new Map();
    for (const f of families) {
        for (const p of phonesOf(f)) {
            const prev = byPhone.get(p);
            if (prev)
                union(prev, f.id);
            else
                byPhone.set(p, f.id);
        }
        const nk = nameCityKey(f);
        if (nk) {
            const prev = byNameCity.get(nk);
            if (prev)
                union(prev, f.id);
            else
                byNameCity.set(nk, f.id);
        }
    }
    const groups = new Map();
    for (const f of families) {
        const r = find(f.id);
        (groups.get(r) ?? groups.set(r, []).get(r)).push(f.id);
    }
    return [...groups.values()].filter((g) => g.length >= 2);
}
/** דה-דופ לפי מזהה — שומר את המופע הראשון. */
function dedupById(items) {
    const seen = new Set();
    const out = [];
    for (const it of items) {
        if (seen.has(it.id))
            continue;
        seen.add(it.id);
        out.push(it);
    }
    return out;
}
/**
 * מיזוג משפחות אל "שומר" (keeper). ה-losers נספגים לתוכו:
 * - שדות טקסט ריקים בשומר מתמלאים מהערך הראשון הלא-ריק ב-losers.
 * - טלפון נוסף (phone2) מתמלא אם ריק, מטלפון שונה מהראשי.
 * - מוני ילדים = המקסימום; ספח מלא = OR; סטטוס = הגבוה ביותר (active>pending>inactive).
 * - בני-משפחה ומסמכים מאוחדים (דה-דופ לפי מזהה) — אפס אובדן נתונים.
 * - createdAt = המוקדם ביותר. הערות מאוחדות עם סמן "| מוזג:".
 * - cred נשמר כפי שהוא בשומר (לא ממציאים חשבון ניקוד).
 * טהור: מחזיר Family חדש, לא משנה קלט.
 */
