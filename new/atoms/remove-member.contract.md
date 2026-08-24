# חוזה · חוט remove-member
**תפקיד:** הסרת עובד/ת מארגון (טהור) — מוציא את המייל גם מרשימת-החברים
(‏members, כשכל הרשימה מנורמלת trim+אותיות-קטנות אגב-כך) וגם מכרטיסי-העובדים
(‏memberConfigs). מוחזר אובייקט-עדכון ‏{members, memberConfigs} בלבד;
הארגון הנכנס לא משוכתב. (המקור מציין: מנהל לא ניתן להסרה כאן — אכיפה בקופסה.)
**שקעים (חוק-1 — קריאת-שכן הוזרקה כפרמטר):**
- ‏normEmail(email) — מנרמל-מייל (בקוד-המקור: ‏trim().toLowerCase()).
**קלט:** ‏org (‏{members?: string[], memberConfigs?: Record<string,object>}) ·
‏email (מחרוזת) · שקע-normEmail. **פלט:** ‏{members: string[], memberConfigs}.
**דוגמאות מחייבות** (בכולן ‏nrm=(e)=>e.trim().toLowerCase()):
1. ‏org={members:['a@b.com','c@d.com'], memberConfigs:{'a@b.com':{limited:true}}} ·
   ‏email='  A@B.com ' ⇒ ‏{members:['c@d.com'], memberConfigs:{}} —
   הוסר מהרשימה ומהכרטיסים, אחרי נירמול המייל הנכנס.
2. צורה גולמית ברשימה: ‏org={members:[' A@b.com ','c@d.com']} · ‏email='a@b.com'
   ⇒ ‏members=['c@d.com'] — גם רשומת-עבר לא-מנורמלת מוסרת (הרשימה מנורמלת לפני הסינון).
3. מייל שאינו חבר: ‏org={members:['x@y.com'], memberConfigs:{'x@y.com':{limited:false}}} ·
   ‏email='z@w.com' ⇒ ‏{members:['x@y.com'], memberConfigs:{'x@y.com':{limited:false}}} —
   אין-שינוי-תוכן (אך members מוחזר מנורמל).
4. ‏org={} (בלי members ובלי memberConfigs) · ‏email='a@b.com' ⇒
   ‏{members:[], memberConfigs:{}}.
5. immutability: אחרי דוגמה 1, ‏org.members עדיין ‏['a@b.com','c@d.com']
   ו-‏org.memberConfigs עדיין מכיל את ‏'a@b.com'.
**מוצא:** maor/src/components/platform/lib.ts:266-276 (‏removeMember —
"מוציא מ-members ומ-memberConfigs", היררכיית ORGADMIN).
השכן normEmail הפך לשקע (חוק-1).
