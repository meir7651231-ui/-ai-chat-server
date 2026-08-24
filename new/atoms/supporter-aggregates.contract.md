# חוזה · חוט supporter-aggregates
**תפקיד:** צבירת-הקבלות של תורם ממערך ‏donations **בלבד** (בלי hist — האינווריאנט:
המונים השמורים = קבלות-בלבד; ההיסטוריה מתווספת בתצוגה פעם אחת, בחוטים sup-ils/sup-usd).
מטבע: ‏cur==='$' ⇒ דולר; **כל השאר** (‏'₪', ריק, חסר, מיובא) ⇒ שקל. סכום לא-סופי
(‏NaN/Infinity/חסר) נספר כ-0 אך השורה עדיין נספרת ב-count. ‏first/last = תאריכי-הקבלות
הממוינים לקסיקוגרפית (ISO); קבלה בלי ‏date לא משתתפת בהם.
**קלט:** ‏sp — אובייקט עם ‏donations?: {amount?, cur?, date?}[] (לא-מערך ⇒ כ-ריק).
**פלט:** ‏{count:number, ils:number, usd:number, first:string, last:string} — ריק ⇒ ‏'' בתאריכים.
**דוגמאות מחייבות:**
1. ‏{donations:[{amount:100,cur:'₪',date:'2026-01-05'},{amount:50,cur:'$',date:'2026-03-01'}]}
   ⇒ ‏{count:2, ils:100, usd:50, first:'2026-01-05', last:'2026-03-01'}.
2. ‏{} (אין donations) ⇒ ‏{count:0, ils:0, usd:0, first:'', last:''}.
3. ‏cur חסר ⇒ שקל: ‏{donations:[{amount:70,date:'2025-05-05'}]} ⇒ ‏ils=70, usd=0.
4. סכום לא-סופי נספר כ-0 אך count עולה: ‏{donations:[{amount:NaN,date:'2025-01-01'},{amount:30,date:'2025-02-02'}]}
   ⇒ ‏{count:2, ils:30}.
5. תאריכים לא-ממוינים בקלט ⇒ ‏first/last ממוינים: ‏{donations:[{amount:1,date:'2026-06-01'},{amount:2,date:'2026-02-01'}]}
   ⇒ ‏first='2026-02-01', last='2026-06-01'.
6. קבלה בלי date לא נכנסת לטווח: ‏{donations:[{amount:10},{amount:20,date:'2026-04-04'}]}
   ⇒ ‏{count:2, ils:30, first:'2026-04-04', last:'2026-04-04'}.
7. ‏donations שאינו מערך ⇒ כ-ריק: ‏{donations:'x'} ⇒ ‏{count:0, ils:0, usd:0, first:'', last:''}.
**מוצא:** maor/src/lib/supporterAgg.ts:27-42 (‏supporterAggregates) — חולץ כלשונו, אפס שקעים.
