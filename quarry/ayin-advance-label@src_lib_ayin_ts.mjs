/** 🪨 טיוטת-חוט (דרגת-מחצבה) · ayinAdvanceLabel — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:154-174 (21 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): ayinAdvanceLabel, stageLabel
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function ayinAdvanceLabel(cfg, a) {
    const st = a.stage;
    if (st === 'new')
        return stageLabel(cfg, 'lead') + ' ←';
    if (st === 'lead')
        return '✓ אישור — ' + stageLabel(cfg, 'lead');
    if (st === 'eyes')
        return stageLabel(cfg, 'answer') + ' ←';
    if (st === 'answer')
        return a.answerPushed ? '✓ ' + stageLabel(cfg, 'done') : '📞 דחיפה ללוח';
    return '';
}
/**
 * תכנון פעולת הכפתור-החכם — טהור (לא נוגע ב-store/לוח). מחזיר null אם הכפתור
 * לא אמור לפעול בשלב הנוכחי. ה-store מיישם את ה-patch ויוצר את אירוע הלוח.
 */
