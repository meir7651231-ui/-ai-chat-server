# חוזה · חוט donation-partition-diff
**תפקיד:** diff ברמת-אוסף-התרומות (הצד-הדוחף של מסלול-B): בהינתן רשימות-תומכים
לפני/אחרי שינוי מקומי, מפרק כל צד למסמכי-תרומה (דרך השקע explodeSupporter,
זהות-מסמך = id=rid), ומחשב: ‏sets = מסמכים חדשים או שהשתנו (השוואת
JSON.stringify מלאה — גם מעבר-תומך/שינוי-pkey = set) · ‏deletes = rid-ים
שנעלמו. פלט: `{ sets: DonationDoc[], deletes: string[] }`. טהור ודטרמיניסטי
(סדר-sets = סדר-הופעה ב-next; סדר-deletes = סדר-הופעה ב-prev).
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏explodeSupporter(sp) ⇒ ‏DonationDoc[] — פירוק תומך למסמכי-ענן
  `{id: rid, supporterId, pkey, donation}` (מקור: donationPartition.ts).
**קלט:** prev · next (רשימות-תומכים) · השקע. **פלט:** `{sets, deletes}`.
**דוגמאות מחייבות** (explode אמיתי; תומך s1 עם תרומות D-1 ‏₪100 ו-D-2 ‏₪50):
1. ‏prev=[] · next=[s1] ⇒ sets באורך 2 ‏(D-1,D-2) · deletes=[]
2. ‏prev=next=[s1] (ללא שינוי) ⇒ sets=[] · deletes=[]
3. ‏שינוי סכום D-2 ל-75 ⇒ sets=[D-2 בלבד] · deletes=[]
4. ‏הסרת D-2 מהתומך ⇒ sets=[] · deletes=['D-2']
5. ‏D-2 עבר מתומך s1 לתומך s2 ⇒ sets=[D-2 עם supporterId='s2'] · deletes=[]
   (אותו rid — תוכן שונה ⇒ set, לא מחיקה)
6. ‏שינוי purpose של D-1 מ-'' ל-'ישיבה' ⇒ sets=[D-1 עם pkey='ישיבה']
**מוצא:** maor/src/lib/donationPartition.ts:103-120 (donationPartitionDiff,
"diff ברמת-אוסף-התרומות — מקביל ל-diffDb; זהות ה-doc = rid").
