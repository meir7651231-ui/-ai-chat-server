# חוזה · חוט intake-log
**תפקיד:** יומן הקליטות של מלאי-החנות — כל קליטה מלווה בשם-הפריט שלה
(‏itemId → ‏shopItems; פריט-חסר ⇒ "—"), ממוין תאריך-יורד (חדש-ראשון;
שוויון-תאריך = סדר-ההזנה, מיון יציב) + סכימת totalCost של כל העלויות
(תרומה-בעין cost=0 ⇒ לא מוסיפה).
**קלט:** db = ‏{shopIntakes:[{itemId, date, cost, …}], shopItems:[{id, name, …}]}.
**פלט:** ‏{rows:[{intake, itemName}], totalCost}.
**דוגמאות מחייבות** (‏shopItems=[{id:'i1',name:'סל מזון'},{id:'i2',name:'שמיכה'}]):
- ‏shopIntakes=[{itemId:'i1',date:'2026-08-01',cost:120},
  {itemId:'i2',date:'2026-08-20',cost:80}] ⇒ ‏rows בסדר
  ‏['2026-08-20'·"שמיכה", '2026-08-01'·"סל מזון"] · ‏totalCost=200
- קליטה עם itemId='iX' שאינו בקטלוג ⇒ ‏itemName="—" (העלות כן נספרת)
- תרומה-בעין cost=0 ⇒ נשארת ביומן, ‏totalCost לא גדל
- שתי קליטות באותו תאריך ⇒ נשמר סדר-ההזנה ביניהן (מיון יציב)
- ‏shopIntakes=[] ⇒ ‏{rows:[], totalCost:0}
**מוצא:** maor/src/components/shop/lib.ts:588-593 (‏intakeLog, "יומן
הקליטות — חדש-ראשון … + סה"כ עלויות (תרומות-בעין = 0, לא מוסיפות)").
