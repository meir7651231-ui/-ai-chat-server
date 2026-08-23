# חוזה · חוט safe-https-url
**תפקיד:** חיטוי URL שמגיע מקונפיג-ענן — https בלבד (מסמך-ענן עוין היה מזריק
javascript: לתוך href). ‏trim ⇒ פרסור URL ⇒ רק protocol==='https:' עובר, ומוחזר
דרך ‏u.toString() (נורמליזציה — לשורש נוסף '/'). ריק/לא-תקין/לא-https ⇒ null.
**קלט:** מחרוזת גולמית (או ריק/null). **פלט:** URL-https מנורמל או null.
**דוגמאות מחייבות:** ‏"https://example.com"→"https://example.com/" ·
‏"  https://a.b/c?x=1  "→"https://a.b/c?x=1" · ‏"http://example.com"→null ·
‏"javascript:alert(1)"→null · ‏"not a url"→null · ‏""→null
**מוצא:** maor/src/lib/config.ts (‏safeHttpsUrl — שער-החיטוי של כתובות-מהענן).
