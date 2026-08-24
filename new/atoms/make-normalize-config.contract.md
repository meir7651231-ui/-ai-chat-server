# חוזה · make-normalize-config (חוט-מפעל)
**מהות:** מחטא-הקונפיג הראשי — כל קונפיג (ענן/localStorage/קובץ) עובר כאן לפני שימוש.
**מוצא:** maor/src/lib/config.ts:515-631 + normalizeFirebase הפרטי (128-145).

## קלט/פלט
`makeNormalizeConfig(deps)` ⇒ `normalizeConfig(raw)` ⇒ OrgConfig|null.
deps: DEFAULT_CONFIG · INTEGRATION_KEYS · INTEGRATION_SETTING_KEYS · MOTION_KEYS ·
TEMPLATE_KEYS · normalizeSite · normalizeTelephony (כולם שקעים — חוק-1).

## ערבויות (ratchet)
1. זבל / בלי slug+orgName+theme ⇒ null; בסיס = DEFAULT_CONFIG עם דריסות-מחרוזת בלבד.
2. **דגלי true-מפורש:** cloudRoot / donationSplit / supporterEnforce — רק true נשמר; כל ערך אחר נמחק.
3. **הרחבות:** מפתח מחוץ ל-INTEGRATION_KEYS נזרק (שגיאת-כתיב לא נבלעת); רשומה חייבת
   {enabled:boolean}; הגדרות-מחרוזת רק מ-INTEGRATION_SETTING_KEYS (trim, ריק נזרק).
4. firebase: נשמר רק עם 4 שדות-חובה מחרוזות לא-ריקות; אחרת נמחק.
5. emoji: מחרוזת נגזמת ל-12; motion: allowlist בלבד; accentCustom: true-בלבד.
6. templates: מפתחות TEMPLATE_KEYS בלבד, ערכי-מחרוזת בלבד.
7. site/telephony: דרך השקעים; undefined ⇒ השדה נמחק.
8. modules/features/terms: אובייקט ⇒ עותק; אחרת {} (לעולם לא undefined).
