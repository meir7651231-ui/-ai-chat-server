# חוזה · חוט merge-families-by-fields
**תפקיד:** מיזוג קבוצת-כפולים **לפי בחירת-שדות של המשתמש** (מסך-הכפולים):
קודם נבנה בסיס בטוח דרך שקע-mergeFamilies (‏fams[0] = השומר, השאר losers —
חברים/מסמכים/מונים מאוחדים), ואז כל אחד מ-18 שדות-המיזוג נדרס בערך הנבחר
משקע-dupFieldValue (עדיפות: ‏edit ידני ⇒ ‏pick אינדקס-מקור ⇒ ראשונה-עם-ערך).
המרות: ‏kidsHome/kidsMarried — ‏'' ⇒ 0, אחרת ‏+val; ‏status — ‏'' נופל לסטטוס-
הבסיס; שאר השדות = המחרוזת כמות-שהיא. שדות שאינם ברשימה (id, members, docs…)
נשארים מהבסיס. טהור — מחזיר Family חדש.
**שקעים (חוק-1 — קריאות-שכן הוזרקו כאובייקט deps; שלושתם קיימים כחוטים):**
- ‏deps.mergeFamilies(keeper, losers) ⇒ ‏Family — בסיס-המיזוג הבטוח
  (החוט ‏merge-families, כבר-קשור-בשקעיו בקופסה).
- ‏deps.dupFieldValue(fams, def, pick, edit) ⇒ מחרוזת — הערך הנבחר לשדה
  (החוט ‏dup-field-value).
- ‏deps.dupFields — מערך הגדרות-השדות ‏{key, get} (בקופסה: הקבוע-החוט
  ‏dup-fields, 18 שדות; החוזה מוכח על תת-רשימה).
**קלט:** ‏fams (Family[], ‏fams[0]=שומר) · ‏pick (‏{key→אינדקס}) ·
‏edit (‏{key→ערך-ידני}) · ‏deps. **פלט:** ‏Family ממוזג.
**דוגמאות מחייבות** (בכולן: ‏mergeFamilies=(k)=>({...k}) ·
‏dupFieldValue=הלוגיקה המקורית (edit⇒pick⇒ראשונה-עם-ערך) ·
‏dupFields=[{key:'name'},{key:'status'},{key:'kidsHome'}] עם ‏get מקוריים ·
‏fams=[{id:'f1',name:'',status:'pending',kidsHome:2},{id:'f2',name:'לוי',status:'active',kidsHome:4}]):
1. ‏pick={} · ‏edit={} ⇒ ‏{id:'f1',name:'לוי',status:'pending',kidsHome:2} —
   לכל שדה: הראשונה-עם-ערך (name ריק ב-f1 ⇒ נלקח מ-f2).
2. ‏pick={kidsHome:1} ⇒ ‏kidsHome=4 — נבחר מקור f2, והמחרוזת '4' הומרה למספר.
3. ‏edit={name:'אדית'} + ‏pick={name:1} ⇒ ‏name='אדית' — עריכה-ידנית גוברת על pick.
4. ‏edit={kidsHome:''} ⇒ ‏kidsHome=0 — ריק בשדה-מונה הופך ל-0, לא NaN.
5. ‏edit={status:''} ⇒ ‏status='pending' — ריק בסטטוס נופל לסטטוס-הבסיס.
6. ‏id נשאר ‏'f1' בכל הדוגמאות — שדה שאינו ב-dupFields לא נדרס.
**מוצא:** maor/src/lib/dedup.ts:224-256 (‏mergeFamiliesByFields — "מיזוג קבוצה
לפי בחירת-שדות, fams[0] הוא בסיס השומר"; ה-switch על 18 המפתחות verbatim).
השכנים ‏mergeFamilies·dupFieldValue·DUP_FIELDS הפכו לשקעי-deps (חוק-1).
