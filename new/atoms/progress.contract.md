# חוזה · חוט progress
**תפקיד:** מדד-התקדמות של קמפיין-חיוג (החייגן-המונחה): כמה מזהים נותרו בתור,
כמה נסגרו (total−remaining, קטום ל-0), וספירה פר-תוצאה. תיקון 20.8 שמור בחוזה:
תוצאות-חזרה (requeue — לא-ענה/דלג) נספרות **פר-אדם ייחודי** ולא פר-ניסיון —
מי שלא ענה 3 פעמים נספר 1; תוצאות סופיות נספרות פר-רשומת-יומן. טהור, קריאה-בלבד.
**שקעים (חוק-1 — קריאת-השכן הוזרקה כפרמטר):**
- ‏requeueOutcomes — רשימת התוצאות הלא-סופיות (בקוד-המקור: REQUEUE_OUTCOMES
  ‏=['noanswer','skip'] — קיים כאטום requeue-outcomes; החיבור בקופסה).
**קלט:** ‏c (‏{total, queue: string[], log: [{id,outcome,at}]}) + השקע.
**פלט:** ‏{total, remaining, finalized, counts} — ‏counts עם כל 6 המפתחות
(donated/noanswer/refused/callback/done/skip), גם כשהם 0.
**דוגמאות מחייבות** (בכולן ‏RQ=['noanswer','skip']):
1. ‏c={total:3, queue:['b','c'], log:[{id:'a',outcome:'donated',at:T}]} ⇒
   ‏{total:3, remaining:2, finalized:1} · ‏counts.donated=1 · שאר-המפתחות 0.
2. פר-אדם (התיקון): ‏c={total:1, queue:['a'], log: 3×{id:'a',outcome:'noanswer'}}
   ⇒ ‏counts.noanswer=1 (לא 3) · ‏remaining=1 · ‏finalized=0.
3. שני אנשים שלא ענו: ‏log=[{id:'a',noanswer},{id:'b',noanswer},{id:'a',noanswer}]
   ⇒ ‏counts.noanswer=2 — ייחודי פר-מזהה, פר-תוצאה.
4. סופית פר-רשומה: ‏log=[{id:'a',donated},{id:'b',donated}] ⇒ ‏counts.donated=2.
5. קמפיין ריק: ‏c={total:0, queue:[], log:[]} ⇒
   ‏{total:0, remaining:0, finalized:0} וכל ה-counts 0.
6. קיטום-finalized: ‏c={total:0, queue:['a'], log:[]} ⇒ ‏finalized=0
   (‏Math.max — לא ‎-1); ‏remaining=1 (‏Set — תור עם כפילות נספר ייחודי).
**מוצא:** maor/src/lib/dialer.ts:80-96 (‏progress — מנוע החייגן, טהור).
השכן REQUEUE_OUTCOMES הפך לשקע (חוק-1); ‏ZERO_COUNTS הפרטי הוטמע בגוף-החוט.
