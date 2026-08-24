# חוזה · חוט fam-enrollments
**תפקיד:** כל השיבוצים של בני-המשפחה — סינון ‏db.enrollments לפי חברות-הבן
במשפחה (Set של member-ids). **בלי סינון-סטטוס**: כולל שהסתיימו (ended)
וברשימת-המתנה (wait) — להיסטוריה/דוחות. (הגרסה ה"חיה" — famLiveEnrollments —
היא חוט אחר שמסנן מעל זה.)
**קלט:** db (עם ‏enrollments[]) · fam (עם ‏members[] בעלי ‏id). **פלט:** מערך-שיבוצים.
**דוגמאות מחייבות:**
1. משפחה ‏members=[{id:'m1'},{id:'m2'}] מול
   ‏enrollments=[{memberId:'m1',courseId:'c1'},{memberId:'m3',courseId:'c1'}] ⇒
   רק שיבוץ ‏m1 (של ‏m3 — משפחה אחרת — בחוץ).
2. אין סינון-סטטוס: ‏{memberId:'m1',status:'ended'} ו-‏{memberId:'m2',status:'wait'}
   שניהם נכללים ⇒ אורך 2.
3. משפחה בלי בנים ‏(members:[]) ⇒ ‏[].
4. ‏enrollments ריק ⇒ ‏[].
5. סדר-המקור של db.enrollments נשמר (filter יציב): ‏[m2,m1,m2] ⇒ באותו סדר.
6. השיבוצים המוחזרים הם אותן הפניות (===) לרשומות-המקור — אפס העתקה.
**מוצא:** maor/src/components/families/lib.ts:69-78 (‏famEnrollments — "כל
השיבוצים של בני המשפחה — כולל שהסתיימו/ברשימת-המתנה — להיסטוריה/דוחות").
