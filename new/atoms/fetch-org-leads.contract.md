# חוזה · חוט fetch-org-leads
**תפקיד:** כל הלידים של "נחזור אליכם" — אוסף-הפלטפורמה `platformLeads`
(create-only ציבורי; קריאה = מיילי-על בלבד לפי Rules, ללוח-הבקרה). כל מסמך ⇒
‏`{ id: <מזהה-המסמך>, ...שדות-הליד }`. אוסף-ריק ⇒ `[]`; כשל-קריאה
(הרשאה/רשת) ⇒ **זורק**.
**שקעים (חוק-1 — קריאות-חוץ הוזרקו כפרמטרים):**
- ‏db — מסד-הענן (במקור: ‏cloudDb()).
- ‏fs — ערכת-Firestore: ‏{ getDocs, collection }.
**קלט:** ‏db · ‏fs. **פלט:** ‏Promise<Array<{id, ...}>>.
**דוגמאות מחייבות** (בכולן ‏fs מזויף שמתעד קריאות):
1. ‏snap.docs=[{id:'L1',data:()=>({name:'דוד',phone:'0521112223'})},
   {id:'L2',data:()=>({name:'שרה',at:'2026-08-01'})}] ⇒
   ‏[{id:'L1',name:'דוד',phone:'0521112223'},{id:'L2',name:'שרה',at:'2026-08-01'}].
2. ‏snap.docs=[] ⇒ ‏[] — אין לידים.
3. חיווט-הנתיב: ‏collection נקרא עם ‏(db,'platformLeads') — אוסף-שורש, בלי slug.
4. ‏getDocs דוחה (Error 'permission-denied') ⇒ הפונקציה **זורקת**.
5. המזהה מוזרק ראשון: ‏doc {id:'L9',data:()=>({name:'גד'})} ⇒ ‏{id:'L9',name:'גד'}.
**מוצא:** maor/src/lib/cloudConfig.ts:327-334 (‏fetchOrgLeads — "כל הלידים —
לוח הבקרה"). ‏cloudDb/ערכת-Firestore הפכו לשקעים (חוק-1); 'platformLeads' =
ערך PLATFORM_LEADS מהמקור (שם-סכמה, לא סוד).
