# 🗺️ Pure — מפת-מיקום להעברה (איפה הכל נמצא)
> שפת-העיצוב Pure: עוצבה · פורקה · תורגמה ל-Dart · מחוברת לרבנייה. הכל דחוף, מאומת ב-CI.
> **ענף (בשני הריפו):** `claude/mah-kora-0by8kw`

## הריפו
| ריפו | תפקיד | ענף |
|---|---|---|
| `meir7651231-ui/-ai-chat-server` (גנסיס/מחצב) | המקור — עיצוב, פירוק, מנועים | `claude/mah-kora-0by8kw` |
| `meir7651231-ui/buildsmart` (PR #59) | אימות-קומפילציה בלבד (`lib/genesis/`) | `claude/mah-kora-0by8kw` |

## 1 · העיצוב + השער  →  `machtzev/pure/`
- `*-family.html` (13) + `index.html` — גלריית-המראה (13 ארכיטיפים).
- `PURE-SPEC.md` — **החוק** (מה מותר/אסור, טוקנים, כללי-ארכיטיפ).
- `pure-lint.mjs` — **השער הדטרמיניסטי** (‏§0/§1/§2/§5 · WCAG · יעדי-מגע · focus · keyboard). `node machtzev/pure/pure-lint.mjs --strict` = 0B/0M. דגלים: `--strict`/`--json`/`--selftest`.
- `pure-decompose.mjs` — **מנוע-הפירוק** (HTML ⇒ אטומים).
- `PURE-VERIFY-2026-09-01.md` — דוח-הווידוא המלא (13 משפחות + באגי-העין).

## 2 · האטומים המפורקים (530)  →  `new/atoms/`
- `pure-<family>-shelf.{mjs,contract.md,test.mjs}` × 13 — כל אטום-תצוגה רשום+נבדק.
- מניפסט: `machtzev/generator/knowledge/pure-shelf.json` (סה״כ 530).

## 3 · מנגנון-המראה (JS · A/D/E)  →  `new/atoms/`
- `pure-look.*` (A · דאטת-המראה=הזרע) · `pure-resolve.*` (D · resolver) · `pick-look.*` (E · בחירת-מחולל).
- מילון: `machtzev/generator/knowledge/looks.json`.

## 4 · מנוע-Dart + חריץ-לבישה (B/C)  →  `new/dart-ui-bs/`
- `ds/ds_pure.dart` — **מנוע-הצבע** (נייטרל/סמנטי קבועים · 3 ערכות-אקצנט · `themeOf()`). מחולל: `machtzev/ds-pure.mjs` מהזרע `pure-look`.
- `ds/ds_seam.dart` — **החריץ** (`PureScope` + `DsSeam.of(context)`, דורמנטי).
- `pure_surface.dart` — אטום-רפרנס חי (מרכיב A+B+C).

## 5 · החיבור לרבנייה (המתג ההפיך)  →
- `new/dart-ui-bs/auto/bs_pure_tokens.dart` — **`BsPure`**: 6 שדות-הצבע שהגנרטור מזריק, בערכי-Pure.
- **הדגל:** `node machtzev/generator/genesis-gen.mjs --pure` ⇒ מלביש את כל הרבנייה ב-`BsPure` במקום `BsTokens`. **ללא הדגל = בדיוק כמו היום (ביט-זהה).** הפיך (חוק-7).

## 6 · חיווט למנוע-האחד  →  `machtzev/one.mjs`
שלבים שנוספו: **שער-שפת-העיצוב** (`pure-lint --selftest` + `--strict`) · **פירוק-התצוגה** (`pure-decompose`) · **מנוע-עיצוב 6** (`ds-pure` בלולאת מנועי-העיצוב).

## אימות (CI genesis-compile · flutter analyze)
`https://github.com/meir7651231-ui/buildsmart/actions/workflows/genesis-compile.yml`
- #104 ✅ `ds_pure.dart` (שכבה-B) · #106 ✅ `ds_seam`+`pure_surface` (שכבה-C) · #109 `BsPure`+`DsPure.accent` (חיבור).

## איך "מלבישים Pure" (בשורה)
```bash
node machtzev/generator/genesis-gen.mjs --pure   # הרבנייה ⇒ Pure (הפיך: בלי --pure = כמו היום)
node machtzev/pure/pure-lint.mjs --strict         # שער-המראה 0B/0M
node machtzev/police.mjs --fast                   # שער-הריפו ירוק
```

**גבול-כנות:** אין פה אפליקציה חיה — הכל בתוך המחצב (הבנייה-מחדש) בדרך למחולל. הלקוח החי לא זז.
