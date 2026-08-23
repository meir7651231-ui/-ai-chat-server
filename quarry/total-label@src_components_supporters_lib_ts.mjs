/** 🪨 טיוטת-חוט (דרגת-מחצבה) · totalLabel — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:235-260 (26 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): totalLabel, supIls, supUsd
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function totalLabel(sp) {
    const i = supIls(sp);
    const u = supUsd(sp);
    const ils = i ? '₪' + i.toLocaleString('he-IL') : '';
    const usd = u ? '$' + u.toLocaleString('he-IL') : '';
    return ils && usd ? ils + ' + ' + usd : ils || usd || '—';
}
/**
 * מיזוג התרומות לתצוגה — verbatim מהלגאסי (legacy-main-script.js:1486-1495,
 * supDonEvents): donations עם 'קבלה <rid>' + hist עם 'מהקובץ ההיסטורי';
 * כשאין hist — שורות first/last (סכום 0) כ"תרומה ראשונה/אחרונה (מהקובץ)",
 * רק אם תאריכן לא מופיע כבר. ממוין מהחדש לישן.
 */
