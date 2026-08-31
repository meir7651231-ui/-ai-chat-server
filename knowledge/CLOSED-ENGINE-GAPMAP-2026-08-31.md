# CLOSED · סגירת מפת-הפערים של המנוע (המחולל) — 2026-08-31

ענף: `claude/hei-rxv1v1`. שמונה קומיטים סגרו את כל 6 יכולות-הליבה החסרות + תיקון-יסוד,
**כולן ברמת-המנוע** (כל אפיון עתידי, כל דומיין, מקבל אותן לבד — מבחן-הקונכייה).

## האינווריאנט (נאכף פר-פאזה)
- אפיון ללא-הדקדוק-החדש ⇒ פלט **byte-identical** (הוכח `git diff` ריק על `new/dart-gen-bs`+`new/dart-data-bs`).
- דטרמיניסטי · אפס-LLM בזמן-חילול · הידע חי על האטום/האפיון, לא במנוע.
- כל פאזה: שער byte-identity + `flutter analyze` נקי (buildsmart) + `police.mjs --fast` 11/11 + golden 13/13.

## הקומיטים
| commit | פאזה | דקדוק חדש |
|---|---|---|
| `8141ab9c` | 0 · תיקון-יסוד | `backRefs` שלם ל-M2M (relOf: יחיד→רבים) + `referencing` מודע-CSV |
| `b34c058b` | 1א | אובייקטים-מקוננים `שדה(תת/תת)` — DsSection, אחסון שטוח `הורה/בן`, עמודה-מחוברת בכרטיס |
| `f2307701` | 1ב | שלמות-קשר `\| מחיקה: קשר=מפל/ניתוק/חסימה` — גרף נפלט ל-store גנרי, removeById אוכף, שומר-מחזור |
| `7a3fafda` | 2 | rollup `שדה=סכום(בן.שדה)` — sumRef/countRef/avgRef, קשר מ-backRefs |
| `c43ca1de` | 2 | ולידציה `שדה(0..100)` (טווח) · `שדה ~/regex/` (תבנית, RegExp אינליין עם בורח-`$`) |
| `dfd69516` | 3 | שערי-מעבר `\| מעברים: שלב: תנאי` — compileGuard, קורא מהרשומה r, חוסם קדימה, טוסט |
| `f7441a5f` | 2 | RLS read-side `\| היקף:`/`\| שדות:` — scoped() + הסתרת-עמודות + בורר-actor |
| `f26d38b8` | — | RLS write-side `\| שדות: X=נעל` — נעילת-קלט (AbsorbPointer) + הסתרת-קלט (collection-if), טופס role-reactive |

## הדקדוק המלא של המחולל (עכשיו)
```
שדה*                חובה (required)
שדה!                ייחודי (unique)
שדה{א|ב|ג}           ערכים-מותרים (enum)
שדה=נוסחה            מחושב מאחיות (computed)
שדה[ערך]            ברירת-מחדל (default)
שדה(תת/תת)          אובייקט-מקונן (composite / value-object)
שדה=סכום(בן.שדה)     צבירה כשדה (rollup: סכום/ממוצע/מונה)
שדה(0..100)         טווח מספרי (range)
שדה ~/regex/        תבנית-קלט (pattern)
| שלבים: a,b,c       מסע-workflow (state machine)
| חוקים: A >= B      ולידציית-הצלבה (cross-field)
| מעברים: שלב: תנאי   שער-מעבר מותנה (transition guard)
| מחיקה: קשר=מפל     שלמות-קשר (cascade/set-null/restrict)
תפקיד N: … | היקף: X.f | שדות: X.f=הסתר/נעל    RLS (סינון-תצוגה)
```

## הכרעות-מפתח
- **התנגשות `~`** (RI-cascade מול regex) → `~/…/` שמור ל-regex; מחיקה עברה לסעיף `| מחיקה:`.
- **RLS = סינון-תצוגה, לא אכיפה** — הנתונים חיים ב-`_rec`/localStorage; מסומן במפורש בפלט
  ("סינון-תצוגה" בבורר-actor). אכיפה-אמיתית = תשתית (חוק-6). read-side + write-side הושלמו.
- **גבולות שלא-נבנים לבד:** auth/backend/sync (סוד/שרת, חוק-6) · "תבנית-בשם" (אימייל→regex-ידוע =
  לקסיקון-דומיין, הכרעת-בעלים) · multi-device conflict-resolution.

## מכונות-אימות בשימוש
- שער-קומפילציה: `closure.mjs` (סקריפט-סשן) מזריק ל-`app_flutter/lib/genesis` ב-buildsmart → `flutter analyze --no-fatal-infos`.
- golden: `machtzev/behavioral/run.mjs` (13 בדיקות-store + widget; +ratchets: referencing-CSV, שלמות-קשר, rollup, scoped).
- דוגמות-אפיון: `/tmp/*-test.txt` (comp/ri/rollup/val/guard/rls/wperm) + `/tmp/schoolos/spec.txt` (71 ישויות, עוגן-הרגרסיה).
