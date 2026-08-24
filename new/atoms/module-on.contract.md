# חוזה · חוט module-on
**תפקיד:** האם מודול פעיל בקונפיגורציית-הארגון — **מפתח חסר = פעיל; רק false
מכבה** (חוזה-הדגלים של מאור). טהור, אפס-שקעים.
**קלט:** ‏cfg (אובייקט עם ‏modules: מילון מודול⇒boolean) · ‏m (שם-מודול).
**פלט:** boolean.
**דוגמאות מחייבות:**
1. ‏cfg={modules:{families:false}}, m='families' ⇒ **false** (רק false מכבה).
2. ‏cfg={modules:{}}, m='families' ⇒ **true** (מפתח חסר = פעיל).
3. ‏cfg={modules:{shop:true}}, m='shop' ⇒ **true** (true מפורש = פעיל).
4. ‏cfg={modules:{shop:false}}, m='tzedaka' ⇒ **true** (כיבוי-שכן לא מדביק).
5. ‏cfg={modules:{courses:undefined}}, m='courses' ⇒ **true** (undefined ≠ false).
**מוצא:** maor/src/lib/config.ts:15-17 (‏moduleOn — מנוע-הקונפיגורציה; תשעת
מודולי-הניווט הניתנים לכיבוי כפופים לו דרך featureOn).
