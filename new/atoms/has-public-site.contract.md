# חוזה · חוט has-public-site
**תפקיד:** האם להציג את האתר-הציבורי של הארגון — יש תוכן `site` בקונפיג *ולא*
כובה במפורש (`enabled !== false`). חוזה-הדגלים של maor: מפתח חסר = פעיל,
רק `false` מכבה. הגידור על הדגל (shell.publicsite) ועל בקשת-הכתובת (‎?site‎)
הוא חיווט-קופסה — לא כאן.
**קלט:** אובייקט-קונפיג (עם/בלי שדה `site`). **פלט:** boolean.
**דוגמאות מחייבות:**
‏{site:{title:'מאור'}}→true (enabled חסר = פעיל) ·
‏{site:{enabled:true}}→true ·
‏{site:{enabled:false}}→false (כיבוי מפורש) ·
‏{}→false (אין site בכלל) ·
‏{site:null}→false (‏!!null) ·
‏{site:{enabled:0}}→true (רק false ממש מכבה — ‏!==false)
**מוצא:** maor/src/lib/publicSite.ts:242-244 (‏hasPublicSite) — חולץ כלשונו.
