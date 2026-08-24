# חוזה · חוט reenroll-csv-rows
**תפקיד:** שורות-CSV לרשימת-הרישום-מחדש של חוגים (כותרת + שורה לתלמיד/ה) —
טהור, בלי שקעים. מילון-החלטה: ‏'yes'⇒'ממשיך' · ‏'no'⇒'לא ממשיך' ·
‏'hold'⇒'בהמתנה' · אחר/חסר⇒'' (בניגוד לתדפיס — כאן ריק, לא 'טרם הוחלט').
כל המספרים עוברים String; ‏renewed⇒'כן' אחרת '' · ‏renewNote חסר⇒''.
**קלט:** ‏rows[] = {memberName, familyName, courseName,
summary:{presents, absences, balance, statusLabel}, decision?, renewed,
e:{renewNote?}}. **פלט:** string[][].
**דוגמאות מחייבות** (‏r1={memberName:'דוד', familyName:'כהן', courseName:'ציור',
summary:{presents:12, absences:2, balance:150, statusLabel:'פעיל'},
decision:'yes', renewed:true, e:{renewNote:'ממשיך בשמחה'}} ·
‏r2={memberName:'רות', familyName:'לוי', courseName:'מוזיקה',
summary:{presents:0, absences:5, balance:-80, statusLabel:'בסיכון'},
decision:'hold', renewed:false, e:{}}):
1. שורה 0 (כותרת) = ‏['תלמיד/ה','משפחה','חוג','נוכחות','חיסורים','יתרה ₪',
   'סטטוס','החלטה','נרשם לשנה הבאה','הערה'].
2. ‏[r1] ⇒ שורה 1 = ‏['דוד','כהן','ציור','12','2','150','פעיל','ממשיך','כן',
   'ממשיך בשמחה'].
3. ‏[r2] ⇒ שורה = ‏['רות','לוי','מוזיקה','0','5','-80','בסיכון','בהמתנה','',''].
4. ‏decision:'no' ⇒ 'לא ממשיך'; ‏decision חסר ⇒ '' (עמודת-החלטה ריקה).
5. ‏rows=[] ⇒ ‏[כותרת] בלבד (אורך=1).
**מוצא:** חולץ כלשונו מ-maor/src/components/courses/reenroll-lib.ts:319-337.
