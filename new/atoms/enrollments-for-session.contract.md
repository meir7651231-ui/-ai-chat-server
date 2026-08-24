# חוזה · חוט enrollments-for-session
**תפקיד:** המשובצים למפגש ביומן: כל שיבוצי-הקורס; כשיש כמה קבוצות (מפגשים) —
רק מי ששויך/ה לקבוצה של המפגש הזה, **בתוספת מי שעדיין ללא שיוך-קבוצה**
(כדי שלא ייעלמו מהיומן). ‏sessionIndex מעבר-לטווח נצמד למפגש-האחרון (Math.min).
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏sessionsOf(c) ⇒ מערך-מפגשים — מפגשי-החוג; חוג בלי sessions ⇒ מפגש-יחיד
  נגזר מ-‏{day:c.weekday, time:c.time, label:''}.
- ‏groupLabelOf(ss, i) ⇒ מחרוזת — תווית-הקבוצה: ‏ss.label או 'קבוצה '+(i+1).
**קלט:** db עם ‏enrollments · c — חוג · sessionIndex — אינדקס-מפגש · השקעים.
**פלט:** מערך-שיבוצים מסונן.
**דוגמאות מחייבות (עם sessionsOf/groupLabelOf אמיתיים; שיבוצים מזוהים ב-id):**
בסיס: ‏db.enrollments = ‏[{id:'e1',courseId:'c1',group:'א'}, {id:'e2',courseId:'c1',group:'ב'}, {id:'e3',courseId:'c1'}, {id:'e4',courseId:'c2',group:'א'}].
1. חוג-מפגש-יחיד ‏c1={id:'c1',weekday:2,time:'16:00'} (בלי sessions), ‏sessionIndex=0 ⇒ ‏[e1,e2,e3] (כל שיבוצי-החוג; e4 של חוג-אחר מסונן).
2. חוג-2-קבוצות ‏c1={id:'c1',sessions:[{label:'א'},{label:'ב'}]}, ‏sessionIndex=0 ⇒ ‏[e1,e3] (קבוצת 'א' + חסרי-שיוך).
3. אותו חוג, ‏sessionIndex=1 ⇒ ‏[e2,e3] (קבוצת 'ב' + חסרי-שיוך).
4. אותו חוג, ‏sessionIndex=5 (מעבר-לטווח) ⇒ ‏[e2,e3] (נצמד למפגש-האחרון).
5. חוג-2-מפגשים בלי תוויות ‏{sessions:[{},{}]}, שיבוץ ‏{id:'g1',courseId:'c9',group:'קבוצה 2'}, ‏sessionIndex=1 ⇒ ‏[g1] (התווית הנגזרת 'קבוצה 2').
**מוצא:** maor/src/components/diary/lib.ts:228-236 (‏enrollmentsForSession,
"המשובצים למפגש..."); ‏sessionsOf (courses/lib) ו-groupLabelOf (diary/lib) —
שכנים — הפכו לשקעים (חוק-1).
