# חוזה · חוט is-admin-user
**תפקיד:** האם המשתמש הנוכחי מנהל-על. רשימת ‏adminEmails ריקה/חסרה = אין
הגבלה (‏true לכולם — התנהגות-הלגאסי). רשימה מוגדרת = רק מי שמיילו בה,
בהשוואת ‏trim+lowercase דו-צדדית. בלי מייל מול רשימה מוגדרת = לא-אדמין.
**קלט:** ‏config — אובייקט עם ‏adminEmails?: string[] · ‏email —
מחרוזת/null/undefined.
**פלט:** בוליאני.
**הערת חוק-6:** המיילים עצמם הם קונפיגורציית-הצבה — מוזרקים דרך ‏config
בזמן-חיווט; החוט לא נושא שום זהות.
**דוגמאות מחייבות:**
1. ‏config={}, email='anyone@x.com' ⇒ ‏true — אין רשימה = אין הגבלה.
2. ‏config={adminEmails:[]}, email=null ⇒ ‏true — רשימה ריקה = אין הגבלה.
3. ‏config={adminEmails:['a@b.com']}, email=null ⇒ ‏false — רשימה מוגדרת
   בלי מייל.
4. ‏config={adminEmails:[' A@B.Com ']}, email='a@b.com' ⇒ ‏true —
   ‏trim+lowercase על צד-הרשימה.
5. ‏config={adminEmails:['a@b.com']}, email='  A@B.COM ' ⇒ ‏true —
   ‏trim+lowercase על צד-המייל.
6. ‏config={adminEmails:['a@b.com']}, email='z@b.com' ⇒ ‏false — לא ברשימה.
7. ‏config={adminEmails:['a@b.com']}, email='' ⇒ ‏false — מחרוזת ריקה
   נחשבת כאין-מייל.
**מוצא:** maor/src/lib/config.ts:673-686 (‏isAdminUser). עצמאי — אפס שקעים.
