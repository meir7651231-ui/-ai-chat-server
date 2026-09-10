# GOAL (one line)
בגרסה המחוללת של «פנויים לידי עכשיו»: רשימת-האנשים מוצגת ממוינת לפי המרחק-האמיתי ממני (הקרוב ראשון), והמרחק המוצג הוא ק"מ אמיתיים = sqrt(מרחק בריבוע) — נגזר במנוע, לא ביד בפלט.

# DECOMPOSITION (10 steps)
1. פרוטוקול + ספק + איתור השכבה: entity.mjs (פירוק-נוסחה) ⇒ render-ds.mjs (compileFormula / renderEntity רשימה).
2. search-record: האם יש אטום/מנוע-מדף ל-sqrt/מרחק.
3. search-record: האם יש אטום/מנוע-מדף למיון-רשימה (order/sort).
4. הכרעת-שכבה: הרחבת compileFormula ל-sqrt(שדה) (עיוור-דומיין) — לא נגיעה בפלט.
5. דקדוק-מיון כאטום-דאטה (spec-lang.data.json) + פירוק ב-entity.mjs + יישום ברשימה/טבלה של renderEntity.
6. עדכון הספק panuy.txt: שורת-מיון + חלקיק «מרחק בקמ».
7. הרצת-צנרת (regen בלי tighten-types השבור) + אימות-בייטים בפלט Dart.
8. שער חדש (L80): sortcalc — sqrt/מיון נאכפים; אדום-על-רעל, ירוק-על-נקי; רישום ב-gates.tsv + police + regen/ship.
9. הרצת השערים הקיימים (particles/police וכו') להוכיח שלא נשבר.
10. לקח M4 ב-LEARNINGS + goal-card + דוח.
