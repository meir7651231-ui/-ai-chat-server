# 🔤 כללי-המרה JS→Dart שנלמדו בדם (מהזרימה-המשולבת + אימות-עוין)
כל כלל = סטייה-מהמקור שנתפסה. הסוכן-הממיר חייב לכבד אותם (חוק-4: התנהגות-זהה).

1. **מיון-יציב** (candidate-supporters): `List.sort` של Dart לא-יציב ל-≥32; JS יציב.
   ⇒ מיון שמסתמך על יציבות = decorate-sort-undecorate (אינדקס-מקורי כשובר-שוויון).
2. **null מול undefined** (apply-meta-partial): `v == null` ב-Dart תופס גם null-מפורש;
   JS `=== undefined` לא. ⇒ `!map.containsKey(k)` במקום `v == null`.
3. **24:00 / תאריך-מגלגל** (build-ics): `new Date('T24:00')` תקין ב-V8 (מחרת); Dart-guard דוחה.
   ⇒ לשקף סמנטיקת-Date של JS, לא משמר-טווח.
4. **תאריך-מגלגל** (age-of/default-course-dates): JS מחזיר Invalid רק לחודש 13/00 ויום 00, אבל **יום-גולש** (2026-02-30) JS מגלגל לחודש-הבא (תקין)! ‏Dart round-trip-guard דוחה⇒נפילה. גלישת-יום היא משפחת-באג חוזרת.
   ⇒ regex `^\d{4}-\d{2}-\d{2}` + round-trip לפני קבלה.
5. **substring שלילי** (gematria): JS `slice(0,-1)` סלחן; Dart `substring(0,-1)` זורק.
   ⇒ בדיקת-אורך לפני, או לוגיקת-slice בטוחה.
6. **פורמט-locale** (shekel): `toLocaleString('he-IL')` מזריק סימן-RTL; `.toString()` לא.
   ⇒ שקע-פורמט שמחקה he-IL (RTL-mark + סימן-אפס).
7. **truthiness** (age-of): `!x`/`if(x)` של JS ≠ Dart. ⇒ שקע `_falsy` או תנאי-מפורש.
