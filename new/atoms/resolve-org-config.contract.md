# חוזה · resolve-org-config (חוט)
**מהות:** מיזוג קונפיג-ענן עם קונפיג-סטטי — הענן מנצח, בשני חריגים מכוונים.
**מוצא:** ‏maor/src/lib/config.ts:803-810.
## קלט/פלט
`resolveOrgConfig(staticCfg, cloudRaw, normalizeConfig)` — שקע-חיטוי ‎(raw)⇒cfg|null‎.
## ערבויות (ratchet)
1. ענן לא-שמיש (השקע מחזיר null) ⇒ **בדיוק** staticCfg (אותה-רפרנס — אפס-שינוי).
2. ה-slug תמיד של הכתובת (staticCfg.slug) — הענן לעולם לא משנה כתובת.
3. ‏firebase: הענן גובר כשמגדיר; חסר-בענן ⇒ נשמר מהסטטי (credentials מקונפיג-השורש).
4. שאר-השדות: הענן גובר במלואו (spread).
