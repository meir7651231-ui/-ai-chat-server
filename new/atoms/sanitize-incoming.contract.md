# חוזה · חוט sanitize-incoming
**תפקיד:** חיזוק מסמך-ישות מרוחק לפני מיזוג-הענן-החי: מסמך שנכתב בגרסה
ישנה / נערך ידנית ב-Firestore עלול להגיע בלי שדות-רשימה (או עם ערך
לא-מערך) — וצרכני `for (const m of f.members)` וכד׳ היו קורסים. לכל אוסף
בטבלת-המנגנון מובטח שכל שדה-רשימה הוא מערך (‏[] כשחסר/פגום). שדה שכבר
מערך — לא נגוע; אוסף שאינו בטבלה — המסמך מוחזר כמות-שהוא (אותה הפניה).
**טבלת-המנגנון (LIST_FIELDS — קבוע מקובץ-המקור, מוטבע כלשונו):**
‏families:members,docs · enrollments:payments,absences · supporters:donations ·
‏tzBoxes:collections · tzCoordinators:scoreLog · shopProducts:components ·
‏shopAssignments:redemptions,criterionIds · shopItems:waits.
**קלט:** ‏col (שם-אוסף) · ‏item (מסמך). **פלט:** מסמך מחוזק (או המקורי).
**דוגמאות מחייבות:**
1. ‏('families', {id:'f1'}) ⇒ ‏{id:'f1', members:[], docs:[]} — שני
   שדות-הרשימה הושלמו; המקור לא שונה (עותק חדש).
2. ‏('families', {id:'f1', members:[{id:'m1'}], docs:'שבור'}) ⇒ ‏members
   נשמר כמות-שהוא (אותה הפניה), ‏docs הוחלף ב-[].
3. ‏('rooms', {id:'r1'}) ⇒ אותה הפניה בדיוק (אוסף ללא שדות-רשימה בטבלה).
4. ‏('supporters', {id:'s1', donations:[]}) ⇒ אותה הפניה בדיוק — כשכל
   השדות תקינים אין שכפול-אובייקט.
5. ‏('shopAssignments', {id:'a1', redemptions:null}) ⇒
   ‏{id:'a1', redemptions:[], criterionIds:[]}.
**מוצא:** maor/src/lib/cloud-merge.ts:18-40 (‏sanitizeIncoming + LIST_FIELDS).
אפס שקעים — הטבלה קבוע-מנגנון מוטבע.
