# חוזה · חוט send-support-message
**תפקיד:** שליחת הודעת-לקוח בצ׳אט-התמיכה החי: (א) ניקוי-הטקסט דרך שקע-החיטוי —
ריק אחרי-ניקוי ⇒ **יציאה שקטה, אפס-כתיבות**; (ב) כתיבת הודעה בלתי-משתנה
‏{from:'user', text, at} לתת-האוסף ‏supportChats/{uid}/messages; (ג) עדכון
מטא-השיחה ‏supportChats/{uid} ב-**merge**: ‏email/orgName (חתוכים ל-120) ·
‏lastText (‏clean חתוך ל-120) · ‏lastAt · ‏lastFrom:'user' ·
‏unreadAdmin=increment(1) — מונה-שרת אטומי, לא ערך-בזיכרון.
‏`at`/`lastAt` = אותו רגע-ISO אחד (‏new Date().toISOString() — שפה/סטנדרט).
**שקעים (חוק-1 — השכנים הוזרקו):**
- ‏fs — אובייקט firebase/firestore: ‏db (במקור ‏cloudDb()) · ‏addDoc ·
  ‏collection(db,...path) · ‏doc(db,...path) · ‏setDoc(ref,data,opts) ·
  ‏increment(n) ⇒ סנטינל.
- ‏sanitizeSupportText(text) ⇒ מחרוזת נקייה — השכן-הטהור מ-supportChat
  (קיים כחוט ‏sanitize-support-text).
(שם-האוסף ‏'supportChats' — קבוע-המנגנון ‏SUPPORT_CHATS מהמוצא, מוטבע כלשונו.)
**קלט:** ‏uid · ‏meta ‏{email?, orgName?} · ‏text + השקעים.
**פלט:** ‏Promise<void> (undefined).
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות; ‏sanitize=trim בבדיקה):
1. טקסט שמתאיין בחיטוי (‏'   ') ⇒ אפס קריאות ‏addDoc/‏setDoc, מוחזר ‏undefined.
2. ‏('u7', {email:'a@b.c', orgName:'קהילה'}, ' שלום ') ⇒ ‏collection נקרא פעם
   אחת עם ‏(db,'supportChats','u7','messages'); ‏addDoc פעם אחת עם ההפניה-
   שהוחזרה ו-‏{from:'user', text:'שלום', at:<ISO>} — הטקסט **אחרי** חיטוי.
3. באותה קריאה: ‏doc נקרא עם ‏(db,'supportChats','u7'); ‏setDoc פעם אחת עם
   ההפניה, אובייקט שמפתחיו בדיוק ‏[email, orgName, lastText, lastAt, lastFrom,
   unreadAdmin] — ‏unreadAdmin===הסנטינל ש-increment(1) החזיר — ואופציות
   ‏{merge:true}.
4. ‏at שבהודעה === ‏lastAt שבמטא (רגע-אחד), ומחרוזת-ISO תקינה (‏Date.parse
   מצליח).
5. חיתוך-120: ‏email באורך 130 ⇒ נשמרים בדיוק 120 התווים הראשונים; טקסט-נקי
   באורך 150 ⇒ ‏text המלא בהודעה (150) אבל ‏lastText חתוך ל-120.
6. ‏meta ריק ‏{} ⇒ ‏email:'' · ‏orgName:'' (‏?? '').
7. ‏addDoc שנדחה (reject 'offline') ⇒ השגיאה מבעבעת, ‏setDoc לא נקרא.
**מוצא:** maor/src/lib/cloudConfig.ts:338-359 (‏sendSupportMessage — צ׳אט-
תמיכה חי 17.8). שכני-firestore ⇒ שקעי-fs; ‏sanitizeSupportText ⇒ שקע (חוק-1).
