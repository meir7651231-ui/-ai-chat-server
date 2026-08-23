/** 🪨 טיוטת-חוט (דרגת-מחצבה) · guideRecipes — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/guide.ts:121-135 (15 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): guideRecipes, termOf, swap
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function guideRecipes(config) {
    const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
    let r = GUIDE_RECIPES;
    r = swap(r, 'ליד השיבוץ', 'ליד ה' + T('entity.enrollment', 'שיבוץ'));
    r = swap(r, 'כדי שיבוץ', 'כדי ' + T('entity.enrollment', 'שיבוץ'));
    r = swap(r, 'משפחה חדשה', T('entity.family', 'משפחה') + ' חדשה');
    r = swap(r, 'חוג מתאים', T('entity.course', 'חוג') + ' מתאים');
    r = swap(r, 'מצא חוג', 'מצא ' + T('entity.course', 'חוג'));
    r = swap(r, 'החוג', 'ה' + T('entity.course', 'חוג'));
    r = swap(r, 'למורה', 'ל' + T('entity.teacher', 'מורה'));
    r = swap(r, '← ＋ תרומה', '← ＋ ' + T('entity.donation', 'תרומה'));
    r = swap(r, 'תרומה ←', T('entity.donation', 'תרומה') + ' ←');
    return r;
}
