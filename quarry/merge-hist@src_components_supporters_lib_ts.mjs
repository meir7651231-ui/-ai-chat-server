/** 🪨 טיוטת-חוט (דרגת-מחצבה) · mergeHist — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:557-597 (41 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): mergeHist
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function mergeHist(existing, incoming) {
    const key = (h) => h.d + '|' + h.a + '|' + (h.c ?? '₪');
    // אינדקס-נכנס פר-מפתח (בסדר) — משמש גם ל**העשרת** רשומות קיימות וגם לספירה.
    const incByKey = new Map();
    for (const h of incoming) {
        const arr = incByKey.get(key(h));
        if (arr)
            arr.push(h);
        else
            incByKey.set(key(h), [h]);
    }
    // העשרה (13.8b): רשומה קיימת שיובאה **לפני** שדות-המטא-דאטה (בלי txn/מותג/…)
    // מתמלאת מהשורה-הנכנסת התואמת — הערך הקיים גובר, הנכנס ממלא רק חוסרים. כך
    // ייבוא-חוזר של אותו קובץ *משדרג* עסקאות ותיקות בלי לשכפל אותן.
    const usedInc = new Map();
    const out = existing.map((h) => {
        const k = key(h);
        const arr = incByKey.get(k);
        const idx = usedInc.get(k) ?? 0;
        if (arr && idx < arr.length) {
            usedInc.set(k, idx + 1);
            return { ...arr[idx], ...h }; // נכנס ממלא חוסרים; קיים גובר על חפיפה
        }
        return { ...h };
    });
    // דחיפת מופעים-נכנסים מעבר לכמות-הקיימת (עסקאות חדשות באמת) — עם כל שדותיהן.
    const haveCount = new Map();
    for (const h of existing)
        haveCount.set(key(h), (haveCount.get(key(h)) ?? 0) + 1);
    const seen = new Map();
    for (const h of incoming) {
        const k = key(h);
        const n = (seen.get(k) ?? 0) + 1;
        seen.set(k, n);
        if (n > (haveCount.get(k) ?? 0))
            out.push({ ...h });
    }
    return out.sort((x, y) => x.d.localeCompare(y.d));
}
/**
 * תכנון ייבוא — הצלבה לפי שם מנורמל: שם קיים ⇒ עדכון, שם חדש ⇒ הוספה.
 * כפילויות בתוך הקובץ מתמזגות לרשומה אחת (הראשונה גוברת, השאר ממלאות חוסרים).
 * טהור — לא נוגע ב-store; שורות ללא שם מדולגות.
 */
