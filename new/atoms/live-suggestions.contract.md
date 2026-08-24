# חוזה · חוט live-suggestions
**תפקיד:** ההצעות החיות של מקדים-הצורך (SHOP8) — כל ההצעות מהמנוע, בלי
אלה שסומנו "טופל" ב-‏db.attnDone (מפתח-ההצעה ‏s.key עם ערך truthy מוחרג).
‏attnDone חסר/undefined ⇒ שום הצעה לא מוחרגת.
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏suggestions — מנוע-ההצעות השכן (בקוד-המקור: ‏suggestions(db,todayIso,config)
  באותו קובץ). האטום קורא לו עם שלושת הארגומנטים שקיבל ומסנן את התוצאה.
**קלט:** ‏db (עם ‏attnDone אופציונלי) · ‏todayIso · ‏config? · השקע suggestions.
**פלט:** מערך ההצעות שהשקע החזיר, מסונן — רק ‏s שאין לו ‏attnDone[s.key] truthy.
**דוגמאות מחייבות** (שקע-דמה ‏sug=()=>[{key:'a'},{key:'b'},{key:'c'}]):
1. ‏db={attnDone:{a:1}} ⇒ ‏[b,c] — 'a' טופל ומוחרג
2. ‏db={} (אין attnDone) ⇒ שלושתן
3. ‏db={attnDone:{a:1,b:'2026-08-24',c:true}} ⇒ [] — הכול טופל
4. ‏db={attnDone:{b:0}} ⇒ שלושתן — ערך falsy אינו "טופל"
5. השקע נקרא בדיוק עם ‏(db,todayIso,config) שהאטום קיבל — פס-העברה שקוף
6. השקע מחזיר [] ⇒ []
**מוצא:** maor/src/components/shop8/lib.ts:140-143 (‏liveSuggestions);
השכן ‏suggestions הפך לשקע (חוק-1).
