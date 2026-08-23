/** 🪨 טיוטת-חוט (דרגת-מחצבה) · findSupporterDupGroups — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/dedup.ts:286-341 (56 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): findSupporterDupGroups, union, normPhone, link, normId, supNameCityKey, nameSortKey
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function findSupporterDupGroups(supporters) {
    const parent = new Map();
    const find = (x) => {
        let r = x;
        while (parent.get(r) !== r)
            r = parent.get(r);
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
    for (const sp of supporters)
        parent.set(sp.id, sp.id);
    const byPhone = new Map();
    const byEmail = new Map();
    const byId = new Map(); // ת"ז
    const byExt = new Map(); // מזהה-חיצוני (ToremId)
    const byNameCity = new Map();
    const byNameSorted = new Map(); // שם חסין-סדר (בלי חובת-עיר)
    const link = (map, key, id) => {
        if (!key)
            return;
        const prev = map.get(key);
        if (prev)
            union(prev, id);
        else
            map.set(key, id);
    };
    for (const sp of supporters) {
        const p = normPhone(sp.phone);
        link(byPhone, p.length >= 7 ? p : '', sp.id);
        link(byEmail, (sp.email || '').trim().toLowerCase(), sp.id);
        link(byId, normId(sp.idNum), sp.id);
        link(byExt, (sp.extId || '').trim(), sp.id);
        link(byNameCity, supNameCityKey(sp), sp.id);
        // מפתח-שם חסין-סדר: תופס כפילות נדרים ("בן צבי רחל"↔"רחל בן צבי") שאין לה עיר/ת"ז.
        // דורש ≥2 מילים (שם-מלא) כדי לא לקבץ שמות-בודדים נפוצים. תוצאה = הצעה לסקירה-ידנית.
        const ns = nameSortKey(sp.name);
        link(byNameSorted, ns.includes(' ') ? ns : '', sp.id);
    }
    const groups = new Map();
    for (const sp of supporters) {
        const r = find(sp.id);
        (groups.get(r) ?? groups.set(r, []).get(r)).push(sp.id);
    }
    return [...groups.values()].filter((g) => g.length >= 2);
}
/**
 * מיזוג טהור: כל הכסף (donations+hist, ה-rid נשמר) עובר ל"שומר", הצבירה
 * מחושבת מחדש מהתרומות הממוזגות; שדות-קשר — של השומר, ריק ⇒ של הנמחק;
 * הערות מובחנות מאוחדות; hok/ayin — של השומר אם יש, אחרת של הנמחק.
 */
