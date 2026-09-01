# 🏛️ Orbit Genesis — הבנייה-מחדש הנקייה
> הריפו הזה נולד בתול ב-24.8.2026 ונשאר כזה: כל קובץ נכנס דרך המחצב,
> עם חוזה ובדיקה, תחת חוקי-החשמלאי. אין כאן ולא יהיה כאן קוד-לגאסי.
> **ענף-העבודה:** `claude/hei-rxv1v1`. אין push ל-main בלי אישור-בעלים.

## 📖 מסמכי-כניסה (בשורש)
| קובץ | מה זה |
|------|--------|
| `CLAUDE.md` | הוראות-לכל-סשן · שער-הכניסה · סדר-הקריאה (נעול-חתימה) |
| `LAW.md` | 7 חוקי-החשמלאי (חוקת-הבעלים: אטום · קופסה · לוח-אם) (נעול-חתימה) |
| `PURPOSE.md` | המטרה הנעולה — מה כל bit נמדד מולה |
| `WIRING.md` | מפת-החיווט החיה (מחוללת ע"י `gen-wiring-doc.mjs` — לא לערוך ידנית) |
| `README.md` | הקובץ הזה — מפת-העץ המלאה |
| `MPRAT.md` | **מפרט קובץ-קובץ** — מה יש בכל קובץ אנושי-כתוב (369) + חוק-שמות-המדף |

## 🗂️ מפת-העץ (top-level)
```
new/           7,575  📦 המדף — כל האטומים (מקור-האמת החי)
screens-seed/    853  🎬 קורפוס-הפירוק — 254 מסכים + קטלוג-מונחים
machtzev/        224  🏭 המפעל — מנועים · משטרה · המחולל   → ראה machtzev/INDEX.md
archive/         600  ⚪ חומר-שמור לא-פעיל (לא-נמחק · לעיון)
box-drafts/       85  📐 תוכניות-קופסה + מד-מוכנות
knowledge/        23  📚 דוחות · ניתוחים · HANDOFF · SESSION-LOG
engine/           19  ⚙️ המחולל כחבילה עצמאית אפס-דאטה (Sentence→UI)
design/           13  🎨 מוקאפי-עיצוב (HTML) + נכסים
runtime/           2  🌉 גשר-רנטיים web (Dart→JS)
dart-quarry/       1  ⚪ סמן-מחצבה (רוקנה — הטיוטות קודמו)
```

## 📦 `new/` — המדף (פירוט תת-תיקיות)
| תיקייה | # | תוכן |
|--------|---|------|
| `atoms/` | 2,224 | 🟢 **חוטים-טהורים JS** (מקור-האמת). מנועי-maor, דאטה מוזרקת-בשקע. |
| `dart-maor/` | 1,246 | לוגיקת-maor מומרת ל-Dart (58 כבר-מייבאים תאום-טהור · שאר=חוב-שיורד). |
| `dart/` | 674 | ליבת-Dart אימפריאלית. |
| `dart-data-maor/` | 454 | 🟢 **תאומי-דאטה-Dart טהורים** (`…-data`/`…-strings`/`…-terms`). |
| `dart-gen-bs/` | 142 | פלט-המחולל (`gen_app_*.dart`). |
| `boxes/` · `dart-boxes/` | 128 · 124 | קופסאות-חיווט JS + Dart. |
| `dart-ui-bs/` | 94 | אטומי-widget (census). |
| `dart-screens-bs/` · `dart-boards-bs/` | 81 · 80 | מסכים · לוחות. |
| `dart-data/` · `dart-data-bs/` | 58 · 10 | אטומי-דאטה. |
| `board.*` · `generator.*` · `screens.dart` | — | אטומי-שורש קנוניים (proof+contract+test). |

## 🏭 `machtzev/` — המפעל
מפת-הכלים המלאה: **`machtzev/INDEX.md`**. בקצרה:
- **בשורש-`machtzev/`:** כניסות-על (`one` · `run` · `police` · `census`) + השערים-הנעולים
  (`wiring/contract/quarry/selftest/mutation/pins-check` · `data-purity-check` · `deep-purity-scan`) + `gates.tsv`/`pins.sha256`/מסמכים.
- **תת-תיקיות לפי-תפקיד:** `generator/` (28 · המחולל) · `assemble/` (16) · `extract/` (15) ·
  `emit/` (14 · JS↔Dart) · `purity/` (11 · טוהר) · `carve/` (9) · `dedup/` (6) · `tools/` (5) ·
  `mahulal/` (4 · קבלת-מחולל) · `census/` (3) · `behavioral/` (4).

## 📚 `knowledge/` — היכן להתחיל משימה
- `SESSION-LOG-2026-09-01.md` — היומן החי (הכי-עדכני · קרא ראשון בהמשך-סשן).
- `INVENTORY-EMPIRE-RAW-MATERIAL-*.md` · `ATOM-TRUTH-INDEX-*.md` — census + אינדקס-אמת.
- `CLOSED-*.md` — דוחות-סגירה פר-מהלך.

## 🚨 בדיקת-הכול (המשטרה — ירוקה לפני כל commit)
```bash
node machtzev/police.mjs --fast   # 11 שערים · שניות (Node בלבד)
node machtzev/police.mjs          # + selftest + mutation · לסוף-גל
```

## 🏭 המנוע-האחד (המפעל המלא)
```bash
node machtzev/one.mjs             # רענון→פירוק→דדופ→מונחים→הרכבה→טוהר→משטרה→ONE-STATUS.md
```

מקור-האמת המלא + מרשם-האטומים: ריפו `maor-system`, ‏`machtzev/registry/`.
