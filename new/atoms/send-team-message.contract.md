# חוזה · חוט send-team-message
**תפקיד:** שליחת הודעת **צ׳אט-צוות** תוך-ארגוני (ערוץ-קבוצה אחד לארגון,
‏shell.teamchat): כתיבת-הודעה יחידה (create בלבד) לתת-האוסף
‏teamChats/{slug}/messages עם שולח/שם תחומי-גודל וטקסט מנוקה. טקסט שנפסל
בניקוי (ריק) ⇒ יציאה שקטה, אפס קריאות-ענן. אין מסמך-מטא (בשונה מצ׳אט-התמיכה).
**שקעים (חוק-1 — השכנים הוזרקו):**
- ‏sanitize(raw) ⇒ string — ניקוי-הטקסט (השכן ‏sanitize-support-text).
- ‏fs — ערכת-Firestore: ‏{ db, addDoc, collection } (במקור: ‏cloudDb() ושכניו).
(שם-האוסף 'teamChats' — קבוע-המנגנון TEAM_CHATS מהמקור, מוטבע כלשונו;
‏at = ‏new Date().toISOString() — סטנדרט-שפה, נבדק כתבנית.)
**קלט:** ‏slug (הארגון) · ‏sender (מייל-השולח) · ‏name (שם-תצוגה) · ‏text ·
‏sanitize · ‏fs. **פלט:** ‏Promise<void>.
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. ‏sanitize מחזיר '' ⇒ יציאה שקטה: ‏sanitize נקרא פעם אחת עם הגולמי,
   ‏addDoc לא נקרא כלל.
2. ‏('kehila','anat@org.il','ענת','בוקר טוב') ⇒ ‏addDoc **פעם אחת** עם
   ‏collection(db,'teamChats','kehila','messages') וגוף שמפתחיו בדיוק
   ‏{sender:'anat@org.il', name:'ענת', text:'בוקר טוב', at:ISO} — ‏text הוא
   המנוקה (פלט-sanitize), ‏at תואם תבנית-ISO.
3. תקרות-גודל: ‏sender באורך 130 ⇒ נגזם ל-120 הראשונים; ‏name באורך 70 ⇒
   נגזם ל-60 הראשונים.
4. ‏sender=null / ‏name=undefined ⇒ ‏'' (מחרוזת ריקה — ‏(x||'') לפני הגזירה;
   אין קריסה ואין שדה חסר).
5. ‏addDoc שנדחה (reject 'offline') ⇒ השגיאה מבעבעת החוצה — אין בליעה.
**מוצא:** maor/src/lib/cloudConfig.ts:413-424 (‏sendTeamMessage — צ׳אט-צוות
17.8). ‏sanitizeSupportText ושכני-firestore הפכו לשקעים (חוק-1).
