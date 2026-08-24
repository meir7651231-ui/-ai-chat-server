# חוזה · חוט deliveries-of-day
**תפקיד:** כל המסירות של יום-חלוקה נתון — סינון `db.deliveries` לפי `dayId`.
טהור, בלי מיון (סדר-המקור נשמר), בלי העתקת-ישויות (אותן רפרנסות).
**קלט:** ‏db עם `deliveries[]` (לכל מסירה `dayId`) · ‏dayId מחרוזת.
**פלט:** מערך המסירות שה-`dayId` שלהן שווה בדיוק (===).
**דוגמאות מחייבות (db.deliveries=[{id:'d1',dayId:'A'},{id:'d2',dayId:'B'},{id:'d3',dayId:'A'}]):**
1. ‏dayId='A' ⇒ אורך 2, ‏[d1,d3] בסדר-המקור, ‏[0]===db.deliveries[0] (אותה רפרנס).
2. ‏dayId='B' ⇒ אורך 1, ‏[0].id==='d2'.
3. ‏dayId='C' (לא קיים) ⇒ [].
4. ‏db.deliveries=[] ⇒ [].
**מוצא:** חולץ כלשונו מ-maor/src/components/shop7/lib.ts:25-27 (מנוע SHOP7 הטהור).
