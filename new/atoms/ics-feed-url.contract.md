# חוזה · חוט ics-feed-url
**תפקיד:** הרכבת כתובת-המנוי הציבורית של פיד-היומן — פונקציית-הענן `icsFeed`
באזור us-central1 של פרויקט-Firebase נתון, עם ‏org (ה-slug, **מקודד-URL**)
ו-key (ה-token, מודבק **כמו-שהוא** — במאור הוא תמיד 32-hex מ-mintFeedToken,
אין בו תווים הדורשים קידוד). חוק-6: כל הזהויות מוזרקות — אין קבועי-הצבה באטום.
**קלט:** ‏projectId (מזהה פרויקט-ענן) · ‏slug (מזהה-ארגון) · ‏token (מפתח-הפיד).
**פלט:** מחרוזת-URL.
**דוגמאות מחייבות:**
1. ‏('my-proj','demo','abc123') ⇒
   ‏'https://us-central1-my-proj.cloudfunctions.net/icsFeed?org=demo&key=abc123'.
2. ‏slug עם תו-מיוחד מקודד: ‏('p','a b','t') ⇒ ‏'…/icsFeed?org=a%20b&key=t'.
3. ‏slug בעברית מקודד: ‏('p','ארגון','t') ⇒ ‏org=%D7%90%D7%A8%D7%92%D7%95%D7%9F.
4. ה-token לא מקודד: ‏('p','s','a1b2c3d4') ⇒ מסתיים ב-'&key=a1b2c3d4'.
**מוצא:** maor/src/lib/icsFeed.ts:44-47 (‏icsFeedUrl — הרחבת gcal, מנוי-יומן חי 9.8).
