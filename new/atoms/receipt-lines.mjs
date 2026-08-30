/** חוט · receipt-lines — שורות-הקבלה (‏§46 / רגילה / אישור-חנות S-).
 *  חוזה: receipt-lines.contract.md · שקעים: hebDateFull, amountInWords,
 *  receiptVerifyCode, hebrewLocaleDate.
 *  חולץ כלשונו מ-maor/src/lib/receipt.ts:86-149 (קריאות-השכן שוקעו). */
export function receiptLines(o, hebDateFull, amountInWords, receiptVerifyCode, hebrewLocaleDate, T) {
  const cur = o.currency || '₪';
  const d = new Date(o.date.slice(0, T.k29) + 'T12:00:00');
  const gregorian = isNaN(d.getTime()) ? o.date : d.toLocaleDateString('he-IL');
  const heb = hebDateFull(o.date);
  // קבלת סעיף 46 פורמלית — פריסה רשמית עם סכום-במילים, ת"ז ונוסח §46.
  if (o.taxReceipt) {
    const curSym = cur === '$' ? '$' : '₪';
    const words = amountInWords(o.amount, cur === '$' ? '$' : '₪');
    return [
      ...(o.mark === false ? [] : [o.copy ? T.k1 : T.k2]),
      (o.orgName || T.k3),
      o.orgTaxId ? T.k4 + o.orgTaxId : '',
      '',
      T.k5,
      T.k6 + o.rid,
      ...(o.verify ? [T.k7 + receiptVerifyCode(o.rid, o.amount, cur, o.date)] : []),
      T.k8 + (heb ? heb + ' · ' : '') + gregorian,
      '',
      T.k9 + o.payer,
      o.payerId ? T.k10 + o.payerId : '',
      T.k11 + curSym + o.amount.toLocaleString('he-IL'),
      T.k12 + words,
      o.method ? T.k13 + o.method : '',
      T.k14 + o.forWhat,
      '',
      T.k15,
      T.k16,
      '',
      T.k17,
      (o.signatory ? o.signatory : '') + '  ______________________',
      T.k18,
      o.site ? T.k19 + o.site : '',
    ];
  }
  // תיקון (swarm-audit): סדרת S- (אישורי-תשלום של החנות — shopReceiptSeq, לא קבלת
  // מס) הוצגה בכותרת "קבלה" — מצג-שווא כשההסתייגות קבורה באמצע המסמך. S- מקבל
  // "אישור תשלום"; כל rid אחר (כולל R-/D- מסחריים בלי §46) נשאר ביט-זהה.
  const isShopConfirmation = o.rid.startsWith('S-');
  return [
    ...(o.mark === false ? [] : [o.copy ? T.k1 : T.k2]),
    (isShopConfirmation ? T.k20 : T.k21) + (o.orgName || T.k3),
    (isShopConfirmation ? T.k22 : T.k6) + o.rid,
    ...(o.verify ? [T.k7 + receiptVerifyCode(o.rid, o.amount, cur, o.date)] : []),
    // תאריך עברי + לועזי, כמו באב-טיפוס
    T.k8 + (heb ? heb + ' · ' : '') + gregorian,
    T.k23 + o.payer,
    T.k11 + cur + o.amount,
    o.method ? T.k13 + o.method : '',
    T.k14 + o.forWhat,
    // סיכום העסקה — verbatim מלגאסי receipt() (legacy:1264-1265)
    o.summary
      ? T.k24 + o.summary.totalDue + T.k25 + o.summary.paidSoFar + T.k26 + o.summary.balance
      : '',
    o.summary?.nextDate
      ? T.k27 + hebDateFull(o.summary.nextDate) + ' · ' + hebrewLocaleDate(o.summary.nextDate)
      : '',
    o.site ? T.k19 + o.site : '',
    T.k28,
  ];
}
