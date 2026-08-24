# חוזה · חוט org-enabled-features
**תפקיד:** טווח **תת-הדגלים** שהמנהל יכול לחלק לעובדות (עקרון-התקרה,
ברזולוציית-דגל). דגל עובר את המסננת רק אם: (א) המודול-האב שלו, אם הוא
מודול-אמיתי (נמצא ב-allModules), דלוק בארגון; (ב) לפי סוגו — דגל **opt-in**
‏(optIn===true): רק ‎features[key]===true‎ (חסר = **כבוי**; תיקון 21.8 —
הקריאה `===false` הציגה למנהל יכולת שהארגון מעולם לא הדליק/קנה) · דגל **רגיל**:
‎features[key]!==false‎ (חסר = פעיל, רק false מכבה). module שאינו ב-allModules
(למשל 'core') — לא נחסם בשער-המודול.
**שקעים (חוק-1):** allModules — מרשם מפתחות-המודולים (ALL_MODULES) ·
orgEnabledModules(orgConfig, allModules)→string[] — המודולים הדלוקים
(החוט org-enabled-modules, מחווט בקופסה).
**קלט:** orgConfig={modules?,features?}, features=[{key,module,optIn?}] + שני השקעים.
**פלט:** תת-רשימה של features (אותם אובייקטים, אותו סדר).
**דוגמאות מחייבות (allModules=['families','courses']; REG=[
A={key:'families.a',module:'families'}, B={key:'courses.b',module:'courses'},
C={key:'core.c',module:'core',optIn:true}, D={key:'core.d',module:'core'}]):**
- ‏{} ⇒ [A,B,D] — הרגילים דלוקים (חסר=פעיל), ה-opt-in ‏C בחוץ (חסר=כבוי)
- ‏{modules:{courses:false}} ⇒ [A,D] — ‏B נפל עם המודול-האב
- ‏{modules:{courses:false},features:{'courses.b':true}} ⇒ [A,D] — מודול-אב כבוי גובר
- ‏{features:{'core.c':true}} ⇒ [A,B,C,D] — ‏opt-in רק עם true מפורש
- ‏{features:{'families.a':false}} ⇒ [B,D] — דגל רגיל: false מכבה
- ‏{features:{'core.c':1}} ⇒ [A,B,D] — ‏truthy שאינו true אינו מדליק opt-in
**מוצא:** חולץ כלשונו מ-maor/src/components/platform/lib.ts:145-160
(ALL_MODULES + orgEnabledModules השכנים שוקעו).
