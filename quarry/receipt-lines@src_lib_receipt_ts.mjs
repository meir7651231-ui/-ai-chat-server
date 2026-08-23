/** 🪨 טיוטת-חוט (דרגת-מחצבה) · receiptLines — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/receipt.ts:86-149 (64 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): receiptLines, isNaN, getTime, toLocaleDateString, hebDateFull, amountInWords, receiptVerifyCode, receipt, hebrewLocaleDate
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function receiptLines(o) {
    const cur = o.currency || '₪';
    const d = new Date(o.date.slice(0, 10) + 'T12:00:00');
    const gregorian = isNaN(d.getTime()) ? o.date : d.toLocaleDateString('he-IL');
    const heb = hebDateFull(o.date);
    // קבלת סעיף 46 פורמלית — פריסה רשמית עם סכום-במילים, ת"ז ונוסח §46.
    if (o.taxReceipt) {
        const curSym = cur === '$' ? '$' : '₪';
        const words = amountInWords(o.amount, cur === '$' ? '$' : '₪');
        return [
            ...(o.mark === false ? [] : [o.copy ? 'העתק נאמן למקור' : 'מקור']),
            (o.orgName || 'מאור החסד'),
            o.orgTaxId ? 'מס׳ עמותה/מלכ"ר: ' + o.orgTaxId : '',
            '',
            'קבלה על תרומה — לפי סעיף 46 לפקודת מס הכנסה',
            'קבלה מס׳: ' + o.rid,
            ...(o.verify ? ['קוד-אימות: ' + receiptVerifyCode(o.rid, o.amount, cur, o.date)] : []),
            'תאריך: ' + (heb ? heb + ' · ' : '') + gregorian,
            '',
            'התקבל בתודה מאת: ' + o.payer,
            o.payerId ? 'ת"ז / ח"פ: ' + o.payerId : '',
            'סכום: ' + curSym + o.amount.toLocaleString('he-IL'),
            'במילים: ' + words,
            o.method ? 'אמצעי תשלום: ' + o.method : '',
            'עבור: ' + o.forWhat,
            '',
            'תרומה זו מוכרת לצורכי מס לפי סעיף 46 לפקודת מס הכנסה.',
            'קבלה זו מהווה אסמכתא לתרומה שהתקבלה.',
            '',
            'בכבוד רב,',
            (o.signatory ? o.signatory : '') + '  ______________________',
            'חתימה וחותמת',
            o.site ? 'אתר: ' + o.site : '',
        ];
    }
    // תיקון (swarm-audit): סדרת S- (אישורי-תשלום של החנות — shopReceiptSeq, לא קבלת
    // מס) הוצגה בכותרת "קבלה" — מצג-שווא כשההסתייגות קבורה באמצע המסמך. S- מקבל
    // "אישור תשלום"; כל rid אחר (כולל R-/D- מסחריים בלי §46) נשאר ביט-זהה.
    const isShopConfirmation = o.rid.startsWith('S-');
    return [
        ...(o.mark === false ? [] : [o.copy ? 'העתק נאמן למקור' : 'מקור']),
        (isShopConfirmation ? 'אישור תשלום — ' : 'קבלה — ') + (o.orgName || 'מאור החסד'),
        (isShopConfirmation ? 'אישור מס׳: ' : 'קבלה מס׳: ') + o.rid,
        ...(o.verify ? ['קוד-אימות: ' + receiptVerifyCode(o.rid, o.amount, cur, o.date)] : []),
        // תאריך עברי + לועזי, כמו באב-טיפוס
        'תאריך: ' + (heb ? heb + ' · ' : '') + gregorian,
        'התקבל מאת: ' + o.payer,
        'סכום: ' + cur + o.amount,
        o.method ? 'אמצעי תשלום: ' + o.method : '',
        'עבור: ' + o.forWhat,
        // סיכום העסקה — verbatim מלגאסי receipt() (legacy:1264-1265)
        o.summary
            ? 'סה"כ עסקה: ₪' + o.summary.totalDue + ' · שולם עד כה: ₪' + o.summary.paidSoFar + ' · יתרה: ₪' + o.summary.balance
            : '',
        o.summary?.nextDate
            ? 'תשלום הבא: ' + hebDateFull(o.summary.nextDate) + ' · ' + hebrewLocaleDate(o.summary.nextDate)
            : '',
        o.site ? 'אתר: ' + o.site : '',
        'תודה על תמיכתכם',
    ];
}
