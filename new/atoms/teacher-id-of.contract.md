# חוזה · חוט teacher-id-of
**תפקיד:** ה-teacherId הממופה למייל-מורה במפת ‏config.roles.teachers —
התאמה סלחנית (‏trim+lowercase בשני הצדדים, גם על מפתחות-המפה); אין
התאמה / אין מייל / אין מפה ⇒ ‏null.
**קלט:** ‏config (‏{roles?:{teachers?:{[email]:teacherId}}}) · ‏email
(מחרוזת/null/undefined). **פלט:** ‏teacherId (מחרוזת) או ‏null.
**דוגמאות מחייבות** (‏cfg = ‏{roles:{teachers:{' Rivka@X.co ':'t1', 'sara@x.co':'t2'}}}):
1. ‏(cfg, 'rivka@x.co') ⇒ ‏'t1' (מפתח-המפה עם רווחים/רישיות — מנורמל).
2. ‏(cfg, ' SARA@X.CO ') ⇒ ‏'t2' (המייל-הנבדק מנורמל).
3. ‏(cfg, 'nobody@x.co') ⇒ ‏null (אין מיפוי).
4. ‏(cfg, '') וגם ‏(cfg, null) ⇒ ‏null (בלי מייל אין חיפוש).
5. ‏({}, 'sara@x.co') ⇒ ‏null (אין ‏roles.teachers כלל).
**מוצא:** maor/src/lib/config.ts:660-666 (‏teacherIdOf — אפליקציית-מורה,
‏courses.teacherapp).
