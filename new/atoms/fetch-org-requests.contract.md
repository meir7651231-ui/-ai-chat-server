# חוזה · חוט fetch-org-requests
**תפקיד:** כל בקשות-ההרשמה הממתינות של הפלטפורמה — אוסף `platformRequests`
(מסמך פר-משתמש-נרשם; קריאה = מיילי-על בלבד לפי Rules, ללוח-הבקרה). כל מסמך ⇒
‏`{ uid: <מזהה-המסמך>, ...שדות-הבקשה }` (כולל פרופיל-האשף SIGNUP3:
industry/size/needs). אוסף-ריק ⇒ `[]`; כשל-קריאה (הרשאה/רשת) ⇒ **זורק**.
**שקעים (חוק-1 — קריאות-חוץ הוזרקו כפרמטרים):**
- ‏db — מסד-הענן (במקור: ‏cloudDb()).
- ‏fs — ערכת-Firestore: ‏{ getDocs, collection }.
**קלט:** ‏db · ‏fs. **פלט:** ‏Promise<Array<{uid, ...}>>.
**דוגמאות מחייבות** (בכולן ‏fs מזויף שמתעד קריאות):
1. ‏snap.docs=[{id:'uidA',data:()=>({orgName:'חסד-לציון',phone:'031234567',
   industry:'chesed'})},{id:'uidB',data:()=>({orgName:'בית-מדרש',size:'small'})}] ⇒
   ‏[{uid:'uidA',orgName:'חסד-לציון',phone:'031234567',industry:'chesed'},
   {uid:'uidB',orgName:'בית-מדרש',size:'small'}].
2. ‏snap.docs=[] ⇒ ‏[] — אין בקשות ממתינות.
3. חיווט-הנתיב: ‏collection נקרא עם ‏(db,'platformRequests') — אוסף-שורש.
4. ‏getDocs דוחה (Error 'permission-denied') ⇒ הפונקציה **זורקת**.
5. המזהה נכנס לשדה ‏uid: ‏doc {id:'u3',data:()=>({orgName:'אור'})} ⇒
   ‏{uid:'u3',orgName:'אור'}.
**מוצא:** maor/src/lib/cloudConfig.ts:178-189 (‏fetchOrgRequests — "כל הבקשות
הממתינות — לוח הבקרה"). ‏cloudDb/ערכת-Firestore הפכו לשקעים (חוק-1);
'platformRequests' = ערך PLATFORM_REQUESTS מהמקור (שם-סכמה, לא סוד).
