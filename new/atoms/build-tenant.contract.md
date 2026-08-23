# חוזה · חוט build-tenant
**תפקיד:** תזמור בניית-דייר טלפוניה: קונפיג-לקוח גולמי ⇒ אימות ⇒ חילול-קבצים.
כשיש שכבות-הרשאה (מפעיל→לקוח→עובד) — מיזוגן קודם לוולידציה; בלי layers = ביט-זהה.
**שקעים (חוק-1 — קריאות-החוץ הוזרקו כפרמטרים):**
- ‏validateTenant(cfg) ⇒ ‏{ok, errors, warnings, tenant}
- ‏generateConfig(tenant, warnings, opts) ⇒ ‏{files, manifest, warnings?}
- ‏effectiveConfig(base, raw, member|null) ⇒ ‏{features, terms}
**קלט:** raw (קונפיג גולמי) · opts? (‏{layers?: {base?, member?}, ...מועבר-הלאה}) · 3 השקעים.
**פלט:** ‏{ok:false, errors, warnings} בכשל-אימות (בלי files/manifest, השקע השני לא נקרא);
‏{ok:true, errors:[], warnings, files, manifest, tenant} בהצלחה.
**דוגמאות מחייבות:**
1. אימות-נכשל: ‏validate⇒{ok:false, errors:['E1'], warnings:['W1']} ⇒ הפלט
   ‏{ok:false, errors:['E1'], warnings:['W1']}, אין files, ‏generateConfig לא נקרא (0 קריאות).
2. הצלחה: ‏validate⇒{ok:true, errors:[], warnings:['W'], tenant:{id:'t1'}} ·
   ‏generate⇒{files:{'a.conf':'x'}, manifest:{n:1}, warnings:['G']} ⇒ הפלט
   ‏{ok:true, errors:[], warnings:['G'], files:{'a.conf':'x'}, manifest:{n:1}, tenant:{id:'t1'}}.
3. ‏genWarns ריק (undefined) ⇒ הפלט נופל לאזהרות-האימות: ‏warnings=['W'].
4. בלי layers ⇒ ‏effectiveConfig לא נקרא (0 קריאות) ו-validateTenant מקבל את raw עצמו (===).
5. עם ‏layers.base ⇒ ‏effectiveConfig(base, raw, null) נקרא פעם-אחת, ו-validateTenant
   מקבל ‏{...raw, features, terms} מהמיזוג (raw={name:'x'} + ‏eff⇒{features:{f:true},
   terms:{t:'א'}} ⇒ ‏cfg={name:'x', features:{f:true}, terms:{t:'א'}}).
6. ‏layers עם member בלבד (בלי base) ⇒ עדיין ממזג: ‏effectiveConfig({}, raw, member).
**מוצא:** חולץ כלשונו מ-maor/telephony/lib/index.mjs (‏buildTenant; הטיוטה נגזרה
מגשר-הטיפוסים maor/src/lib/telephony/engine.ts:78-81). התלויות-הפנימיות
(validate/generate/config) הפכו לשקעים — החיווט האמיתי שלהן שייך לקופסה.
