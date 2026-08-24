# חוזה · חוט filter-products
**תפקיד:** סינון חבילות-הקטלוג של החנות — ‏q על שם/תיאור; ‏onlyActive=true ⇒
רק חבילות פעילות נכנסות לחיפוש. תמיד מוחזר מערך חדש (העתק), לא הקלט.
**שקע (חוק-1):** ‏smartFilter(q, items, getTerms) — מנוע-החיפוש המשותף (החוט
smart-filter, מחווט בקופסה); האטום רק בונה את הבסיס ומעביר terms=[name, desc].
**קלט:** ‏products (מערך ‏{name, desc, active}) · ‏q (מחרוזת) · ‏onlyActive
(בוליאני) · ‏smartFilter. **פלט:** מערך חבילות מסונן.
**דוגמאות מחייבות** (‏smartFilter-מזויף בבדיקה — מתעד קריאות ומחזיר את items):
1. ‏products=[{name:'קופון', desc:'הנחה', active:true}, {name:'מתנה', desc:'', active:false}],
   ‏onlyActive=true ⇒ ‏smartFilter מקבל בסיס של חבילה אחת (רק 'קופון') ⇒ ‏['קופון'].
2. אותם products עם ‏onlyActive=false ⇒ הבסיס = שתי החבילות, בסדר-המקור.
3. ‏onlyActive=false ⇒ המוחזר הוא **העתק**: אינו אותו-reference כמו הקלט.
4. ‏getTerms שמועבר ל-smartFilter מחזיר ‏[name, desc]: על ‏{name:'קופון', desc:'הנחה'}
   ⇒ ‏['קופון', 'הנחה'].
5. ‏q מועבר ל-smartFilter כלשונו ('הנח' ⇒ 'הנח').
**מוצא:** maor/src/components/shop/lib.ts:538-546 (‏filterProducts — UX סינון גל B½).
שכן ‏smartFilter הפך לשקע (חוק-1).
