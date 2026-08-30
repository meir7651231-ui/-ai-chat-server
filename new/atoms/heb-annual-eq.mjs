/** חוט · heb-annual-eq — שוויון יום+חודש עברי לחזרה שנתית (א-סימטרי: עוגן מול יום-נבדק).
 *  חוזה: heb-annual-eq.contract.md · חולץ כלשונו מ-maor/src/lib/hebrew.ts:95-121;
 *  השכן scanHebYear (סריקת-שנה) הוזרק כשקע (חוק-1); isAdar (helper פרטי) הוטמע פנימה. */

/** האם שם החודש הוא אדר כלשהו (רגיל / א׳ / ב׳). */

export function hebAnnualEq(anchor, query, scanHebYear, T) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  function isAdar(m) {
    return m === T.k1 || m === T.k2 || m === T.k3;
  }

  // כלל ל׳: עוגן-30 מול א' בחודש-הבא, כשלחודש-העוגן אין 30 בשנת היום-הנבדק.
  if (anchor.day === 30 && query.day === 1 && query.year) {
    const { seq, has30 } = scanHebYear(query.year);
    const qi = seq.indexOf(query.month);
    const prev = qi > 0 ? seq[qi - 1] : null;
    // עוגן 30 אדר-א' בשנה *פשוטה*: אין 'Adar I' ברצף (רק 'Adar'), לכן ההשוואה
    // הישירה נכשלה והאירוע נעלם לגמרי (באג — אזכרה/יום-הולדת ב-30 אדר-א' חסר
    // מ-12 מתוך 19 שנים). כלל ל׳ המתועד: נופל על א' בחודש-הבא (=א' ניסן). אדר-א'
    // בשנה פשוטה = ה-'Adar' היחיד, שאין בו 30 ⇒ יורה. (בשנה מעוברת אין נפילה —
    // ל-Adar I יש 30, ההתאמה המדויקת מטפלת; ראה בדיקת-שימור.)
    const prevMatches = prev === anchor.month || (anchor.month === T.k2 && prev === T.k1);
    if (prev && prevMatches && !has30.has(prev)) return true;
  }
  if (anchor.day !== query.day) return false;
  if (isAdar(anchor.month) || isAdar(query.month)) {
    if (!isAdar(anchor.month) || !isAdar(query.month)) return false; // אחד אדר, השני לא
    if (query.month === T.k1) return true; // שנה פשוטה — אדר יחיד בולע כל עוגן-אדר
    if (query.month === T.k3) return anchor.month === T.k1 || anchor.month === T.k3;
    if (query.month === T.k2) return anchor.month === T.k2;
    return false;
  }
  return anchor.month === query.month;
}
