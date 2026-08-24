# חוזה · חוט new-supporter-from-row
**תפקיד:** בונה רשומת-תומך (Supporter) חדשה משורת-ייבוא (CSV/גריד): שדות-הטקסט
נחתכים-רווחים, הטלפון עובר תיקון דרך השקע, והמונים/הצבירות נולדים מאופסים
(‏notes:'' · count/ils/usd:0 · first/last/nextDate:'' · donations:[]).
היסטוריית-ייבוא (row.hist) נכנסת רק כשקיימת ולא-ריקה — דרך mergeHist על בסיס
ריק; אחרת מפתח ‏hist **לא קיים כלל** ברשומה (spread-מותנה).
**שקעים (חוק-1 — קריאות-לשכנים הוזרקו כפרמטרים):**
- ‏fixPhone(s) ⇒ string — נרמול-טלפון ישראלי (במקור: supporters/lib fixPhone).
- ‏mergeHist(existing, incoming) ⇒ מערך — מיזוג-היסטוריה (נקרא תמיד עם [] כבסיס).
**קלט:** ‏id · row {name,phone,email,idNum,address,cat,forWho,hist?} · שני השקעים.
**פלט:** אובייקט-תומך חדש (לא נוגע ב-row).
**דוגמאות מחייבות** (שקעי-בדיקה: fixPhone מוסיף '0' בראש; mergeHist=שרשור):
1. ‏id='s1', row={name:' דוד לוי ', phone:' 501234567 ', email:'a@b.c', idNum:'12345',
   address:'חיפה', cat:'ידיד', forWho:'ישיבה'} ⇒ ‏{id:'s1', name:'דוד לוי',
   phone:'0501234567' (חיתוך-ואז-שקע), email:'a@b.c', …, notes:'', count:0,
   ils:0, usd:0, first:'', last:'', nextDate:'', donations:[]} — בלי מפתח hist.
2. ‏row.hist=[{d:'2026-01-01', ils:100}] ⇒ ‏hist === תוצאת ‏mergeHist([], row.hist)
   (בשקע-הבדיקה: ‏[{d:'2026-01-01', ils:100}]).
3. ‏row.hist=[] ⇒ אין מפתח hist (‏'hist' in out === false) — ריק ≠ קיים.
4. כל שדות-הטקסט רווחים-בלבד ⇒ מחרוזות ריקות (‏name:'', phone:fixPhone('')…),
   והמונים עדיין מאופסים.
**מוצא:** maor/src/components/supporters/lib.ts:652-678 (‏newSupporterFromRow —
מסלול-הייבוא). ‏fixPhone + ‏mergeHist הפכו לשקעים (חוק-1).
