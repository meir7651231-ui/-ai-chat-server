# חוזה · חוט feature-on
**תפקיד:** האם פיצ'ר עדיין פעיל — חוזה-הדגלים: מפתח חסר = פעיל; רק ‏false מכבה.
**שרשור-אבות מלא** (הכרעת-בעלים "הוא לא שילם הוא לא מקבל"): ‏'a.b.c' כבוי אם
כבוי במפורש 'a.b.c' עצמו, או 'a.b', או 'a' — וכן אם הקידומת הראשונה היא
מודול-ניווט (ברשימה המוזרקת) ושקע-moduleOn מחזיר עליה false. קידומות שאינן
ברשימה (כגון 'core'/'home'/'settings') — רק שרשור-הדגלים חל, moduleOn לא נשאל.
**שקעים (חוק-1 — קריאת-שכן וידע-הקשר הוזרקו כפרמטרים):**
- ‏navModuleKeys — מערך מפתחות מודולי-הניווט (במקור: הקבוע NAV_MODULE_KEYS;
  הרשימה = ידע-חיווט, ראו האטום all-modules — לא ידע של האטום · חוק-5).
- ‏moduleOn(cfg, moduleKey) ⇒ boolean — טוגל-מודול (במקור: config.moduleOn).
**קלט:** ‏cfg (עם ‏features? — מילון דגלים) · ‏key ('a.b.c') · ‏navModuleKeys ·
שקע-moduleOn. **פלט:** boolean.
**דוגמאות מחייבות** (בכולן ‏NAV=['families','courses'] · ‏mOn=()=>true אלא אם צוין):
1. ‏cfg={features:{}} · key='families.x' ⇒ ‏true — מפתח חסר = פעיל.
2. ‏features={'families.x':false} · key='families.x' ⇒ ‏false — הדגל עצמו כבוי.
3. ‏features={'families':false} · key='families.x.y' ⇒ ‏false — אב-שורש כבוי
   מכבה את כל צאצאיו; וגם אב-ביניים: ‏features={'a.b':false} · key='a.b.c' ⇒ false.
4. ‏key='families.x' · ‏mOn=()=>false ⇒ ‏false — מודול-הניווט כבוי מכבה הכול,
   גם כשכל הדגלים חסרים.
5. ‏key='core.export' · ‏mOn=()=>false ⇒ ‏true — 'core' אינו ברשימה ⇒
   moduleOn לא נשאל (השקע אף לא נקרא).
6. ‏cfg={} (בלי features בכלל) · key='families.x' ⇒ ‏true — ‏features?. סלחני.
7. ‏features={'families.x':true} · key='families.x.y' ⇒ ‏true — רק false מכבה;
   true מפורש אינו שונה מחסר.
**מוצא:** maor/src/lib/config.ts:40-52 (‏featureOn — לב חוזה-הדגלים, 176 דגלים).
השכן moduleOn והקבוע NAV_MODULE_KEYS הפכו לשקעים (חוק-1 + חוק-5).
