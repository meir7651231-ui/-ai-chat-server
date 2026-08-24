# חוזה · חוט org-link
**תפקיד:** הרכבת קישור-הלקוח של ארגון — ‏{origin}{basePath}?org={slug}
(משמש את כפתור "📋 העתק קישור" בלוח-הבקרה). שרשור טהור, אפס נירמול:
האטום לא מוסיף/מוריד לוכסנים ולא מקודד — אחריות-הקלט על הקופסה.
**קלט:** ‏origin (מחרוזת) · ‏basePath (מחרוזת) · ‏slug (מחרוזת).
**פלט:** מחרוזת-קישור אחת.
**דוגמאות מחייבות:**
1. ‏('https://maor.app', '/', 'demo') ⇒ ‏'https://maor.app/?org=demo'
2. ‏('https://x.github.io', '/maor-system/', 'or-rishon') ⇒
   ‏'https://x.github.io/maor-system/?org=or-rishon'
3. ‏('http://localhost:5173', '/', 'test-org') ⇒ ‏'http://localhost:5173/?org=test-org'
4. ‏('', '', 'a') ⇒ ‏'?org=a' (אפס-נירמול — שרשור בלבד)
5. ‏('https://maor.app', '', '') ⇒ ‏'https://maor.app?org=' (האטום עיוור לריק — חוק-5)
**מוצא:** maor/src/components/platform/lib.ts:65-67 (‏orgLink). עצמאי — אפס שקעים.
