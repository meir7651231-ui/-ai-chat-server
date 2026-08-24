# חוזה · חוט approve-member
**תפקיד:** אישור בקשת-הצטרפות (טהור) — בונה את רשימת-החברים המעודכנת:
החברים הקיימים מנורמלים (trim + אותיות-קטנות), המייל המאושר מנורמל דרך
שקע-הנירמול ומצורף, וכפילויות מסולקות (Set — המופע הראשון שורד, הסדר נשמר).
מוחזר אובייקט-עדכון ‏{members} בלבד (לא הארגון כולו); הארגון הנכנס לא משוכתב.
**שקעים (חוק-1 — קריאת-שכן הוזרקה כפרמטר):**
- ‏normEmail(email) — מנרמל-מייל (בקוד-המקור: ‏trim().toLowerCase(), זהה
  להשוואת ה-Rules).
**קלט:** ‏org (‏{members?: string[]}) · ‏email (מחרוזת) · שקע-normEmail.
**פלט:** ‏{members: string[]}.
**דוגמאות מחייבות** (בכולן ‏nrm=(e)=>e.trim().toLowerCase()):
1. ‏org={members:['A@b.com ']} · ‏email='c@D.com' ⇒
   ‏{members:['a@b.com','c@d.com']} — הקיים נורמל, החדש צורף מנורמל.
2. כפילות: ‏org={members:['a@b.com']} · ‏email='  A@B.com ' ⇒
   ‏{members:['a@b.com']} — לא נוסף פעמיים.
3. ‏org={} (בלי members) · ‏email='x@y.co.il' ⇒ ‏{members:['x@y.co.il']}.
4. כפילות פנימית קיימת: ‏org={members:['a@b.com',' A@b.com ']} · ‏email='c@d.com'
   ⇒ ‏{members:['a@b.com','c@d.com']} — הנירמול איחד גם כפילי-עבר.
5. immutability: אחרי דוגמה 1, ‏org.members עדיין ‏['A@b.com '].
**מוצא:** maor/src/components/platform/lib.ts:249-253 (‏approveMember —
"מוסיף ל-members בלי כפילויות, מנורמל; ללא דריסות = מלא", היררכיית ORGADMIN).
השכן normEmail הפך לשקע (חוק-1).
