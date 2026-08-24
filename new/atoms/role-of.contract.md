# חוזה · חוט role-of
**תפקיד:** גזירת תפקיד-המשתמש מהקונפיג לפי מייל: מייל ריק/חסר ⇒ 'staff';
מופיע ב-adminEmails ⇒ 'admin' (בדיקה ראשונה — מנצח מורה); מופיע כמפתח
ב-roles.teachers ⇒ 'teacher'; אחרת 'staff'. כל ההשוואות חסינות-רישיות
ורווחי-קצה (trim+lowercase בשני הצדדים). טהור, סינכרוני, אפס שקעים.
**קלט:** ‏config — ‏{adminEmails?: string[], roles?: {teachers?: Record<מייל,
teacherId>}} · ‏email — מחרוזת או undefined/null.
**פלט:** 'admin' | 'teacher' | 'staff'.
**דוגמאות מחייבות** (‏C={adminEmails:[' Admin@X.com '],
roles:{teachers:{' Tea@X.com ':'t1', 'b@y.com':'t2'}}}):
1. ‏roleOf(C,'admin@x.com') ⇒ 'admin' — רישיות+רווחים בצד-הקונפיג מנוקים.
2. ‏roleOf(C,'  TEA@x.COM ') ⇒ 'teacher' — ניקוי גם בצד-הקלט.
3. ‏roleOf(C,'b@y.com') ⇒ 'teacher'.
4. ‏roleOf(C,'zar@z.com') ⇒ 'staff' — לא מוכר.
5. ‏roleOf(C,'') ⇒ 'staff' · ‏roleOf(C,undefined) ⇒ 'staff' — מייל ריק לפני הכול.
6. מייל שהוא גם admin וגם teacher ⇒ 'admin'
   (‏C2={adminEmails:['x@x.com'], roles:{teachers:{'x@x.com':'t9'}}}).
7. ‏roleOf({}, 'a@b.com') ⇒ 'staff' — קונפיג בלי adminEmails/roles (optional
   chaining, לא נפילה).
**מוצא:** maor/src/lib/config.ts:650-659 (‏roleOf). חולץ כלשונו; טהור לגמרי —
המיילים עצמם הם קלט-ריצה, לא קבוע באטום (חוק-6).
