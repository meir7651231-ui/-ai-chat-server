# חוזה · חוט course-fits-member
**תפקיד:** התאמת חוג לחבר/ה — מגדר, טווח-גיל וכיתה. פילטר רך: מידע חסר
(מגדר/גיל לא ידועים) לא פוסל — פוסלים רק על אי-התאמה מפורשת.
**שקע (חוק-1 — קריאת-שכן הוזרקה כפרמטר):**
- ‏gradeFits(c, grade) ⇒ boolean — התאמת-כיתה (בקוד-המקור: gradeFits של
  courses/lib; grade מועברת רק כש-courses.gradeimg פעיל — פער 28).
**קלט:** ‏c (‏{gender?, ageMin?, ageMax?, …}) · ‏gender ('m'/'f'/undefined) ·
‏age (מספר או null) · ‏grade (אופציונלי) · השקע gradeFits.
**פלט:** boolean — האם החוג מתאים.
**דוגמאות מחייבות** (בכולן, אלא-אם-צוין, ‏gradeFits=()=>true):
1. ‏c={gender:'f'} · ‏gender='m' · ‏age=null ⇒ false (מגדר לא תואם).
2. ‏c={gender:'all'} · ‏gender='m' ⇒ true ('all' פתוח לכולם).
3. ‏c={gender:'f'} · ‏gender=undefined ⇒ true (מגדר לא ידוע — לא פוסלים).
4. ‏c={ageMin:6, ageMax:12} · ‏age=5 ⇒ false · ‏age=6 ⇒ true ·
   ‏age=12 ⇒ true · ‏age=13 ⇒ false (הגבולות כוללניים).
5. ‏c={ageMin:6, ageMax:12} · ‏age=null ⇒ true (גיל לא ידוע — מדלגים).
6. ‏gradeFits=()=>false ⇒ false גם כשמגדר+גיל תואמים.
7. השקע נקרא עם (c, grade) בדיוק — ‏grade='ג' מושחל כמו-שהוא.
**מוצא:** maor/src/components/courses/lib.ts:477-491 (‏courseFitsMember).
השכן gradeFits הפך לשקע (חוק-1).
