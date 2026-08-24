# חוזה · חוט plan-demo-cleanup
**תפקיד:** תכנון ניקוי נתוני-דמו (public/demo.json) שהתערבבו בנתונים האמיתיים
(ממצא-בעלים 23.8) — טהור ואימוטבילי. הזיהוי לפי **תוכן** ולא לפי id: לכל אחת
מ-19 ישויות-הבסיס (families/supporters/courses/…/warehouse) נבנית טביעת-אצבע
משדות-זיהוי יציבים (FP_FIELDS פנימי; join ב-''); רשומה שטביעתה מופיעה
ב-demoDb — מוסרת. אחר-כך **מפל** לפי ה-id-בפועל של האבות שהוסרו:
enrollments (memberId של חבר-משפחת-דמו או courseId של חוג-דמו) ·
deliveries (dayId/volunteerId/assignmentId/familyId) ·
shopAssignments (productId/famId) · tzBoxes (coordinatorId/famId).
demoDb ריק/חסר לישות ⇒ הישות מדולגת (ואותה הפניה נשמרת ב-cleaned).
removed פר-ישות: count מצטבר (בסיס+מפל) + עד 8 שמות-תצוגה
(name→title→id, ריק ⇒ '(ללא שם)').
**קלט:** db · demoDb (חלקי). **פלט:** {cleaned, total, removed}.
**דוגמאות מחייבות (db: families=[כהן(id f1, members[{id:'m1'}]), לוי(f2)] ·
courses=[ציור(c1), נגרות(c2)] · enrollments=[e1{memberId:'m1',courseId:'c2'},
e2{memberId:'m9',courseId:'c1'}, e3{memberId:'m9',courseId:'c2'}] · rooms=[חדר-אמת] ·
demoDb: families=[כהן בשדות-זהים אך id שונה] · courses=[ציור]):**
‏removed.families={count:1,names:['כהן']} · ‏removed.courses.count=1 ·
‏removed.enrollments.count=2 (e1 דרך חבר-משפחה m1, e2 דרך חוג-דמו c1) ·
‏total=4 · ‏cleaned.families=[f2] · ‏cleaned.enrollments=[e3] ·
‏cleaned.rooms===db.rooms (אין דמו לישות ⇒ אותה הפניה) ·
‏db.families נשאר באורך 2 (אימוטביליות) ·
‏demoDb ריק לגמרי ⇒ total=0 ו-removed={}.
**מוצא:** חולץ כלשונו מ-maor/src/lib/demoCleanup.ts:37-138 (כולל העוזרים-הפרטיים
FP_FIELDS · ROOT_ENTITIES · fingerprint · nameOf — אינם exports-שכנים).
