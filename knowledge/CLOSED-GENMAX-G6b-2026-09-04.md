# ✅ CLOSED · GENMAX · G6b — הגרעין כקוד: 8 מסכי-גרעין מקומפלים ומרונדרים מהרג׳יסטרי, מעברי-מצב מאטומי-המדף (4.9.2026)

> שלב 6b של `PLAN-GENERATOR-MAX-2026-09-04.md`. G6a נתן גרעין-כנתונים; כאן הוא **קוד שעובד**: לכל ישות עם workflow — `gen_core_<entity>.dart` שמתקמפל (analyze 0) ורונדר (gen-verify 8/8). מנוע, לא סוכן. קוד: `core-dart.mjs` · שער `coredart` · הרנדר בשער `genverify` (קפדני גם ל-`gen_core_*`).

## מה נפלט (דטרמיניסטי, מהרג׳יסטרי בלבד)
- **`_<E>Core`** — `states` (חצובים מ-domain.ts בסדר-הצהרה) · `next(s)`: **`advanceStatus`** (Delivery) · **`nextStage⊕stageIndex⊕ayinStages`** (AyinCase) · אחרת סדר-ההצהרה עם הערה "הצבה, חוק-7" (6 ישויות) · `relations` · `rules` · `channels` · `events` — כולם `const` מהרג׳יסטרי, אפס ליטרל-מומצא.
- **`<E>CoreScreen`** — `DsScaffold` ⇒ `DsSection` "מחזור-חיים" (StatusChip פר-מצב, הנוכחי מודגש · AlertBanner "הבא אחרי X: Y"/"מצב-סופי" · SoftButton "קדם מצב" שמפעיל את מנוע-המעבר) · "יחסים"/"חוקים"/"אירועי-מחזור-חיים" (DsTable מונחית-נתונים) · "ערוצים" (StatusChip) · AlertBanner 🔒 "policy-config = הכרעת-בעלים — שקע ריק". פריסה בלבד (Wrap) מחוץ לאטומים.

## מדידה
| ישות | workflow | מעבר | analyze | רנדר |
|---|---|---|---|---|
| Delivery | pickup→enroute→delivered | `advanceStatus` (מדף) | 0 | ✓ 1,335 widgets |
| AyinCase | new→lead→eyes→answer→done | `nextStage` (מדף) | 0 | ✓ |
| Family · Enrollment · TzBox · ShopAssignment · DialLogEntry · CallEntry | חצובים | declared (הצבה מוצהרת) | 0 | ✓ |
**8/8** מסכים · 6 אטומי-תצוגה ייחודיים · שער `coredart` ≡ פליטה-טרייה.

## מה לא אומת (כנות)
- מסך-הגרעין הוא **מסך-הוכחה** של השכבה (רואים מצבים/יחסים/חוקים ומקדמים מצב עם מנוע-המדף) — לא שכבת-ריצה שמודולי-הישות קוראים לה. חיבור מודול-retarget ⇒ `_<E>Core.next/rules` (לדוגמה: FeesScreen מקדם Enrollment.status דרך הגרעין) = **G6c**.
- 6 מעברים declared = ניחוש-מסודר מוצהר; מעברי-אמת ו-policy = הכרעת-בעלים (שקע ריק, גלוי במסך).
- Rules נפלטים כטבלה, לא כ-`validate()` שרץ על רשומה — G6c.
- ישויות בלי workflow (41) אין להן מסך-גרעין (אין מה להוכיח בלי מחזור-חיים); הרג׳יסטרי שלהן קיים ב-core-registry.json.

## אימות
`core-dart.mjs --gate` ✓ (8 ≡) · analyze 0/8 · gen-verify 8/8 · police --fast ירוק (ראה commit).
