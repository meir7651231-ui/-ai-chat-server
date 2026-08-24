# חוזה · חוט enroll-count
**תפקיד:** מספר המשובצים התופסים-מקום בחוג — פעילים + מוקפאים. שיבוץ
שהסתיים ('ended') פינה את מקומו ואינו נספר (אחרת חוג עם בוגרים רבים היה
נראה "מלא" וחוסם רישום בשקר); ‏'wait' (רשימת-המתנה) אינו תופס מקום —
אחרת רשימת-ההמתנה הייתה חוסמת שיבוץ אמיתי. כל סטטוס אחר (כולל חסר) נספר.
**קלט:** db — אובייקט עם ‏enrollments (מערך שיבוצים ‏{courseId, status?}) ·
courseId — מזהה-החוג.
**פלט:** number.
**דוגמאות מחייבות:**
1. ‏enrollments=[{courseId:'c1',status:'active'}, {courseId:'c1',status:'paused'},
   ‏{courseId:'c1',status:'ended'}, {courseId:'c1',status:'wait'},
   ‏{courseId:'c2',status:'active'}] · courseId='c1' ⇒ ‏2 (פעיל+מוקפא בלבד).
2. אותו מערך · courseId='c2' ⇒ ‏1 (סינון פר-חוג).
3. ‏enrollments=[] ⇒ ‏0.
4. ‏enrollments=[{courseId:'c1'}] (בלי status) ⇒ ‏1 (חסר-סטטוס נספר).
5. ‏enrollments=[{courseId:'c1',status:'wait'}, {courseId:'c1',status:'ended'}] ⇒ ‏0.
**מוצא:** maor/src/components/courses/lib.ts:333-339 (‏enrollCount). טהור —
אפס שכנים ⇒ אפס שקעים.
