# תוכנית — מיון תיקים לפי שכירות

## מטרה
סדר את טבלת התיקים בחלקיק תיק לפי שכירות מהגבוה לנמוך (יורד).

## פירוק (10 שלבים)
1. ✓ קרא את שפת-הספק (SPEC-LANG.md) ⇐ תמיכה בתחביר `מיון:`
2. ✓ קרא את תיאור משימה + הוראות (MASTER_PROTOCOL.md, section ג)
3. קרא את הספק הנוכחי (sechirut.txt) — זיהוי השורה עם `[טבלה]`
4. חפש דוגמאות בספקים אחרים עם מיון טבלה
5. עדכן את sechirut.txt: החלף `חלקיק תיק: [טבלה]` ב-`חלקיק תיק: [טבלה] | מיון: שכירות יורד`
6. בדוק לפי grep שלא היו שינויים אחרים בספק
7. הרץ `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
8. הרץ machine report להתאמה
9. תעד לקח ב-LEARNINGS.md (M4 format)
10. כתוב INSP report עם VERDICT

## משאבים
- שפת-הספק: SPEC-LANG.md line 5, 17
- הספק הנוכחי: sechirut.txt line 22
- מחולל: app-ds.mjs
- דיווח: /tmp/police-bench.mjs

## הנחות
- תחביר `מיון: <שדה> יורד` נתמך בשפה
- אין צורך בעדכון מנוע, רק בספק
- שאר הישויות לא מושפעות
