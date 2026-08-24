# חוזה · חוט org-enabled-modules
**תפקיד:** המודולים הדלוקים בארגון = טווח-הכפתורים שהמנהל בכלל רואה באשף
(הכרעת-בעלים ORGADMIN: "רק את הכפתורים שאני הדלקתי"). חוזה-הדגלים של מאור:
מפתח חסר = פעיל, **רק false מכבה** ⇒ מסונן רק מודול שערכו false; הסדר =
סדר allModules.
**שקעים (חוק-1):** allModules — מרשם כל מפתחות-המודולים (הקבוע ALL_MODULES,
מוזרק בקופסה).
**קלט:** orgConfig={modules?:Record<string,boolean>} + השקע allModules: string[].
**פלט:** string[] — תת-רשימה של allModules.
**דוגמאות מחייבות (allModules=['families','courses','supporters']):**
- ‏{modules:{courses:false}} ⇒ ['families','supporters']
- ‏{} (בלי modules) ⇒ ['families','courses','supporters']
- ‏{modules:{}} ⇒ כל השלושה
- ‏{modules:{courses:true}} ⇒ כל השלושה (true אינו משנה)
- ‏{modules:{families:false,courses:false,supporters:false}} ⇒ []
**מוצא:** חולץ כלשונו מ-maor/src/components/platform/lib.ts:135-137
(ALL_MODULES שוקע).
