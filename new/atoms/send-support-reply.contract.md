# חוזה · חוט send-support-reply
**תפקיד:** תשובת **התמיכה** (מייל-על) בצ׳אט-תמיכה חי: כותב הודעה
(‏from:'admin') לתת-אוסף ‏supportChats/{uid}/messages **ואז** מעדכן את
מטא-השיחה ‏supportChats/{uid} במיזוג — תקציר-אחרון (120 תווים) + חותמת-זמן
+ ‏unreadUser מוגדל אטומית (increment). טקסט שנפסל בניקוי (ריק) ⇒ יציאה
שקטה, אפס קריאות-ענן.
**שקעים (חוק-1 — השכנים הוזרקו):**
- ‏sanitize(raw) ⇒ string — ניקוי-הטקסט (השכן ‏sanitize-support-text: גזירת
  רווחי-קצה + תקרת-אורך; החיווט אליו = עניין-הקופסה).
- ‏fs — ערכת-Firestore: ‏{ db, addDoc, collection, setDoc, doc, increment }
  (במקור: ‏cloudDb() ושכני firebase/firestore).
(שם-האוסף 'supportChats' — קבוע-המנגנון SUPPORT_CHATS מהמקור, מוטבע כלשונו;
‏at = ‏new Date().toISOString() — סטנדרט-שפה, נבדק כתבנית.)
**קלט:** ‏uid (הלקוח שבשיחתו משיבים) · ‏text · ‏sanitize · ‏fs. **פלט:** ‏Promise<void>.
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. ‏sanitize מחזיר '' (למשל ‏text='   ') ⇒ יציאה שקטה: ‏sanitize נקרא פעם אחת
   עם הטקסט הגולמי, ו-addDoc/setDoc/increment לא נקראים כלל.
2. הודעה תקינה 'שלום' ל-uid='u7' ⇒ ‏addDoc נקרא **פעם אחת** עם
   ‏collection(db,'supportChats','u7','messages') וגוף
   ‏{from:'admin', text:'שלום', at:ISO} — ‏from תמיד 'admin' (צד-התמיכה),
   ‏text הוא **המנוקה** (פלט-sanitize), ו-at תואם תבנית-ISO
   (‏YYYY-MM-DDTHH:MM:SS…).
3. מטא-השיחה: ‏setDoc נקרא פעם אחת עם ‏doc(db,'supportChats','u7'), גוף שמפתחיו
   בדיוק ‏{lastText, lastAt, lastFrom:'admin', unreadUser} כאשר ‏unreadUser הוא
   **הסנטינל** ש-increment(1) החזיר (לא מספר בנוי-בזיכרון), ואופציות ‏{merge:true}
   (לא דורסים את שדות-השיחה האחרים).
4. תקציר נגזם: טקסט-נקי באורך 150 ⇒ ‏lastText הוא בדיוק 120 התווים הראשונים;
   ‏text בהודעה-עצמה נשאר מלא (150).
5. אותה חותמת-זמן: ‏at של ההודעה === ‏lastAt של המטא (now אחד לשתי הכתיבות).
6. סדר: ‏addDoc לפני ‏setDoc; ‏addDoc שנדחה (reject 'permission-denied') ⇒
   השגיאה מבעבעת ו-setDoc לא נקרא.
**מוצא:** maor/src/lib/cloudConfig.ts:362-374 (‏sendSupportReply — צ׳אט-תמיכה חי
17.8). ‏sanitizeSupportText ושכני-firestore הפכו לשקעים (חוק-1).
