/** 🪨 טיוטת-חוט (דרגת-מחצבה) · colPath — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud-diff.ts:45-49 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): colPath
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function colPath(slug, cloudRoot, col) {
    return cloudRoot ? col : 'orgs/' + slug + '/' + col;
}
/** נתיב מסמך ה-meta: ‏cloudRoot ⇒ ‏meta/org (כמו היום); אחרת ⇒ orgs/{slug}/meta/org. */
