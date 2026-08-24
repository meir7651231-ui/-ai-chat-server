# חוזה · חוט day-progress
**תפקיד:** מד-התקדמות ליום-חלוקה — ספירת מסירות היום לפי סטטוס:
‏total (כולן) · ‏pickup · ‏enroute · ‏delivered. סטטוס אחר/חסר נספר רק ב-total.
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏deliveriesOfDay(db, dayId) ⇒ מערך-מסירות — שולף את מסירות-היום מה-db
  (בקוד-המקור: שכן באותו קובץ שמסנן `db.deliveries` לפי `dayId`).
  האטום קורא לו פעם-אחת ולא נוגע ב-db בעצמו.
**קלט:** db · dayId (מחרוזת) · השקע deliveriesOfDay.
**פלט:** ‏{ total, pickup, enroute, delivered } — ארבעה מספרים.
**דוגמאות מחייבות (עם שקע-אמת: סינון deliveries לפי dayId):**
1. ‏5 מסירות — ‏4 של 'd1' ‏(pickup·enroute·delivered·delivered) ואחת של 'd2'
   ⇒ ‏dayProgress(db,'d1',…) → ‏{total:4, pickup:1, enroute:1, delivered:2}.
2. אותו db, ‏'d2' (‏pickup יחיד) ⇒ ‏{total:1, pickup:1, enroute:0, delivered:0}.
3. יום בלי מסירות ‏('d9') ⇒ ‏{total:0, pickup:0, enroute:0, delivered:0}.
4. מסירה עם סטטוס-זר 'x' ב-'d3' ⇒ ‏{total:1, pickup:0, enroute:0, delivered:0}
   (נספרת ב-total בלבד).
**מוצא:** maor/src/components/shop7/lib.ts:43-51 (‏dayProgress — "מד-התקדמות
ליום — ספירת מסירות לפי סטטוס"). השכן deliveriesOfDay הפך לשקע (חוק-1).
