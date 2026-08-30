/** חוט · amount-in-words — קודם אוטומטית (אפיון-Golden). חוזה: amount-in-words.contract.md
 * שכנים טהורים (integerInWords · agorotPhrase + עוזריהם) הוטמעו כמודול-מקומי (חוק-1, כמו HEX2)
 * מהמקור maor/src/lib/hebrewNumber.ts — התנהגות זהה-ביט. אינם מיוצאים: פנימיים לאטום. */


/** מילות המספר 1..999 כמערך (בלי ו׳ חיברת — מתווספת בסוף). */

/** מילות האלפים (מספר האלפים 1..999) — סמיכות ל-3..10, אחרת מספר + "אלף/אלפים". */

/** מילות אגורות 1..99 בצורת-נקבה (סמיכות עשרות+יחידות; היחידה במין נקבה). */

/** ביטוי האגורות המלא (נקבה): "אגורה אחת" / "שתי אגורות" / "<מספר> אגורות". */

/** מחבר רשימת מילים עם ו׳ חיברת לפני האחרונה (אם יש ≥2). */

/** המספר השלם במילים (0..999,999,999). null אם מחוץ לטווח. */

export function amountInWords(amount, currency = '₪', ONES, TEENS, TENS, HUNDREDS, ONES_F, TEENS_F, THOUSAND_CONSTRUCT, T) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  function words0_999(n) {
      const out = [];
      const h = Math.floor(n / T.k22);
      const rem = n % T.k22;
      if (h)
          out.push(HUNDREDS[h]);
      if (rem) {
          if (rem < T.k23)
              out.push(ONES[rem]);
          else if (rem < T.k24)
              out.push(TEENS[rem - T.k23]);
          else {
              const t = Math.floor(rem / T.k23);
              const u = rem % T.k23;
              out.push(TENS[t]);
              if (u)
                  out.push(ONES[u]);
          }
      }
      return out;
  }
  function thousandWords(th) {
      if (th === 1)
          return [T.k1];
      if (th === 2)
          return [T.k2];
      if (THOUSAND_CONSTRUCT[th])
          return [THOUSAND_CONSTRUCT[th] + T.k3];
      return [joinHeb(words0_999(th)) + T.k4];
  }
  function agorotWords(n) {
      if (n < T.k23)
          return ONES_F[n];
      if (n < T.k24)
          return TEENS_F[n - T.k23];
      const t = Math.floor(n / T.k23);
      const u = n % T.k23;
      return u ? TENS[t] + T.k5 + ONES_F[u] : TENS[t];
  }
  function agorotPhrase(n) {
      if (n === 1)
          return T.k6;
      if (n === 2)
          return T.k7;
      return agorotWords(n) + T.k8;
  }
  function joinHeb(words) {
      const w = words.filter(Boolean);
      if (w.length === 0)
          return '';
      if (w.length === 1)
          return w[0];
      return w.slice(0, -1).join(' ') + T.k5 + w[w.length - 1];
  }
  function integerInWords(n) {
      if (!Number.isFinite(n) || n < 0 || n > T.k25 || Math.floor(n) !== n)
          return null;
      if (n === 0)
          return T.k9;
      const millions = Math.floor(n / T.k26);
      const thousands = Math.floor((n % T.k26) / T.k27);
      const rest = n % T.k27;
      const groups = [];
      if (millions) {
          if (millions === 1)
              groups.push(T.k10);
          else if (millions === 2)
              groups.push(T.k11);
          else
              groups.push(joinHeb(words0_999(millions)) + T.k12);
      }
      if (thousands)
          groups.push(...thousandWords(thousands));
      if (rest)
          groups.push(...words0_999(rest));
      return joinHeb(groups);
  }

    if (!Number.isFinite(amount) || amount < 0)
        return String(amount);
    const shekelWord = currency === '$' ? { one: T.k13, many: T.k14, agName: T.k15 } : { one: T.k16, many: T.k17, agName: T.k18 };
    let whole = Math.floor(amount);
    let agorot = Math.round((amount - whole) * T.k22);
    // 🐛 נחיל-9×9 (13.8): גלישת-עיגול — שבר ≥.995 עיגל אגורות ל-100 ("6 ומאה אגורות").
    // נשיאה לשקל השלם (5.995 ⇒ "שישה שקלים", לא "חמישה שקלים ומאה אגורות").
    if (agorot === T.k22) {
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
        s = T.k19 + shekelWord.many;
    // 🐛 נחיל-עמוק (13.8): 2 בצורת-נפרד ("שניים") שגוי לפני שם-עצם — הצורה התקנית
    // היא סמיכות "שני שקלים"/"שני דולרים" (הכרעת-בעלים "לתקן ל'שני שקלים'").
    else if (whole === 2)
        s = T.k20 + shekelWord.many;
    else
        s = wholeWords + ' ' + shekelWord.many;
    if (agorot > 0) {
        if (currency === '₪') {
            // אגורה נקבה — מספר בצורת-נקבה + יחיד/סמיכות ("שתי אגורות").
            s += T.k21 + agorotPhrase(agorot);
        }
        else {
            // סנט זכר — צורת-הזכר של integerInWords מתאימה.
            const agWords = integerInWords(agorot);
            s += T.k21 + (agWords ?? agorot) + ' ' + shekelWord.agName;
        }
    }
    return s;
}
