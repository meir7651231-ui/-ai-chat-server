# חוזה · חוט integration-on
**תפקיד:** האם הרחבה (integration) פעילה בקונפיג — **הפוך מחוזה-הדגלים במכוון**:
הרחבה היא מוצר-נמכר (opt-in), לכן מפתח חסר = כבוי; רק `enabled:true` מפורש
(בוליאני) מדליק. (דגל-פיצ'ר רגיל: חסר=דלוק, רק false מכבה — אל תבלבלו.)
**קלט:** ‏cfg — אובייקט-קונפיג (עשוי להכיל `integrations` או לא) · ‏key — שם-ההרחבה.
**פלט:** בוליאני.
**דוגמאות מחייבות:**
1. ‏cfg={integrations:{whatsapp:{enabled:true}}}, key='whatsapp' ⇒ ‏true.
2. ‏cfg={integrations:{whatsapp:{enabled:false}}}, key='whatsapp' ⇒ ‏false.
3. ‏cfg={} (אין integrations כלל), key='maps' ⇒ ‏false — חסר=כבוי.
4. ‏cfg={integrations:{maps:{}}}, key='maps' ⇒ ‏false — בלי enabled=כבוי.
5. ‏cfg={integrations:{ai:{enabled:'true'}}}, key='ai' ⇒ ‏false — מחרוזת אינה
   ‏true בוליאני (‏===true בלבד).
6. ‏cfg={integrations:{gcal:{enabled:true}}}, key='maps' ⇒ ‏false — מפתח אחר
   לא מדליק.
**מוצא:** maor/src/lib/config.ts:82-89 (‏integrationOn — "הפוך מחוזה-הדגלים
במכוון… רק enabled:true מפורש מדליק"). עצמאי — אפס שקעים.
