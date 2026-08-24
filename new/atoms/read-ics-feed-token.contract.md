# חוזה · חוט read-ics-feed-token
**תפקיד:** קריאת ה-token הקיים של מנוי-היומן החי (הרחבת gcal, 9.8) ממסמך-הפיד
‏icsFeeds/{slug} בענן — כדי שרענון-פיד **ישמור** token קיים (הקישור אצל
המנויים ממשיך לעבוד) במקום להנפיק חדש. ה-token חי במסמך-הפיד בלבד — לא
בקונפיג, לא בגיבויים. תקין = מחרוזת **לא-ריקה**; מסמך חסר / בלי token /
token ריק / token לא-מחרוזת ⇒ ‏null (=אין פיד מפורסם). שגיאות-ענן **מבעבעות**
(אין try/catch במקור — בניגוד ל-read-org-secrets-meta הבולע).
**שקעים (חוק-1 — firebase/firestore הוזרק כאובייקט fs):**
- ‏fs.db — ידית מסד-הענן (במקור: ‏cloudDb()).
- ‏fs.doc(db, col, id) — הפניית-מסמך.
- ‏fs.getDoc(ref) ⇒ ‏Promise<snap> — ‏snap עם ‏exists()/data().
(שם-האוסף ‏'icsFeeds' — הקבוע ICS_FEEDS מהמקור, מוטבע כלשונו.)
**קלט:** ‏slug · ‏fs. **פלט:** ‏Promise<string | null>.
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. עדות-נתיב: ‏slug='kehila' ⇒ ‏doc נקרא בדיוק פעם אחת עם
   ‏(db,'icsFeeds','kehila'), ו-getDoc עם ההפניה ש-doc החזיר.
2. המסמך לא קיים (‏exists()=false) ⇒ ‏null.
3. ‏data()={token:'a1b2c3d4', ics:'BEGIN:VCALENDAR…'} ⇒ ‏'a1b2c3d4'.
4. ‏data()={token:''} (ריק) ⇒ ‏null.
5. ‏data()={token:42} (לא-מחרוזת) ⇒ ‏null.
6. ‏getDoc נדחה (‏reject Error('permission-denied')) ⇒ השגיאה מבעבעת החוצה.
**מוצא:** maor/src/lib/icsFeed.ts:24-29 (‏readIcsFeedToken). חולץ כלשונו;
‏cloudDb/doc/getDoc הפכו לשקעי-fs (חוק-1).
