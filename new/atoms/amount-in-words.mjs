/** חוט · amount-in-words — קודם אוטומטית (אפיון-Golden). חוזה: amount-in-words.contract.md */
export function amountInWords(amount, currency = '₪') {
    if (!Number.isFinite(amount) || amount < 0)
        return String(amount);
    const shekelWord = currency === '$' ? { one: 'דולר אחד', many: 'דולרים', agName: 'סנט' } : { one: 'שקל אחד', many: 'שקלים', agName: 'אגורות' };
    let whole = Math.floor(amount);
    let agorot = Math.round((amount - whole) * 100);
    // 🐛 נחיל-9×9 (13.8): גלישת-עיגול — שבר ≥.995 עיגל אגורות ל-100 ("6 ומאה אגורות").
    // נשיאה לשקל השלם (5.995 ⇒ "שישה שקלים", לא "חמישה שקלים ומאה אגורות").
    if (agorot === 100) {
        whole += 1;
        agorot = 0;
    }
    const wholeWords = integerInWords(whole);
    if (wholeWords === null) {
        // fallback בטוח לספרות
        return currency + amount.toLocaleString('he-IL');
    }
    let s;
    if (whole === 1)
        s = shekelWord.one;
    else if (whole === 0)
        s = 'אפס ' + shekelWord.many;
    // 🐛 נחיל-עמוק (13.8): 2 בצורת-נפרד ("שניים") שגוי לפני שם-עצם — הצורה התקנית
    // היא סמיכות "שני שקלים"/"שני דולרים" (הכרעת-בעלים "לתקן ל'שני שקלים'").
    else if (whole === 2)
        s = 'שני ' + shekelWord.many;
    else
        s = wholeWords + ' ' + shekelWord.many;
    if (agorot > 0) {
        if (currency === '₪') {
            // אגורה נקבה — מספר בצורת-נקבה + יחיד/סמיכות ("שתי אגורות").
            s += ' ו-' + agorotPhrase(agorot);
        }
        else {
            // סנט זכר — צורת-הזכר של integerInWords מתאימה.
            const agWords = integerInWords(agorot);
            s += ' ו-' + (agWords ?? agorot) + ' ' + shekelWord.agName;
        }
    }
    return s;
}
