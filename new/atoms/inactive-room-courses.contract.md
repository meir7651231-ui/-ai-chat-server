# חוזה · חוט inactive-room-courses
**תפקיד:** אזהרות-יומן — חוגים שלא הסתיימו (‏!end או iso ≤ end) המשויכים
(‏roomId) לחדר שאינו פעיל או שאינו קיים. חדר-חסר ⇒ roomName =
`<מונח-חדר> לא קיים`; חדר לא-פעיל ⇒ roomName = שם-החדר. חוג בלי roomId
או חוג שהסתיים — מדולג. חדר פעיל-וקיים — לא ברשימה. סדר-הפלט = סדר db.courses.
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏termOf(config, key, fallback) ⇒ מחרוזת — מונח פר-ארגון מהקונפיג
  (‏maor/src/lib/config.ts). האטום קורא לו רק עם המפתח 'entity.room'
  וה-fallback 'חדר'.
**קלט:** db = ‏{courses:[{id,roomId?,end?,…}], rooms:[{id,name,active}]} ·
iso (היום, ‏yyyy-mm-dd) · config (אטום — מועבר כמו-שהוא לשקע) · השקע termOf.
**פלט:** מערך ‏{course, roomName}.
**דוגמאות מחייבות** (termOf-בדיקה: מחזיר config.terms[key] ?? fallback):
- חוג עם roomId='rX' שאינו ב-rooms, ‏terms={} ⇒ ‏[{course, roomName:"חדר לא קיים"}]
- אותו מצב עם terms={'entity.room':'אולם'} ⇒ ‏roomName="אולם לא קיים" (המונח מהשקע)
- חוג לחדר {id:'r1', name:'סטודיו ב', active:false} ⇒ ‏[{course, roomName:"סטודיו ב"}]
- חוג לחדר {id:'r2', active:true} ⇒ ‏[] (חדר תקין — לא אזהרה)
- חוג שהסתיים end="2026-08-01" מול iso="2026-08-24" ⇒ ‏[] (גם כשחדרו לא-פעיל)
- חוג בלי roomId ⇒ ‏[] · חוג עם end="2026-08-24" מול iso="2026-08-24" ⇒ נכלל (iso ≤ end)
**מוצא:** maor/src/components/diary/lib.ts:244-258 (‏inactiveRoomCourses,
"חוגים (שלא הסתיימו) המשויכים לחדר לא פעיל או לחדר שאינו קיים").
