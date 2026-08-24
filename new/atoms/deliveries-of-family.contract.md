# חוזה · חוט deliveries-of-family
**תפקיד:** כל המסירות של משפחה נתונה — סינון `db.deliveries` לפי `familyId`
(לפאנל כרטיס-המשפחה — תצוגה בלבד). טהור, סדר-מקור, אותן רפרנסות.
**קלט:** ‏db עם `deliveries[]` (לכל מסירה `familyId`) · ‏famId מחרוזת.
**פלט:** מערך המסירות שה-`familyId` שלהן שווה בדיוק (===).
**דוגמאות מחייבות (db.deliveries=[{id:'d1',familyId:'f1'},{id:'d2',familyId:'f2'},{id:'d3',familyId:'f1'}]):**
1. ‏famId='f1' ⇒ אורך 2, ‏[d1,d3] בסדר-המקור, ‏[1]===db.deliveries[2] (אותה רפרנס).
2. ‏famId='f2' ⇒ אורך 1, ‏[0].id==='d2'.
3. ‏famId='f9' (לא קיימת) ⇒ [].
4. ‏db.deliveries=[] ⇒ [].
**מוצא:** חולץ כלשונו מ-maor/src/components/shop7/lib.ts:64-66 (מנוע SHOP7 הטהור).
