# חוזה · חוט upcoming-meetings
**תפקיד:** הפגישות-הקרובות של עמודת-החנות (חנות 23, הכרעה 22) — אירועי
‏kind='meeting' פתוחים (‏done=false) בטווח ‏[todayIso, todayIso+days-1]
(ברירת-מחדל 2 = היום ומחר), ממוינים תאריך+שעה עולה — אירוע **בלי** שעה
ממוין לסוף-היום (מפתח '99:99'); מפתח-המיון: ‏date+'·'+(time||'99:99').
לכל פגישה מוחזר: האירוע עצמו, שם-המוטב (‏who) ושם-החדר (‏roomName).
‏who: השיבוץ (‏assignmentId) נמצא ב-shopAssignments ⇒ שקע-beneficiaryLabel;
לא נמצא ⇒ ‏ev.title. ‏roomName: יש ‏roomId ⇒ שם-החדר מ-db.rooms (חדר לא-קיים
⇒ ''), אין ‏roomId ⇒ ''. טהור ודטרמיניסטי — היום מוזרק.
**שקעים (חוק-1 — קריאות-שכן הוזרקו כפרמטרים):**
- ‏isoOf(d:Date) ⇒ ‏'YYYY-MM-DD' מקומי (לחישוב יום-הקצה; עיגון ‏T12:00:00).
- ‏beneficiaryLabel(db, assignment, config) ⇒ מחרוזת — שם-המוטב של שיבוץ
  (במקור: אותו קובץ; ‏config רשות — מונחי termOf).
**קלט:** ‏db (‏{shopEvents, shopAssignments, rooms}) · ‏todayIso · ‏days
(ברירת-מחדל 2) · ‏config (רשות) + שני השקעים.
**פלט:** מערך ‏{ev, who, roomName} ממוין.
**דוגמאות מחייבות** (בכולן ‏todayIso='2026-08-24', ‏days=2 ⇒ קצה '2026-08-25';
‏beneficiaryLabel=(db,a)=>'מוטב:'+a.familyId):
1. סינון: מתוך 5 אירועים — פגישה היום, פגישה מחר, פגישה מחרתיים (26.8 — מחוץ
   לטווח), פגישה היום עם ‏done=true, ואירוע ‏kind='delivery' היום ⇒ מוחזרות
   בדיוק 2 (היום ומחר).
2. מיון בתוך יום: שלוש פגישות ב-24.8 עם ‏time='14:00' · '09:00' · בלי-שעה ⇒
   הסדר: '09:00', '14:00', בלי-שעה (99:99 — לסוף היום).
3. ‏who משיבוץ: ‏ev.assignmentId='as1' ו-‏shopAssignments מכיל
   ‏{id:'as1',familyId:'f7'} ⇒ ‏who='מוטב:f7' (השקע נקרא עם ‏(db, השיבוץ, config)).
4. ‏who בנפילה: ‏assignmentId שלא קיים ⇒ ‏who===ev.title.
5. ‏roomName: ‏roomId='r1' עם ‏rooms=[{id:'r1',name:'חדר הדרכה'}] ⇒ 'חדר הדרכה';
   ‏roomId='rX' (לא קיים) ⇒ ''; בלי ‏roomId ⇒ ''.
6. פגישת-אתמול ('2026-08-23') לא מוחזרת (‏date >= todayIso).
**מוצא:** maor/src/components/shop/lib.ts:406-426 (‏upcomingMeetings — משטח
התזכורות של העמודה). השכנים isoOf/beneficiaryLabel הפכו לשקעים (חוק-1).
