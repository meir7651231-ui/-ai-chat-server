# חוזה · חוט parse-acc
**תפקיד:** פענוח מחרוזת-JSON של העדפות-נגישות ל-4 דגלים בוליאניים
{contrast, noanim, links, spacing}. קלט פגום/חלקי/ריק מתקבל **בשקט**
כברירות-מחדל (הכול false) — לעולם לא נזרקת שגיאה. ערכים לא-בוליאניים
נכפים ב-`!!` (truthy ⇒ true).
**קלט:** raw — מחרוזת JSON או null/ריק. **פלט:** {contrast, noanim, links, spacing} בוליאנים.
**דוגמאות מחייבות (off = הכול false):**
1. ‏null → off.
2. ‏'' → off (ריק = אין העדפות).
3. ‏'{"contrast":true,"links":true}' → {contrast:true, noanim:false, links:true, spacing:false} (חסר = false).
4. ‏'{"noanim":1,"spacing":"כן"}' → noanim:true · spacing:true (כפיית-truthy).
5. ‏'{שבור' → off (JSON פגום נבלע בשקט).
6. ‏'null' → off (JSON חוקי שערכו null — האופציונל-צ׳יינינג מגן).
**מוצא:** maor/src/lib/a11y.ts:49-59 (parseAcc) — חולץ כלשונו.
