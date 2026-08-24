# חוזה · חוט reenroll-list-text
**תפקיד:** טקסט-תדפיס קריא לרשימת-הרישום-מחדש — שורה לתלמיד/ה, מחוברות ב-'\n'.
תבנית-שורה: `<שם> · <חוג> — נוכחות <P>, חיסורים <A> · <החלטה>[ ✓נרשם]`.
מילון-החלטה: ‏'yes'⇒'ממשיך' · ‏'no'⇒'לא ממשיך' · ‏'hold'⇒'בהמתנה' ·
אחר/חסר⇒'טרם הוחלט' (בניגוד ל-CSV — כאן יש ברירת-מחדל מילולית).
‏renewed ⇒ סיומת ' ✓נרשם'. טהור, בלי שקעים.
**קלט:** ‏rows[] = {memberName, courseName, summary:{presents, absences},
decision?, renewed}. **פלט:** מחרוזת רב-שורתית.
**דוגמאות מחייבות:**
1. ‏[{memberName:'דוד', courseName:'ציור', summary:{presents:12, absences:2},
   decision:'yes', renewed:true}] ⇒
   'דוד · ציור — נוכחות 12, חיסורים 2 · ממשיך ✓נרשם'.
2. ‏[{memberName:'רות', courseName:'מוזיקה', summary:{presents:0, absences:5},
   renewed:false}] ⇒ 'רות · מוזיקה — נוכחות 0, חיסורים 5 · טרם הוחלט'
   (decision חסר ⇒ ברירת-מחדל; בלי ✓).
3. ‏decision:'no' ⇒ '… · לא ממשיך' · ‏decision:'hold' ⇒ '… · בהמתנה'.
4. שתי שורות ⇒ מחוברות ב-'\n' בדיוק (בלי שורה עודפת בסוף).
5. ‏rows=[] ⇒ '' (מחרוזת ריקה).
**מוצא:** חולץ כלשונו מ-maor/src/components/courses/reenroll-lib.ts:338-344.
