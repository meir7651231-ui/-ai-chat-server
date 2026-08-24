# חוזה · חוט fetch-incoming-payments
**תפקיד:** משיכת התשלומים ה**ממתינים** ("💰 תשלומים נכנסים") מאוסף
`incomingPayments` הסקופי — רק מסמכים עם `status=='pending'`. כל מסמך ⇒
‏`{ id: <מזהה-המסמך>, ...שדות-המסמך }`. אוסף-ריק ⇒ `[]` (הצלחה); כשל-קריאה
אמיתי (הרשאה/רשת) ⇒ **זורק** — ה-caller מבחין בין "אין תשלומים" ל"תקלת-חיבור"
(לא מציג 'הכול מסונכרן' שגוי בזמן תקלה).
**שקעים (חוק-1 — קריאות-חוץ הוזרקו כפרמטרים):**
- ‏db — מסד-הענן (במקור: ‏requireDb()).
- ‏scopedCol(name) — שם-אוסף ⇒ נתיב סקופי-לארגון (במקור: ‏colPath(slug, cloudRoot, name)).
- ‏fs — ערכת-Firestore: ‏{ getDocs, query, collection, where }.
**קלט:** ‏db · ‏scopedCol · ‏fs. **פלט:** ‏Promise<Array<{id, ...}>>.
**דוגמאות מחייבות** (בכולן ‏fs מזויף שמתעד קריאות):
1. ‏snap.docs=[{id:'p1',data:()=>({amount:120,status:'pending'})},
   {id:'p2',data:()=>({amount:75,status:'pending'})}] ⇒
   ‏[{id:'p1',amount:120,status:'pending'},{id:'p2',amount:75,status:'pending'}].
2. ‏snap.docs=[] ⇒ ‏[] — אוסף-ריק הוא הצלחה, לא שגיאה.
3. חיווט-השאילתה: ‏collection נקרא עם ‏(db, scopedCol('incomingPayments')) —
   עם ‏scopedCol=(c)=>'orgs/demo/'+c ⇒ הנתיב 'orgs/demo/incomingPayments';
   ‏where נקרא עם ‏('status','==','pending').
4. ‏getDocs דוחה (Error 'permission-denied') ⇒ הפונקציה **זורקת** (לא בולעת).
5. מזהה-המסמך מוזרק ראשון: ‏doc {id:'p9',data:()=>({sum:1})} ⇒ ‏{id:'p9',sum:1}.
**מוצא:** maor/src/lib/cloud.ts:670-677 (‏fetchIncomingPayments, תיקון 20.8 —
"כשל-קריאה ⇒ זורק"). ‏requireDb/scopedCol/ערכת-Firestore הפכו לשקעים (חוק-1).
