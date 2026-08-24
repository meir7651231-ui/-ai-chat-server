# חוזה · חוט student-history-text
**תפקיד:** טקסט קריא של היסטוריית-תלמיד/ה — שורה להשתתפות, לתדפיס/העתקה.
תבנית-שורה: ‏`[<yearLabel>] <courseName> · <group> — נוכחות <presents>,
חיסורים <absences> · <statusLabel>`; ‏yearLabel ריק ⇒ בלי הסוגריים,
‏group ריק ⇒ בלי ה-` · `. השורות מחוברות ב-'\n'.
**קלט:** ‏entries — מערך רשומות-היסטוריה ‏{yearLabel, courseName, group,
summary:{presents, absences, statusLabel}} (הפלט של החוט student-history).
**פלט:** מחרוזת רב-שורתית (או ריקה למערך ריק).
**דוגמאות מחייבות:**
1. ‏[{yearLabel:'2026/27', courseName:'ציור', group:'א', summary:{presents:10,
   absences:2, statusLabel:'פעיל'}}] ⇒
   ‏"[2026/27] ציור · א — נוכחות 10, חיסורים 2 · פעיל".
2. בלי שנה ובלי קבוצה: ‏{yearLabel:'', courseName:'נגינה', group:'',
   summary:{presents:0, absences:0, statusLabel:'הסתיים'}} ⇒
   ‏"נגינה — נוכחות 0, חיסורים 0 · הסתיים" — אפס סוגריים/מפרידים יתומים.
3. שתי רשומות ⇒ שתי שורות מחוברות ב-'\n' (סדר-הקלט נשמר).
4. ‏[] ⇒ "" — מערך ריק ⇒ מחרוזת ריקה.
5. קבוצה בלי שנה: ‏{yearLabel:'', courseName:'ציור', group:'ב', summary:
   {presents:3, absences:1, statusLabel:'מושהה'}} ⇒
   ‏"ציור · ב — נוכחות 3, חיסורים 1 · מושהה".
**מוצא:** maor/src/components/courses/reenroll-lib.ts:306-318
(‏studentHistoryText, "טקסט קריא של ההיסטוריה (שורה להשתתפות) — לתדפיס/העתקה").
