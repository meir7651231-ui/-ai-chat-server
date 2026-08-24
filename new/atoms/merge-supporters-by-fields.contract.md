# חוזה · חוט merge-supporters-by-fields
**תפקיד:** מיזוג קבוצת כפולי-תורמים כשהמשתמש בוחר פר-שדה מאיזו רשומה לקחת (pick)
או עורך ידנית (edit). **הכסף לעולם לא נבחר-ידנית** — הבסיס נבנה בשקע-המיזוג הבטוח
(donations/hist/צבירה), ורק שדות-הקשר הסקלריים נדרסים מעליו לפי ההכרעה. טהור;
‏sups[0] = בסיס-השומר. שדה שאינו אחד מ-9 המפתחות המוכרים (name/phone/email/idNum/
city/address/cat/forWho/notes) — מדולג בשקט (ה-switch לא נוגע בפלט).
**שקעים (חוק-1):**
- ‏mergeSupportersGroup(keeper, losers) ⇒ כרטיס-בסיס ממוזג (האטום
  merge-supporters-group על כל שרשרת-שקעיו).
- ‏supDupFieldValue(sups, def, pick, edit) ⇒ string — הכרעת ערך-השדה:
  ‏edit[def.key] גובר; אחרת ‏pick[def.key] (אינדקס-רשומה); אחרת הרשומה הראשונה
  שיש לה ערך (האטום sup-dup-field-value של maor).
- ‏supDupFields — מערך הגדרות-השדות ‏[{key, label, get}] (במקור SUP_DUP_FIELDS —
  9 שדות סקלריים בלי-כסף; ההרכב מוזרק מהקופסה).
**קלט:** sups (2+ כרטיסים, הראשון שומר) · pick (מפה key⇒אינדקס) · edit (מפה key⇒טקסט).
**פלט:** כרטיס ממוזג אחד.
**דוגמאות מחייבות (עם שקעים בסמנטיקת-maor; בסיס-הבדיקה: group סוכם ils):**
1. כסף מהבסיס: ‏sups=[{ils:100},{ils:50}] ⇒ ‏out.ils=150 (מהשקע-הקבוצתי —
   לא ניתן לבחירה בשום pick/edit).
2. ‏pick: ‏sups=[{name:'דנה'},{name:'דנה לוי'}], ‏pick={name:1} ⇒ ‏out.name='דנה לוי'.
3. ‏edit גובר על הכול: ‏edit={notes:'ממוזג ידנית'} ⇒ ‏out.notes='ממוזג ידנית'
   גם כששתי הרשומות מלאות ו-pick מצביע אחרת.
4. ברירת-מחדל "ראשון-עם-ערך": ‏sups=[{city:''},{city:'חיפה'}] בלי pick/edit ⇒
   ‏out.city='חיפה' (הרשומה הראשונה שאינה-ריקה, גם כשאינה השומר).
5. שדה לא-מוכר ברשימת-השקע (‏key='ils') ⇒ מדולג: ‏out.ils נשאר ערך-הבסיס
   (המתג מגן על הכסף גם מרשימת-שדות עוינת).
**מוצא:** maor/src/lib/dedup.ts:430-453 (‏mergeSupportersByFields — למידה
מ-mergeFamiliesByFields של המשפחות; מסך-המיזוג של כפולי-תורמים).
