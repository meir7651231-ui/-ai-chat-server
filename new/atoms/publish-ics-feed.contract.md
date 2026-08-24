# חוזה · חוט publish-ics-feed
**תפקיד:** פרסום/רענון פיד-ICS של ארגון: שומר את גבול-גודל-המסמך (מסמך-פיד
גדול מ-900,000 בתים ⇒ זריקה בעברית, בלי כתיבה), משמר token קיים (הקישור אצל
המנויים ממשיך לעבוד), ‏rotate מנפיק token חדש (הקישור הישן מת — ביטול-שיתוף),
כותב ‏{token, ics, updatedAt} דרך שקע-הכתיבה ומחזיר את ה-token. אסינכרוני;
שכבת-הענן כולה עוברת דרך השקעים.
**שקעים (חוק-1 — קריאות-השכן/ענן הוזרקו כפרמטרים, אובייקט רביעי):**
- ‏readToken(slug) ⇒ ‏Promise<string|null> — ה-token הקיים של הפיד
  (במקור: ‏readIcsFeedToken — ‏getDoc על ‏icsFeeds/{slug}).
- ‏mintToken() ⇒ string — הנפקת token אקראי (במקור: ‏mintFeedToken, ‏32-hex).
- ‏writeFeed(slug, docData) ⇒ Promise — כתיבת מסמך-הפיד
  (במקור: ‏setDoc על ‏icsFeeds/{slug}).
- ‏nowIso?() ⇒ string — חותם-הזמן; ברירת-מחדל ‏new Date().toISOString()
  (סטנדרט-שפה — מותר; בבדיקות מוזרק קבוע לדטרמיניזם).
**קלט:** ‏slug (string) · ‏ics (string) · ‏opts? (‏{rotate?:boolean}) · שקעים.
**פלט:** ‏Promise<string> — ה-token שפורסם; או זריקת Error בעברית על חריגת-גודל.
**דוגמאות מחייבות** (בכולן ‏nowIso=()=>'2026-08-24T10:00:00.000Z' והזיוף רושם קריאות):
1. ‏token קיים נשמר: ‏readToken⇒'tok-old' · בלי rotate ⇒ מוחזר 'tok-old';
   ‏mintToken **לא** נקרא; ‏writeFeed קיבל ‏('org1', {token:'tok-old',
   ics:'BEGIN:VCALENDAR', updatedAt:'2026-08-24T10:00:00.000Z'}).
2. אין token קיים: ‏readToken⇒null ⇒ ‏mintToken נקרא פעם אחת, 'tok-new'
   מוחזר ונכתב.
3. ‏rotate:true ⇒ ‏readToken **לא** נקרא כלל; 'tok-new' מה-mint מוחזר —
   גם כשלפיד יש token קיים.
4. חריגת-גודל: ‏ics באורך 900,001 בתים (ascii) ⇒ זריקה
   'לוח-השנה גדול מדי לפרסום כפיד — פנו לתמיכה'; ‏writeFeed לא נקרא.
5. גבול מדויק: ‏ics באורך 900,000 בתים בדיוק ⇒ עובר (הגבול הוא ‎>‎, לא ‎>=‎).
6. הגודל נמדד ב-**בתים** (UTF-8), לא בתווים: 450,001 פעמים 'א' (2 בתים לתו =
   900,002 בתים) ⇒ זריקה — אף ש-length התווי הוא רק 450,001.
**מוצא:** maor/src/lib/icsFeed.ts:34-43 (‏publishIcsFeed — הרחבת gcal, מנוי-יומן
חי; ה-token חי במסמך-הפיד בלבד — לא בקונפיג ולא בגיבויים). שכני-הענן
‏readIcsFeedToken/mintFeedToken/setDoc הפכו לשקעים (חוק-1); הקבוע הפרטי
‏MAX_ICS_BYTES=900_000 (שולי-ביטחון מתחת לגבול 1MB של Firestore) הוטמע.
