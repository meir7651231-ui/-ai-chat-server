# חוזה · חוט spotlight-box
**תפקיד:** חישוב מלבן-ה"חור" של סיור-ההדרכה סביב אלמנט: ריפוד קבוע (ברירת-מחדל
10px) סביב המלבן, נצמד לגבולות ה-viewport כך שהחור לעולם לא חורג מהמסך.
מלבן חסר או במידות 0 ⇒ null (אין חור).
**קלט:** ‏rect ({left,top,width,height} או null) · ‏vw,vh (מידות viewport) ·
‏pad (רשות, 10). **פלט:** ‏{left,top,width,height} או null.
**דוגמאות מחייבות:**
1. ‏rect={left:100,top:50,width:200,height:80}, vw=1000, vh=600 ⇒
   ‏{left:90, top:40, width:220, height:100} (ריפוד 10 לכל כיוון).
2. צמוד-לפינה: ‏rect={left:5,top:3,width:50,height:40}, vw=1000, vh=600 ⇒
   ‏{left:0, top:0, width:70, height:60} (‏left/top לא יורדים מ-0; הרוחב המרופד נשמר).
3. גולש מהקצה: ‏rect={left:950,top:580,width:60,height:40}, vw=1000, vh=600 ⇒
   ‏{left:940, top:570, width:60, height:30} (נחתך לגבול ה-viewport).
4. ‏rect=null ⇒ null · ‏rect={left:10,top:10,width:0,height:40} ⇒ null.
5. ‏pad=0: ‏rect={left:20,top:30,width:40,height:50}, vw=1000, vh=600 ⇒
   ‏{left:20, top:30, width:40, height:50} (ביט-זהה למלבן).
**מוצא:** maor/src/lib/tour.ts:98-108 (מנוע הסיור/מדריך — CONNECT).
