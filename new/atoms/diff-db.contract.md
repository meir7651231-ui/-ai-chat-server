# חוזה · חוט diff-db
**תפקיד:** השוואת שני מצבי-DB ⇒ סט-הפעולות המינימלי מול Firestore:
‏sets (יצירה/עדכון — doc פר-ישות) · ‏deletes (לפי id) · ‏meta (המסמך המלא
כשאחד ממפתחות-ה-meta השתנה, אחרת null). פר-אוסף: רשימה זהה-רפרנס (===)
מדולגת בזול; אחרת השוואה פר-ישות לפי id בשוויון-JSON — ישות חדשה/שונה ⇒ set,
ישות שנעלמה ⇒ delete. טהור.
**שקעים (חוק-1 — קריאות-השכן הוזרקו כפרמטרים):**
- ‏entityCollections — רשימת שמות-אוספי-הישויות (שם-האוסף = שם-השדה ב-Db;
  במקור: 23 האוספים של ENTITY_COLLECTIONS — קיים כאטום-קבוע entity-collections).
- ‏metaKeys — מפתחות-ה-Db שנבדקים לשינוי-meta (במקור META_KEYS; ‏savedAt
  מוחרג במכוון — משתנה בכל שמירה, רעש).
- ‏sameJson(a,b)→boolean — שוויון: ‏=== או JSON.stringify זהה.
- ‏metaOf(db)→object — גוף מסמך meta/org המלא.
**קלט:** ‏prev, next (אובייקטי-DB) + 4 השקעים.
**פלט:** ‏{ sets:[{col,id,data}], deletes:[{col,id}], meta:object|null }.
**דוגמאות מחייבות (entityCollections=['families','rooms'],
metaKeys=['orgName','seq'], sameJson=שוויון-JSON,
metaOf=(db)=>({orgName:db.orgName,seq:db.seq,savedAt:db.savedAt});
‏prev={families:[{id:'f1',name:'כהן'},{id:'f2',name:'לוי'}],rooms:[{id:'r1',cap:10}],
orgName:'מאור',seq:5,savedAt:'t1'} ·
‏next={families:[{id:'f1',name:'כהן-לוי'},{id:'f3',name:'ברק'}],
rooms:prev.rooms (אותה רפרנס!),orgName:'מאור',seq:6,savedAt:'t2'}):**
1. ‏sets: בדיוק 2 — ‏{col:'families',id:'f1',data:{id:'f1',name:'כהן-לוי'}}
   (השתנה) ו-‏{col:'families',id:'f3',data:{id:'f3',name:'ברק'}} (חדש);
   ‏rooms לא מופיע כלל (דילוג-===).
2. ‏deletes: בדיוק 1 — ‏{col:'families',id:'f2'}.
3. ‏meta (seq ‏5→6 ∈ metaKeys) = ‏{orgName:'מאור',seq:6,savedAt:'t2'}
   (המסמך המלא מ-metaOf, כולל savedAt).
4. ‏diffDb(prev,prev,...) ⇒ ‏{sets:[],deletes:[],meta:null}.
5. עותק-עמוק שווה-ערך (מערכים חדשים, אותם ערכים, savedAt שונה בלבד) ⇒
   ‏sets=[] · ‏deletes=[] · ‏meta=null (savedAt מחוץ ל-metaKeys — אפס-רעש).
**מוצא:** חולץ כלשונו מ-maor/src/lib/cloud-diff.ts:147-172; השכנים
ENTITY_COLLECTIONS/META_KEYS/sameJson/metaOf שוקעו (חוק-1).
