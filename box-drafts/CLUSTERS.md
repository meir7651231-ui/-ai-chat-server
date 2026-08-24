# 🧩 אשכולות-תלות — עבודת-יד לגל-הסוגר (לא ניתנות לחציבה אוטומטית)
> חוטים שהרישום סימן pure:false בגלל תלות-פנימית או טווח-שגוי — הקוד עצמו טהור,
> אבל הקידום דורש חילוץ-ידני מהמקור + הזרקת-תלות (החוט מייבא אטום-אחות או מקבל שקע).
> מקור-אמת: הקובץ החי ב-maor, לא הטווח שברישום (חלק מהטווחים מזוהמי-ריבוי-הצהרות).

## אשכול-הקונפיג (src/lib/config.ts) — הליבה של White-label
- ~~`termOf`~~ ✅ קודם (term-of — טהור-נקי; הטווח ברישום היה מזוהם)
- ~~`normalizeSite`~~ ✅ (make-normalize-site — מפעל, שקעי safeHttpsUrl+SITE_LANGS) · ~~`normalizeConfig`~~ ✅ (make-normalize-config — מפעל, 7 שקעים)
- ~~`employeeSignUpError`~~ ✅ · ~~`resolveOrgConfig`~~ ✅ (שקע normalizeConfig) · ~~`orgSlugFromUrl`~~ ✅ (search⇒פרמטר)
- ⚠️ `SUPER_ADMIN_EMAILS` נשאר בחוץ (חוק-6) — בקופסה יוזרק כערך-הצבה

## אשכול-התמחור (src/lib/pricing.ts)
- ~~`SIZE_LABELS`~~ ✅ קודם (size-labels)
- (`DEFAULT_PRICES` + `normalizePrices` + `computeQuote` + `shekel` כבר קודמו/במחצבה)

## אשכול-הקבלה (src/lib/receipt.ts)
- ~~`receiptHtml`~~ ✅ קודם (receipt-html — שקע receiptLines, ratchet-XSS)

## אשכול-הוורטיקלים (src/lib/verticalPacks.ts)
- ~~`VERTICAL_PACKS`~~ ✅ קודם (vertical-packs — הוערך-במלואו, ratchet 13/chesed-ביט-זהה/כיבוי-מסחרי)

## אשכול-הנעילה (src/lib/lock.ts)
- ~~`DEFAULT_LOCK_ZONES`~~ ✅ קודם (default-lock-zones)
- `LOCK_ZONES` — כנ"ל
- `readLock`/`writeLock` — גבול-IO ⇒ חיווט-קופסה בלבד

## אשכול-הטלפוניה (src/lib/telephony/) — מהסבב הקודם
- `engine.ts` = גשר-טיפוסים; המימוש ב-telephony/lib/*.mjs ⇒ קופסה רב-מודולית
