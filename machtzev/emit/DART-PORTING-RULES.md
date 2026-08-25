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
8. **השוואת-מערך בבדיקה** (expand-query): לעולם לא `a.join('')==b.join('')` (לא מבחין ['']↔[] ולא גבול-איבר). ⇒ אורך + איבר-איבר. (עקרון-המוטציה חוצה-שפה.)
9. **מודולו על שלילי** (gem-year) ⚠️ מערכתי! JS `-5 % 1000 == -5`; Dart `== 995` (תמיד לא-שלילי). ⇒ להתנהגות-JS: `a.remainder(b)` (לא `a % b`).
10. **פירוק-מספר** (gem-year): JS `+x`/`Number(x)` → NaN על קלט-רע; Dart `num.parse` **זורק**. ⇒ `num.tryParse(x) ?? הפלת-לNaN-לוגית`.
11. **לוח-עברי = שקע, לא מימוש-מחדש** (heb-parts/heb-month-he) ⚠️ מערכתי! JS משתמש ב-Intl `he-u-ca-hebrew`; מימוש-Dart ידני (Dershowitz-Reingold) סוטה בגבול-השנה (ערב-ר"ה: day:0/שנה-מוקדמת). ⇒ **להזריק שקע-המרת-לוח** (פונקציית ISO→{day,month,year}) במקום לממש. הקופסה תחווט את השקע ל-Intl-שווה-ערך.
12. **המרת-מספר-למחרוזת = shortest-round-trip של JS** (model-meta/room-info-label — גל 20) ⚠️ מערכתי!
    ‏JS ‏String(num): ‏<1e21 עשרוני-מלא (שלם-ענק מרופד-אפסים: 123456789012345680000), ‏≥1e21 כתיב-מעריכי (1e+21).
    ‏Dart: ‏truncate() מרווה ל-int64-max, ‏toStringAsFixed מדפיס פריסת-double מדויקת (…683968) — שניהם סוטים.
    ⇒ עוזר ‏_jsStr אחוד: שלם-בטוח (|v|<2^53) ⇒ עשרוני; ‏2^53–1e21 ⇒ ‏toString-מדעי-של-Dart + פריסה-מרופדת-אפסים; ‏≥1e21 ⇒ מעריכי כמו-JS. לעולם לא ‏truncate/toStringAsFixed בלי גידור-טווח.
13. **toLowerCase/toUpperCase = מיפוי-מלא של JS, לא המיפוי-הפשוט של Dart** (role-of — גל 20)
    ‏"İ" (U+0130): ‏JS ⇒ "i̇" (‏i + ‏U+0307, 2 יחידות); ‏Dart-VM ⇒ "i" (הנקודה נבלעת). השוואות-זהות (אימיילים!) סוטות.
    ⇒ השוואת-מחרוזת-מנורמלת ⇒ שקע-lowercase או טבלת-חריגים (‏U+0130 ועמיתיו) לפני ‏toLowerCase של Dart.
