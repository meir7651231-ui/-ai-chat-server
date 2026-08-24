# חוזה · חוט set-employee-override
**תפקיד:** קביעת **כרטיס-עובד** (היררכיית ORGADMIN — דריסות אישיות פר-מייל,
רק-הגבלה) בטהרה: כותב/מעדכן את דריסות המייל המנורמל במפת ‏memberConfigs
ומחזיר אובייקט-עדכון ‏{memberConfigs} בלבד (לא הארגון כולו). הכרטיס החדש
**מחליף** את הקודם של אותו מייל במלואו (לא מיזוג); הארגון הנכנס לא משוכתב.
**שקעים (חוק-1 — קריאת-שכן הוזרקה כפרמטר):**
- ‏normEmail(email) — מנרמל-מייל (בקוד-המקור: ‏trim().toLowerCase(), זהה
  להשוואת ה-Rules).
**קלט:** ‏org (‏{memberConfigs?: Record<string, EmployeeOverride>}) · ‏email
(מחרוזת) · ‏override (‏EmployeeOverride — ‏{modules?, features?, weeklyGoal?,
purposes?…}; ‏{} ריק = "רואה כמו הארגון") · שקע-normEmail.
**פלט:** ‏{memberConfigs: Record<string, EmployeeOverride>} — מפה חדשה.
**דוגמאות מחייבות** (בכולן ‏nrm=(e)=>e.trim().toLowerCase()):
1. ארגון בלי מפה: ‏org={} · ‏email='  A@B.com ' · ‏override={modules:{shop:false}}
   ⇒ ‏{memberConfigs:{'a@b.com':{modules:{shop:false}}}} — המפתח מנורמל,
   הפריסה ‏{...undefined} תקפה.
2. החלפה מלאה: ‏org={memberConfigs:{'a@b.com':{features:{x:false}}}} ·
   ‏email='a@b.com' · ‏override={modules:{shop:false}} ⇒ הכרטיס החדש **מחליף**
   — ‏memberConfigs['a@b.com']={modules:{shop:false}} בלי ‏features (לא מיזוג).
3. שכנים נשמרים: ‏org={memberConfigs:{'b@c.com':{weeklyGoal:5}}} ·
   ‏email='a@b.com' · ‏override={} ⇒ שני מפתחות — ‏'b@c.com' (כרטיסו בזהות-
   הפניה) וגם ‏'a@b.com':{}.
4. הכרטיס עובר **בזהות-הפניה** (לא עותק): הערך במפה ‏=== override שנשלח.
5. immutability: אחרי דוגמה 2, ‏org.memberConfigs המקורי עדיין
   ‏{'a@b.com':{features:{x:false}}} — מוחזרת מפה חדשה בהפניה.
**מוצא:** maor/src/components/platform/lib.ts:256-265 (‏setEmployeeOverride —
"קביעת כרטיס-עובד (טהור) — כותב/מעדכן את דריסות המייל"). השכן ‏normEmail
הפך לשקע (חוק-1), כתקדים ‏approve-member.
