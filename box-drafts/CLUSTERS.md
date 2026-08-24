# 🧩 אשכולות-תלות — עבודת-יד לגל-הסוגר (לא ניתנות לחציבה אוטומטית)
> חוטים שהרישום סימן pure:false בגלל תלות-פנימית או טווח-שגוי — הקוד עצמו טהור,
> אבל הקידום דורש חילוץ-ידני מהמקור + הזרקת-תלות (החוט מייבא אטום-אחות או מקבל שקע).
> מקור-אמת: הקובץ החי ב-maor, לא הטווח שברישום (חלק מהטווחים מזוהמי-ריבוי-הצהרות).

## אשכול-הקונפיג (src/lib/config.ts) — הליבה של White-label
- `termOf` — קורא cfg.terms עם נפילה ל-TERM_DEFS (אטום-נתונים קיים) ⇒ שקע/ייבוא
- `normalizeSite` · `normalizeConfig` — חיטוי-קונפיג (allowlists מאטומי-נתונים)
- `employeeSignUpError` · `resolveOrgConfig` · `orgSlugFromUrl` — טהורים עם תלות
- ⚠️ `SUPER_ADMIN_EMAILS` נשאר בחוץ (חוק-6) — בקופסה יוזרק כערך-הצבה

## אשכול-התמחור (src/lib/pricing.ts)
- `SIZE_LABELS` — const טהור; הטווח ברישום (76-121) בלע interfaces ⇒ לחלץ 76-80 בלבד
- (`DEFAULT_PRICES` + `normalizePrices` + `computeQuote` + `shekel` כבר קודמו/במחצבה)

## אשכול-הקבלה (src/lib/receipt.ts)
- `receiptHtml` — טהור, תלוי `receiptLines` (קודם) ⇒ ייבוא אטום-אחות + escaping נבדק

## אשכול-הוורטיקלים (src/lib/verticalPacks.ts)
- `VERTICAL_PACKS` — const-נתונים ענק (54-466, ‏13 חבילות עם theme/accent/emoji/motion)
  ⇒ אטום-נתונים כמו dict-he (בדיקת-צילום + ratchet כיסוי-13)

## אשכול-הנעילה (src/lib/lock.ts)
- `DEFAULT_LOCK_ZONES` — const טהור; הטווח בלע את readLock (localStorage) ⇒ לחלץ נקי
- `LOCK_ZONES` — כנ"ל
- `readLock`/`writeLock` — גבול-IO ⇒ חיווט-קופסה בלבד

## אשכול-הטלפוניה (src/lib/telephony/) — מהסבב הקודם
- `engine.ts` = גשר-טיפוסים; המימוש ב-telephony/lib/*.mjs ⇒ קופסה רב-מודולית
