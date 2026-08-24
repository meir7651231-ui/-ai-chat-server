# חוזה · חוט deliveries-of-volunteer
**תפקיד:** כל המסירות של מתנדב נתון — סינון `db.deliveries` לפי `volunteerId`,
עם צמצום אופציונלי ליום-חלוקה (`dayId`). ‏dayId ריק/חסר ⇒ כל ימי-המתנדב.
טהור, סדר-מקור, אותן רפרנסות.
**קלט:** ‏db עם `deliveries[]` (לכל מסירה `volunteerId`+`dayId`) · ‏volId מחרוזת ·
‏dayId מחרוזת אופציונלית.
**פלט:** מערך המסירות של המתנדב (וביום, אם ניתן).
**דוגמאות מחייבות (db.deliveries=[{id:'d1',volunteerId:'v1',dayId:'A'},
{id:'d2',volunteerId:'v2',dayId:'A'},{id:'d3',volunteerId:'v1',dayId:'B'}]):**
1. ‏volId='v1' בלי dayId ⇒ אורך 2, ‏[d1,d3] בסדר-המקור.
2. ‏volId='v1', dayId='A' ⇒ אורך 1, ‏[0].id==='d1'.
3. ‏volId='v1', dayId='' (falsy) ⇒ כמו בלי dayId — אורך 2.
4. ‏volId='v1', dayId='C' ⇒ [].
5. ‏volId='v9' (לא קיים) ⇒ [].
**מוצא:** חולץ כלשונו מ-maor/src/components/shop7/lib.ts:29-31 (מנוע SHOP7 הטהור).
