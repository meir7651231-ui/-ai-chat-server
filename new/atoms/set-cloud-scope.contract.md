# חוזה · חוט set-cloud-scope
**תפקיד:** בניית ערך **תחום-הארגון** (CLOUD2) שקובע את נתיבי-האוספים בענן:
‏slug + ‏cloudRoot ⇒ אובייקט-scope חדש ‏{slug, cloudRoot}. ‏cloudRoot=true =
נתיבי-שורש (ביט-זהה ללקוח-החי); ‏false = נתיבי ‏orgs/{slug}/ (ארגון-פלטפורמה).
**גלגול-המצב (חוק-5):** במקור הערך הושם למשתנה-מודול ‏scope שממנו נגזרים
‏scopedCol/scopedMeta/scopedEnv/scopedDonations. ההשמה, וברירת-המחדל הבטוחה
‏`{slug:'default', cloudRoot:true}` ("גם אם setCloudScope לא נקרא — הלקוח הקיים
לא מושפע"), הן **חיווט-קופסה**; האטום רק מחשב את הערך החדש.
**קלט:** ‏slug (string) · ‏cloudRoot (boolean). **פלט:** ‏{slug, cloudRoot} — אובייקט חדש.
**דוגמאות מחייבות:**
1. ‏('kehila', false) ⇒ ‏{slug:'kehila', cloudRoot:false} — ארגון-פלטפורמה.
2. ‏('default', true) ⇒ ‏{slug:'default', cloudRoot:true} — מצב-השורש הבטוח
   (זהה לברירת-המחדל של הקופסה).
3. שתי קריאות עם אותם ערכים ⇒ שני אובייקטים **שונים בהפניה** (אין מצב משותף
   שדולף בין קריאות), שווים בתוכן.
4. הערכים עוברים כמות-שהם — ‏('or-rishon', true) ⇒ ‏slug='or-rishon' בדיוק
   (אין נרמול/trim באטום; האחריות על ה-slug אצל טוען-הקונפיג).
**מוצא:** maor/src/lib/cloud.ts:79-99 (‏setCloudScope — נקרא מ-connectCloud).
ההשמה למשתנה-המודול עברה לקופסה.
