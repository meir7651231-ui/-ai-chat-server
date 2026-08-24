# חוזה · חוט apply-vertical-pack
**תפקיד:** החלת חבילת-ורטיקל על קונפיג קיים: ‏terms+modules+features מוחלפים
בערכי-החבילה (עותקים חדשים; ‏features חסר בחבילה ⇒ ‏{}), ומולבשת זהות-חזותית —
‏theme (רק כשהחבילה מגדירה), ‏icon⇒emoji ו-motion (מוגדר ⇒ נכתב; חסר ⇒ **מוסר**
מהקונפיג), ו-accent לפי דין הצבע-הידני: ‏config.accentCustom ⇒ הצבע-הידני שורד
והדגל נשמר; אחרת צבע-החבילה (והדגל מוסר); אין לחבילה ⇒ accent+accentCustom
מוסרים. שאר שדות-הקונפיג נשמרים. ‏packId לא-מוכר ⇒ no-op בטוח (אותו קונפיג).
**שקעים (חוק-1 — קריאת-שכן הוזרקה כפרמטר):**
- ‏packs — מערך חבילות ‏[{id, terms, modules, features?, theme?, icon?, accent?,
  motion?}] (בקוד-המקור: הקבוע VERTICAL_PACKS, ‏13 חבילות).
**קלט:** ‏config (אובייקט) · ‏packId (מחרוזת) · ‏packs. **פלט:** קונפיג חדש,
או ‏config עצמו (===) על packId לא-מוכר. הקונפיג הנכנס לא משוכתב.
**דוגמאות מחייבות** (P=חבילה מלאה ‏{id:'digital', terms:{'nav.ayin':'פרויקטים'},
modules:{shop:false}, features:{'a.b':true}, theme:'tsohar', icon:'💻',
accent:'#7c3aed', motion:'snappy'} · ‏N=חבילה עמותתית ‏{id:'chesed',
terms:{}, modules:{}} בלי features/theme/icon/accent/motion):
1. ‏packId='ghost' על ‏packs=[P] ⇒ הפלט ‏===config (no-op).
2. ‏config={orgName:'א', slug:'x', emoji:'🕯', motion:'calm', accent:'#000'} + P ⇒
   ‏{orgName:'א', slug:'x', terms:{'nav.ayin':'פרויקטים'}, modules:{shop:false},
   features:{'a.b':true}, theme:'tsohar', emoji:'💻', motion:'snappy',
   accent:'#7c3aed'} — הזהות הוחלפה, orgName/slug שרדו, accentCustom איננו.
3. ‏config={theme:'or-rishon', emoji:'🕯', motion:'calm', accent:'#000'} + N ⇒
   ‏theme נשאר 'or-rishon', אבל ‏emoji/motion/accent/accentCustom **אינם**
   בפלט (הוסרו — מראה קלאסי) ו-‏features==={}.
4. צבע-ידני שורד: ‏config={accent:'#123456', accentCustom:true} + P ⇒
   ‏accent==='#123456' ו-‏accentCustom===true (צבע-החבילה לא דרס).
5. עותקים חדשים: בדוגמה 2, ‏out.terms!==P.terms ו-‏out.modules!==P.modules
   (שינוי בפלט לא יזלוג לחבילה).
**מוצא:** maor/src/lib/verticalPacks.ts:467-495 (‏applyVerticalPack — הכרעת-
בעלים 16.8 "הכל מוחלף חוץ מצבע ידני"). השכן VERTICAL_PACKS הפך לשקע (חוק-1).
