/** 🪨 טיוטת-חוט (דרגת-מחצבה) · ayinSheetRows — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:396-442 (47 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): ayinSheetRows
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function ayinSheetRows(supporters) {
    const rows = [[...AYIN_SHEET_HEADER]];
    for (const sp of supporters) {
        const a = sp.ayin;
        if (!a)
            continue;
        const lastAns = a.answers[0];
        const leadDone = ['eyes', 'answer', 'done'].includes(a.stage) ? 'כן' : 'לא';
        for (const n of a.names) {
            rows.push([
                sp.name,
                sp.phone || '',
                n.name,
                n.eyes === '' || n.eyes == null ? '' : String(n.eyes),
                n.done ? 'כן' : 'לא',
                a.paid ? 'כן' : 'לא',
                (lastAns ? lastAns.note : a.answeredNote || '').replace(/,/g, ' '),
                leadDone,
            ]);
        }
    }
    return rows;
}
/**
 * פענוח גיליון שחזר — טהור, בדיוק לפי legacy:852-869: זיהוי עמודות לפי הכלה,
 * התאמת תומכת+שם ב-normName, yes() לפי /כן|yes|✓|v|שולם/i, שורה בלי שום ערך
 * מדולגת, שם שלא נמצא נספר miss. eyes=0 תקין (ספרות בלבד).
 */
