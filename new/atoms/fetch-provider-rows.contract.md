# חוזה · חוט fetch-provider-rows
**תפקיד:** רשומות-הספק ה**מלאות** מאוסף `incomingPayments` הסקופי — **כל**
הסטטוסים (גם handled), מסוננות לפי `provider` (🐛 23.8, "זה לא נכנס במקום
הנכון": הריפוי בכרטיסים צריך גם מזהי-עסקאות וגם פרטי-קשר). כל מסמך ⇒
‏`{ id: <מזהה-המסמך>, ...שדות-המסמך }`. אוסף-ריק ⇒ `[]` (הצלחה); כשל-קריאה
אמיתי (הרשאה/רשת) ⇒ **זורק** — לא נבלע.
**שקעים (חוק-1 — קריאות-חוץ הוזרקו כפרמטרים; אותה ערכה כמו fetch-incoming-payments):**
- ‏db — מסד-הענן (במקור: ‏requireDb()).
- ‏scopedCol(name) — שם-אוסף ⇒ נתיב סקופי-לארגון.
- ‏fs — ערכת-Firestore: ‏{ getDocs, query, collection, where }.
**קלט:** ‏provider (string) · ‏db · ‏scopedCol · ‏fs. **פלט:** ‏Promise<Array<{id, ...}>>.
**דוגמאות מחייבות** (בכולן ‏fs מזויף שמתעד קריאות):
1. ‏snap.docs=[{id:'r1',data:()=>({amount:120,status:'handled'})},
   {id:'r2',data:()=>({amount:75,status:'pending'})}] ⇒
   ‏[{id:'r1',amount:120,status:'handled'},{id:'r2',amount:75,status:'pending'}] —
   גם handled נכלל (להבדיל מ-fetch-incoming-payments).
2. ‏snap.docs=[] ⇒ ‏[] — אוסף-ריק הוא הצלחה, לא שגיאה.
3. חיווט-השאילתה: ‏collection נקרא עם ‏(db, scopedCol('incomingPayments')) —
   עם ‏scopedCol=(c)=>'orgs/demo/'+c ⇒ הנתיב 'orgs/demo/incomingPayments';
   ‏where נקרא עם ‏('provider','==','nedarim') — הארגומנט provider מושחל כלשונו.
4. ‏getDocs דוחה (Error 'permission-denied') ⇒ הפונקציה **זורקת** (לא בולעת).
5. מזהה-המסמך מוזרק ראשון: ‏doc {id:'r9',data:()=>({sum:2})} ⇒ ‏{id:'r9',sum:2}.
**מוצא:** maor/src/lib/cloud.ts:678-682 (‏fetchProviderRows, תיקון 23.8).
‏requireDb/scopedCol/ערכת-Firestore הפכו לשקעים (חוק-1).
