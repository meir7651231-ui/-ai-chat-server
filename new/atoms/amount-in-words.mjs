/** חוט · amount-in-words — קודם אוטומטית (אפיון-Golden). חוזה: amount-in-words.contract.md
 * שכנים טהורים (integerInWords · agorotPhrase + עוזריהם) הוטמעו כמודול-מקומי (חוק-1, כמו HEX2)
 * מהמקור maor/src/lib/hebrewNumber.ts — התנהגות זהה-ביט. אינם מיוצאים: פנימיים לאטום. */


/** מילות המספר 1..999 כמערך (בלי ו׳ חיברת — מתווספת בסוף). */

/** מילות האלפים (מספר האלפים 1..999) — סמיכות ל-3..10, אחרת מספר + "אלף/אלפים". */

/** מילות אגורות 1..99 בצורת-נקבה (סמיכות עשרות+יחידות; היחידה במין נקבה). */

/** ביטוי האגורות המלא (נקבה): "אגורה אחת" / "שתי אגורות" / "<מספר> אגורות". */

/** מחבר רשימת מילים עם ו׳ חיברת לפני האחרונה (אם יש ≥2). */

/** המספר השלם במילים (0..999,999,999). null אם מחוץ לטווח. */

export function amountInWords(amount, currency = '₪', ONES, TEENS, TENS, HUNDREDS, ONES_F, TEENS_F, THOUSAND_CONSTRUCT) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  function words0_999(n) {
      const out = [];
      const h = Math.floor(n / 100);
      const rem = n % 100;
      if (h)
          out.push(HUNDREDS[h]);
      if (rem) {
          if (rem < 10)
              out.push(ONES[rem]);
          else if (rem < 20)
              out.push(TEENS[rem - 10]);
          else {
              const t = Math.floor(rem / 10);
              const u = rem % 10;
              out.push(TENS[t]);
              if (u)
                  out.push(ONES[u]);
          }
      }
      return out;
  }
  function thousandWords(th) {
      if (th === 1)
          return ['אלף'];
      if (th === 2)
          return ['אלפיים'];
      if (THOUSAND_CONSTRUCT[th])
          return [THOUSAND_CONSTRUCT[th] + ' אלפים'];
      return [joinHeb(words0_999(th)) + ' אלף'];
  }
  function agorotWords(n) {
      if (n < 10)
          return ONES_F[n];
      if (n < 20)
          return TEENS_F[n - 10];
      const t = Math.floor(n / 10);
      const u = n % 10;
      return u ? TENS[t] + ' ו' + ONES_F[u] : TENS[t];
  }
  function agorotPhrase(n) {
      if (n === 1)
          return 'אגורה אחת';
      if (n === 2)
          return 'שתי אגורות';
      return agorotWords(n) + ' אגורות';
  }
  function joinHeb(words) {
      const w = words.filter(Boolean);
      if (w.length === 0)
          return '';
      if (w.length === 1)
          return w[0];
      return w.slice(0, -1).join(' ') + ' ו' + w[w.length - 1];
  }
  function integerInWords(n) {
      if (!Number.isFinite(n) || n < 0 || n > 999_999_999 || Math.floor(n) !== n)
          return null;
      if (n === 0)
          return 'אפס';
      const millions = Math.floor(n / 1_000_000);
      const thousands = Math.floor((n % 1_000_000) / 1000);
      const rest = n % 1000;
      const groups = [];
      if (millions) {
          if (millions === 1)
              groups.push('מיליון');
          else if (millions === 2)
              groups.push('שני מיליון');
          else
              groups.push(joinHeb(words0_999(millions)) + ' מיליון');
      }
      if (thousands)
          groups.push(...thousandWords(thousands));
      if (rest)
          groups.push(...words0_999(rest));
      return joinHeb(groups);
  }

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
