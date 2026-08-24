# חוזה · חוט fetch-org-join-requests
**תפקיד:** המנהל מושך את בקשות-ההצטרפות הממתינות של עובדות לארגון שלו —
תת-האוסף `platformOrgs/{slug}/joinRequests` (ORGADMIN). כל מסמך ⇒
‏`{ uid: <מזהה-המסמך>, ...שדות-הבקשה }`. אוסף-ריק ⇒ `[]`; כשל-קריאה
(הרשאה/רשת) ⇒ **זורק** (אין נפילה-רכה — זו פעולת-מנהל מפורשת).
**שקעים (חוק-1 — קריאות-חוץ הוזרקו כפרמטרים):**
- ‏db — מסד-הענן (במקור: ‏cloudDb()).
- ‏fs — ערכת-Firestore: ‏{ getDocs, collection }.
**קלט:** ‏slug (מחרוזת) · ‏db · ‏fs. **פלט:** ‏Promise<Array<{uid, ...}>>.
**דוגמאות מחייבות** (בכולן ‏fs מזויף שמתעד קריאות):
1. ‏snap.docs=[{id:'u1',data:()=>({email:'a@b.com',name:'רחל'})},
   {id:'u2',data:()=>({email:'c@d.com'})}] · ‏slug='demo' ⇒
   ‏[{uid:'u1',email:'a@b.com',name:'רחל'},{uid:'u2',email:'c@d.com'}].
2. ‏snap.docs=[] ⇒ ‏[] — אין בקשות ממתינות.
3. חיווט-הנתיב: ‏collection נקרא עם ‏(db,'platformOrgs','demo','joinRequests')
   — 4 מקטעים: אוסף-הפלטפורמה, ה-slug, ותת-האוסף.
4. ‏getDocs דוחה (Error 'permission-denied') ⇒ הפונקציה **זורקת**.
5. המזהה נכנס לשדה ‏uid: ‏doc {id:'u9',data:()=>({email:'x@y.z'})} ⇒
   ‏{uid:'u9',email:'x@y.z'}.
**מוצא:** maor/src/lib/cloudConfig.ts:217-222 (‏fetchOrgJoinRequests, Rules v3 —
קריאה=מנהל+מייל-על). ‏cloudDb/ערכת-Firestore הפכו לשקעים (חוק-1); 'platformOrgs'
= ערך PLATFORM_ORGS מהמקור (שם-סכמה, לא סוד).
