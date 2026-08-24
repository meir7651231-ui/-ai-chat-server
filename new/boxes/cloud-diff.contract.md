# חוזה · קופסת-חיבורים "מנוע-ה-diff של סנכרון-הענן" (cloud-diff)
**תפקיד:** המנוע-הטהור שמחשב מה לדחוף ל-Firestore — מודל: אוסף פר-סוג-ישות
(‏doc-id = entity-id), ומסמך `meta/org` יחיד לכל שדות-ה-Db שאינם רשימות-ישויות.
מחווט את 11 חוטי-cloud-diff במקום אחד. drop-in ל-`maor/src/lib/cloud-diff.ts`.

**מוצא (מקור-האמת, L4):** `maor/src/lib/cloud-diff.ts` — עוגני-שורה:
- ‏ENTITY_COLLECTIONS — :11-35 · colPath — :45-47 · metaPath — :50-52 · envPath — :59-61
- ‏DONATIONS_COL — :64 · donationsPath — :67-69 · stripSupporterDonations — :75-84
- ‏META_KEYS — :87-105 · metaOf — :117-136 · sameJson — :138-141
- ‏diffDb — :147-170 · fullDbDiff — :173-181 · emptyDiff — :184-186

**הכרעות-הקופסה (חיות בקופסה, לא בחוטים):**
- ‏META_KEYS (15 מפתחות, סדר verbatim) — אילו שדות-meta נבדקים לשינוי; ‏savedAt
  מוחרג במכוון (משתנה בכל שמירה = רעש). מקור: :87-105.
- ‏sameJson(a,b) — אסטרטגיית-ההשוואה: ‏=== או JSON.stringify זהה. מקור: :138-141.

**חשיפה (ה-API המקורי):**
- ‏ENTITY_COLLECTIONS · DONATIONS_COL — קבועים.
- ‏colPath(slug, cloudRoot, col) → string · metaPath(slug, cloudRoot) → string ·
  ‏envPath(slug, cloudRoot) → string · donationsPath(slug, cloudRoot) → string.
- ‏metaOf(db) → object · stripSupporterDonations(diff) → diff · emptyDiff(d) → boolean.
- ‏diffDb(prev, next) → { sets, deletes, meta } · fullDbDiff(db) → { sets, deletes:[], meta }.

**דוגמאות מחייבות:**
1. **נתיבים · cloudRoot=true (לקוח-חי, ביט-זהה):** `colPath('acme', true, 'families') === 'families'` ·
   `metaPath('x', true) === 'meta/org'` · `envPath('x', true) === '_enc/envelope'` ·
   `donationsPath('x', true) === 'donations'`.
2. **נתיבים · cloudRoot=false (פר-ארגון):** `colPath('acme', false, 'families') === 'orgs/acme/families'` ·
   `metaPath('acme', false) === 'orgs/acme/meta/org'` · `envPath('acme', false) === 'orgs/acme/_enc/envelope'` ·
   `donationsPath('acme', false) === 'orgs/acme/donations'`.
3. **diffDb — sets/deletes/meta:** ‏prev={families:[{id:'f1',name:'כהן'},{id:'f2',name:'לוי'}], seq:5, savedAt:'t1'}
   (ושאר 22 האוספים ריקים) · ‏next=אותו-DB אך families=[{id:'f1',name:'כהן-לוי'},{id:'f3',name:'ברק'}], seq:6, savedAt:'t2'
   ⇒ ‏sets=[{col:'families',id:'f1',data:{id:'f1',name:'כהן-לוי'}}, {col:'families',id:'f3',data:{id:'f3',name:'ברק'}}] ·
   ‏deletes=[{col:'families',id:'f2'}] · ‏meta = metaOf(next) (כי seq ∈ META_KEYS השתנה).
4. **diffDb — דילוג-רפרנס + אפס-רעש:** אותו-DB לשני-הצדדים (`diffDb(db, db)`) ⇒ `{sets:[], deletes:[], meta:null}`;
   ורק ‏savedAt השונה (מחוץ ל-META_KEYS) ⇒ ‏meta נשאר null.
5. **fullDbDiff:** ‏db עם ‏families=[{id:'f1'}] ⇒ ‏sets=[{col:'families',id:'f1',data:{id:'f1'}}] ·
   ‏deletes=[] · ‏meta=metaOf(db) (תמיד נבנה).
6. **emptyDiff:** `emptyDiff({sets:[],deletes:[],meta:null}) === true` ·
   `emptyDiff({sets:[{}],deletes:[],meta:null}) === false`.
7. **stripSupporterDonations:** ‏diff עם ‏sets=[{col:'supporters',id:'s1',data:{id:'s1',donations:[{rid:1}]}}, {col:'families',id:'f1',data:{id:'f1',donations:[9]}}]
   ⇒ מסמך-התומך מקבל ‏donations:[] · מסמך-המשפחה ללא-שינוי (רק supporters מנוקה).
8. **metaOf:** ‏db={orgName:'מאור', seq:3, savedAt:'t', foo:'התעלם'} ⇒ אובייקט עם 16 המפתחות
   (‏META_KEYS + savedAt) בלבד; ‏foo לא נכלל.

**שקעי-IO (גבול-הקופסה — לא בקופסה):** ההשוואה טהורה; הדחיפה בפועל ל-Firestore
(‏setDoc/deleteDoc/רשת) = חיווט לוח-האם, לא כאן.
