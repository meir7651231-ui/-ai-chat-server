# חוזה · חוט item-of
**תפקיד:** פענוח רכיב-בחבילה (ShopComponent) לפריט-הקטלוג שלו + דריסות-הרכיב
(SHOP4, הכרעה 18). הפריט נמצא ב-db.shopItems לפי comp.itemId; ‏value/basePrice
של הרכיב **דורסים** את של-הפריט (‎?? — רק כשמוגדרים); ‏stock/validDays/holidays/
active תמיד מהפריט. רכיב טרום-מיגרציה (itemId ריק/מצביע שבור) נופל לשדות-
התאימות של הרכיב עצמו — בלי holidays, ‏active:true, ‏value/basePrice ‎?? 0 —
אין קריסה על נתונים ישנים.
**קלט:** ‏db (עם shopItems[]) · comp (רכיב). **פלט:** ‏ResolvedItem —
{itemId, name, kind, storeId, value, basePrice, stock?, validDays?, holidays?, active}.
**דוגמאות מחייבות** (קטלוג: ‏i1={id:'i1', name:'קופון מזון', kind:'coupon',
storeId:'s1', value:100, basePrice:20, stock:5, validDays:30,
holidays:['פסח'], active:false}):
1. רכיב מצביע בלי דריסות ‏{itemId:'i1', label:'ישן', kind:'x', storeId:'sX'} ⇒
   ‏{itemId:'i1', name:'קופון מזון', kind:'coupon', storeId:'s1', value:100,
   basePrice:20, stock:5, validDays:30, holidays:['פסח'], active:false} —
   הפריט גובר על שדות-התאימות של הרכיב.
2. רכיב עם דריסות ‏{itemId:'i1', value:80, basePrice:0} ⇒ ‏value=80 ·
   ‏basePrice=0 (‏0 מוגדר ⇒ דורס! ‎?? ולא ‎||) · השאר מהפריט.
3. מצביע שבור ‏{itemId:'iZZZ', label:'רכיב ישן', kind:'gift', storeId:'s9',
   value:50, basePrice:10, stock:3, validDays:7} ⇒ נפילת-תאימות:
   ‏{itemId:'iZZZ', name:'רכיב ישן', kind:'gift', storeId:'s9', value:50,
   basePrice:10, stock:3, validDays:7, active:true} — בלי holidays.
4. מצביע שבור בלי שדות-תאימות ‏{itemId:'', label:'ריק', kind:'meet',
   storeId:''} ⇒ ‏value=0 · basePrice=0 · ‏stock=undefined ·
   ‏validDays=undefined · ‏active=true.
**מוצא:** maor/src/components/shop/lib.ts:49-78 (‏itemOf — מנוע-החנות).
