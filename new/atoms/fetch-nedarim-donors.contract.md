# חוזה · חוט fetch-nedarim-donors
**תפקיד:** משיכת רשימת-התורמים ששוגרה מנדרים (אוסף `nedarimDonors` הסקופי,
staged לסנכרון-כרטיסים). כל מסמך ⇒ ‏`{ toremId: <מזהה-המסמך>, ...שדות-המסמך }`.
אוסף-ריק ⇒ `[]` (הצלחה); כשל-קריאה אמיתי (הרשאה/רשת) ⇒ **זורק** — ה-caller
מבחין בין "אין נתונים" ל"תקלת-חיבור" (תיקון 20.8: לא 'הכול מסונכרן' בזמן תקלה).
**שקעים (חוק-1 — קריאות-חוץ הוזרקו כפרמטרים):**
- ‏db — מסד-הענן (במקור: ‏requireDb()).
- ‏scopedCol(name) — שם-אוסף ⇒ נתיב סקופי-לארגון.
- ‏fs — ערכת-Firestore: ‏{ getDocs, collection }.
**קלט:** ‏db · ‏scopedCol · ‏fs. **פלט:** ‏Promise<Array<{toremId, ...}>>.
**דוגמאות מחייבות** (בכולן ‏fs מזויף שמתעד קריאות):
1. ‏snap.docs=[{id:'t100',data:()=>({name:'ראובן',phone:'0501234567'})},
   {id:'t200',data:()=>({name:'שמעון'})}] ⇒
   ‏[{toremId:'t100',name:'ראובן',phone:'0501234567'},{toremId:'t200',name:'שמעון'}].
2. ‏snap.docs=[] ⇒ ‏[] — אוסף-ריק הוא הצלחה.
3. חיווט: ‏collection נקרא עם ‏(db, scopedCol('nedarimDonors')) — עם
   ‏scopedCol=(c)=>'orgs/root/'+c ⇒ הנתיב 'orgs/root/nedarimDonors'; בלי query/where.
4. ‏getDocs דוחה (Error 'net-down') ⇒ הפונקציה **זורקת** (לא בולעת).
5. המזהה נכנס לשדה ‏toremId (לא ‏id): ‏doc {id:'t7',data:()=>({name:'לוי'})}
   ⇒ ‏{toremId:'t7',name:'לוי'}.
**מוצא:** maor/src/lib/cloud.ts:663-669 (‏fetchNedarimDonors). ‏requireDb/scopedCol/
ערכת-Firestore הפכו לשקעים (חוק-1).
