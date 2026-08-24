# חוזה · חוט fetch-org-cloud-config
**תפקיד:** משיכה חד-פעמית של מסמך-הארגון מהפלטפורמה — `platformOrgs/{slug}`.
מסמך קיים ⇒ תוכן-המסמך (‏data()); לא-קיים ⇒ `null`; **כל כשל** (הרשאה/רשת)
⇒ `null` — נפילה רכה במכוון: כשל-ענן לא עוצר עבודה מקומית (בניגוד לחוטי-fetch
של לוח-הבקרה, שזורקים).
**שקעים (חוק-1 — קריאות-חוץ הוזרקו כפרמטרים):**
- ‏db — מסד-הענן (במקור: ‏cloudDb()).
- ‏fs — ערכת-Firestore: ‏{ getDoc, doc }.
**קלט:** ‏slug (מחרוזת) · ‏db · ‏fs. **פלט:** ‏Promise<object|null>.
**דוגמאות מחייבות** (בכולן ‏fs מזויף שמתעד קריאות):
1. ‏snap={exists:()=>true, data:()=>({orgName:'מאור',enabled:true})} ·
   ‏slug='demo' ⇒ ‏{orgName:'מאור',enabled:true}.
2. ‏snap={exists:()=>false, data:()=>({})} ⇒ ‏null — מסמך לא-קיים.
3. חיווט-הנתיב: ‏doc נקרא עם ‏(db, 'platformOrgs', 'demo') — האוסף הקבוע
   ‏PLATFORM_ORGS='platformOrgs' + ה-slug כמזהה-המסמך.
4. ‏getDoc דוחה (Error 'permission-denied') ⇒ ‏null — הכשל נבלע, לא זורק.
5. ‏fs.doc עצמו זורק ⇒ ‏null — ה-try עוטף את כל הקריאה.
**מוצא:** maor/src/lib/cloudConfig.ts:96-109 (‏fetchOrgCloudConfig — "null כשאין
או אין הרשאה"). ‏cloudDb/ערכת-Firestore הפכו לשקעים (חוק-1); הקבוע 'platformOrgs'
= ערך-המקור של PLATFORM_ORGS (שם-סכמה, לא סוד — חוק-6 לא חל).
