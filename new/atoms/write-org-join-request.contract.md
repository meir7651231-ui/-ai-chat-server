# חוזה · חוט write-org-join-request
**תפקיד:** עובד/ת שולח/ת בקשת-הצטרפות לארגון — כתיבת המסמך
‏platformOrgs/{slug}/joinRequests/{uid} (תת-אוסף של מסמך-הארגון, ORGADMIN).
‏create-only ע"י המבקש (uid==auth.uid נאכף ב-Rules v3, לא כאן). הכתיבה
**מלאה, בלי merge** — שליחה-חוזרת מחליפה את הבקשה הקודמת של אותו uid
(לא מצטברת). הבקשה עוברת **עיקור-JSON** (מפיל ‏undefined, מנתק הפניה).
**שקעים (חוק-1 — firebase/firestore הוזרק כאובייקט fs):**
- ‏fs.db — ידית מסד-הענן (במקור: ‏cloudDb()).
- ‏fs.doc(db, col, id, subcol, subid) — הפניית-מסמך בתת-אוסף (5 מקטעים).
- ‏fs.setDoc(ref, data) ⇒ ‏Promise — הכתיבה.
(‏'platformOrgs' = PLATFORM_ORGS מהמקור · ‏'joinRequests' — שמות-סכמה, מוטבעים.)
**קלט:** ‏slug · ‏uid · ‏req (‏{email?,name?,phone?,code?,at?}) · ‏fs.
**פלט:** ‏Promise<void> (undefined).
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. עדות-נתיב: ‏('kehila','U1',{email:'a@b.com'}) ⇒ ‏doc נקרא בדיוק פעם אחת עם
   חמשת המקטעים ‏(db,'platformOrgs','kehila','joinRequests','U1'), ו-setDoc
   עם ההפניה ש-doc החזיר.
2. **בלי merge:** ‏setDoc נקרא עם **שני ארגומנטים בדיוק** (ref, data) — אין
   ארגומנט-אופציות ⇒ החלפת-מסמך מלאה.
3. ‏req={name:'ענת', phone:'0521112223', code:'J7', at:'2026-08-24'} ⇒ הנכתב
   ‏deep-equal ל-req אך ‏!== ממנו (עיקור-JSON מנתק הפניה).
4. עיקור-undefined: ‏req={email:'a@b.com', code:undefined} ⇒ נכתב
   ‏{email:'a@b.com'} — המפתח ‏code לא קיים כלל.
5. ‏setDoc שנדחה (reject 'permission-denied') ⇒ השגיאה מבעבעת — אין בליעה
   (מסך-ההמתנה מציג את הכשל — reqStatus).
**מוצא:** maor/src/lib/cloudConfig.ts:211-214 (‏writeOrgJoinRequest, ORGADMIN).
‏cloudDb/doc/setDoc הפכו לשקעי-fs (חוק-1).
