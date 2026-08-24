# חוזה · חוט sup-enforce-on
**תפקיד:** האם ארגון הדליק **אכיפת-תומכים בשכבת-הנתונים** בקונפיג (15.8,
ארגוני-פלטפורמה בלבד) — **off-by-default, הפוך מחוזה-הדגלים במכוון**: רק
‏`supporterEnforce:true` **מפורש** מדליק; חסר/false/כל-ערך-אחר ⇒ כבוי
(ביט-זהה להיום: בלי skey, בלי סינון). ⚠️ אכיפת-השרת עובדת רק בארגון-
פלטפורמה; בלקוח-שורש (cloudRoot) אין "עובד מוגבל" בשרת.
**קלט:** ‏cfg — קונפיג-ארגון ‏{supporterEnforce?}. **פלט:** boolean.
**דוגמאות מחייבות:**
1. ‏{supporterEnforce:true} ⇒ ‏true — הדלקה מפורשת בלבד.
2. ‏{} (מפתח חסר) ⇒ ‏false — off-by-default (הפוך מדגל-פיצ'ר שחסר=דלוק).
3. ‏{supporterEnforce:false} ⇒ ‏false — כיבוי מפורש.
4. ‏{supporterEnforce:1} ⇒ ‏false — truthy שאינו ‏true נדחה (‏=== קפדני).
5. ‏{supporterEnforce:'true'} ⇒ ‏false — מחרוזת אינה הדלקה.
**מוצא:** maor/src/lib/config.ts:73-81 (‏supEnforceOn — "off-by-default, רק
supporterEnforce:true מפורש מפעיל"). טהור, אפס שקעים.
