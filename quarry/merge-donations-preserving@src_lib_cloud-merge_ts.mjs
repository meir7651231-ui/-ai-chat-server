/** 🪨 טיוטת-חוט (דרגת-מחצבה) · mergeDonationsPreserving — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud-merge.ts:51-72 (22 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): mergeDonationsPreserving, isFinite
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function mergeDonationsPreserving(col, local, incoming) {
    if (col !== 'supporters')
        return incoming;
    const localDon = Array.isArray(local.donations) ? local.donations : [];
    const incDon = Array.isArray(incoming.donations) ? incoming.donations : [];
    const incRids = new Set(incDon.map((d) => d && d.rid).filter(Boolean));
    const localOnly = localDon.filter((d) => d && d.rid && !incRids.has(d.rid));
    const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
    const count = Math.max(num(incoming.count), num(local.count));
    const ils = Math.max(num(incoming.ils), num(local.ils));
    const usd = Math.max(num(incoming.usd), num(local.usd));
    // אם אין תרומה מקומית-בלבד והמונים לא גדלו — אין מה לשמר, הענן כמות-שהוא.
    if (localOnly.length === 0 && count === num(incoming.count) && ils === num(incoming.ils) && usd === num(incoming.usd)) {
        return incoming;
    }
    return { ...incoming, donations: [...incDon, ...localOnly], count, ils, usd };
}
/** מיזוג שינויי אוסף מרוחקים לרשימה מקומית — upsert לפי id, מחוקים יוצאים. */
