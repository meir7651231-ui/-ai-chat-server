# חוזה · חוט waitlist-for
**תפקיד:** רשימת-ההמתנה של חוג — הרשמות במצב 'wait' לחוג הנתון, ממוינות לפי
סדר-ההצטרפות (FIFO, השוואת-מחרוזות של enrolledAt; חסר/ריק ⇒ '' ⇒ ראשון).
לא משנה את הקלט (filter+sort על עותק-הסינון).
**קלט:** enrollments — מערך הרשמות ‏{courseId, status, enrolledAt?…} · courseId.
**פלט:** מערך-הרשמות מסונן וממוין (עשוי להיות ריק).
**דוגמאות מחייבות:**
- ‏([{id:'e1',courseId:'c1',status:'wait',enrolledAt:'2026-02-01'},
  {id:'e2',courseId:'c1',status:'wait',enrolledAt:'2026-01-15'}],'c1')
  → ‏[e2,e1] (הוותיק ראשון — FIFO)
- ‏([{id:'e1',courseId:'c1',status:'active',enrolledAt:'2026-01-01'}],'c1') → ‏[]
  (רק 'wait' — פעיל אינו ממתין)
- ‏([{id:'e1',courseId:'c2',status:'wait'}],'c1') → ‏[] (חוג אחר לא נכלל)
- ‏([{id:'e1',courseId:'c1',status:'wait'},          ← בלי enrolledAt
  {id:'e2',courseId:'c1',status:'wait',enrolledAt:'2026-01-01'}],'c1')
  → ‏[e1,e2] (חסר-תאריך ⇒ '' ⇒ ממוין ראשון)
- ‏([],'c1') → ‏[]
**מוצא:** maor/src/components/courses/lib.ts:368-373 (‏waitlistFor, מרתון-החוגים
גל ב׳ — "רשימת-המתנה: חוג-מלא ⇒ תור במקום חסימה"; 'wait' לא תופס מקום בחוג).
