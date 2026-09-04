# ✅ CLOSED · GENMAX · G6c — הגרעין בשימוש: מסך-הישות המחולל מייבא את `<E>Core` ומציג מחזור-חיים חי מהסכמה (4.9.2026)

> שלב 6c של `PLAN-GENERATOR-MAX-2026-09-04.md`. עד כאן הגרעין היה מסך-הוכחה נפרד (G6b); כאן **מסך-הישות עצמו** (retarget, G5c–G5g) משתמש בו. מנוע, לא סוכן. קוד: `core-dart.mjs` (מחלקות ציבוריות `<E>Core`) · `retarget.mjs` (חיווט אוטומטי כשקיים `gen_core_<e>.dart`) · שערים `coredart`/`retarget`/`genverify`.

## המנגנון (דטרמיניסטי)
- `retarget` בודק אם קיים מסך-גרעין לישות-היעד (`gen_core_<e>.dart`) ⇒ מוסיף `import` (+status_chip/alert_banner אם חסרים) ומשחיל **מיד אחרי `children: [` של ה-`DsScaffold` הראשי** מקטע: `DsSection('🧠 מחזור-חיים · <מונח> (גרעין)')` עם `StatusChip` פר-מצב חצוב ו-`AlertBanner` שמחשב את המעבר דרך `<E>Core.next(...)` (אטום-המדף כשקיים) + ספירות חוקים/ערוצים/יחסים מהגרעין. אפס ליטרל-מומצא; אפס ציור-ביד (Wrap = פריסה).
- הכותרת מדווחת `coreWired`; ישות בלי workflow (Volunteer/Supporter/…) ⇒ ללא מקטע, בלי שגיאה.

## מדידה
| מסך-ישות | גרעין | analyze | רנדר |
|---|---|---|---|
| `gen_retarget_family_from_stu.dart` (FamilyScreen) | `FamilyCore` (status: active→pending→inactive · declared) | 0 | ✓ |
| `gen_retarget_tzbox_from_tch.dart` (TzBoxScreen) | `TzBoxCore` (status: home→office→lost→retired · declared) | 0 | ✓ |
8 מסכי-גרעין (ציבוריים עכשיו) — analyze 0 · רונדרו 8/8 · gen-verify baseline **35/73** (11 שלנו + 8 retarget + 8 core + 8 מחולל-ישן).

## מה לא אומת (כנות)
- שני מסכי-ישות בלבד מחווטים לגרעין — כי רק ל-Family ול-TzBox יש גם retarget וגם workflow; Delivery/Enrollment/AyinCase יקבלו חיווט ברגע שייווצר להם retarget (משפט אחד: `sentence.mjs --text "שיבוצים לחוגים"` ⇒ Enrollment ⇒ fees ⇒ מחווט אוטומטית).
- המקטע מציג מעבר מהמצב-הראשון (הוכחת-חיווט), לא את מצב-הרשומה-הנבחרת — חיבור לשורה-נבחרת דורש שדה-status ברשומה של מודול-המקור (fees⇒Enrollment יש; students⇒Family: `status` קיים בזרע? — לא אומת) = G6d.
- `validate(row)` מהחוקים ו-outbox לערוצים עדיין לא נפלטים כקוד-ריצה.

## אימות
`core-dart.mjs --gate` ✓ · `retarget.mjs --gate` ✓ (8 ≡) · analyze 0/16 · gen-verify 10/10 · police --fast ירוק (ראה commit).
