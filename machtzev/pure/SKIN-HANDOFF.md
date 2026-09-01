# בריף · מנגנון DsPureSkin (עיצוב-מלא דרך החריץ)
> מסירה לסוכן. **מלוא-העיצוב (נייטרל+סמנטי) מוזרק דרך החריץ — שום צבע לא קבוע באטום.**

**ריפו:** `meir7651231-ui/-ai-chat-server` · **ענף:** `claude/mah-kora-0by8kw`
**מראה-CI:** `meir7651231-ui/buildsmart` @ `app_flutter/lib/genesis/dart-ui-bs/` → workflow `genesis-compile` (`flutter analyze`)

## מה זה
שפת-Pure ל-Dart. שלושה ערוצים זורמים דרך `PureScope`:
- `theme` (אקצנט, מורף פר-ערכה) · `fonts` (פונטים, הפיך) · `skin` (**נייטרל+סמנטי, הפיך**).

## הקבצים
| קובץ | תפקיד |
|---|---|
| `new/atoms/pure-look.mjs` | **הזרע** — הצבעים (neutral/semantic/themes/fonts). מקור-אמת יחיד. |
| `machtzev/ds-pure.mjs` | **המנוע** — זרע → `ds_pure.dart`. הרצה: `node machtzev/ds-pure.mjs` |
| `new/dart-ui-bs/ds/ds_pure.dart` | `DsPure` + `DsPureSkin`/`DsPureTheme`/`DsPureFonts` + `DsPure.skin` (מחולל — **אל תערוך ידנית**) |
| `new/dart-ui-bs/ds/ds_seam.dart` | `PureScope` (InheritedWidget) + `DsSeam.of/fontsOf/skinOf` |
| `new/dart-ui-bs/pure_*.dart` | 5 אטומי-רפרנס (bubble/date_cell/marker/table_row/surface) |

## ה-API — 14 טוקני-העור
```dart
DsPureSkin({ canvas, sunken, surface, raised, raised2, ink, mut, faint, hair, hair2,   // נייטרל
             ok, warn, err, gold })                                                     // סמנטי
```

## כלל-הזהב לכתיבת אטום
```dart
Widget build(BuildContext context) {
  final skin  = DsSeam.skinOf(context);   // מלוא-העיצוב מהחריץ
  final theme = DsSeam.of(context);        // אקצנט (מורף)
  final fonts = DsSeam.fontsOf(context);   // פונט
  return Container(
    color: skin.surface,                   // ✅ ולא DsPure.surface
    child: Text('...', style: TextStyle(color: skin.ink, fontFamily: fonts.he)),
  );
}
```
**אסור:** `DsPure.surface` / `DsPure.ink` / `DsPure.ok` וכו' קבועים בגוף אטום. תמיד דרך `skin.*`.
ל-getter/מתודה בלי `context` — מעבירים `skin` כפרמטר (ראה `_statusColor(skin)` ב-`pure_table_row.dart`).

## להזריק עיצוב חדש — 2 דרכים
**מקומי (תת-עץ):**
```dart
PureScope(
  skin: const DsPureSkin(canvas: Color(0xFF...), surface: ..., ink: ..., ok: ..., /* כל 14 */),
  child: <כל אטום>,   // לובש את העיצוב החדש
)
```
**גלובלי (ברירת-מחדל לכולם):** ערוך צבעים ב-`new/atoms/pure-look.mjs` → `node machtzev/ds-pure.mjs`.

## חוקים (לא לשבור)
- **חוק-7 (הפיך):** אין `PureScope` → `DsSeam.skinOf` נופל ל-`DsPure.skin` = טוקני-Pure → פלט ביט-זהה.
- **חוק-5/6:** האטום לא יודע איזה עיצוב פעיל; הזהות בחיווט, לא באטום.
- `import 'ds/ds_pure.dart';` נחוץ **רק** אם האטום נוקב בשם-טיפוס (`DsPureSkin`); אחרת יבוא-מיותר (הסר).

## שערי-אימות (חובה ירוקים לפני push)
```bash
node machtzev/ds-pure.mjs --check                    # ds_pure.dart טרי מול הזרע
node machtzev/police.mjs --fast                       # 13/13
# מראה ל-buildsmart + אימות קומפילציה:
cp <קבצים> /home/user/buildsmart/app_flutter/lib/genesis/dart-ui-bs/...
cd /home/user/buildsmart/app_flutter && flutter analyze lib/genesis/dart-ui-bs   # אפס errors/warnings
```
CI: push לענף ב-buildsmart מפעיל `genesis-compile` → חייב `conclusion: success`.

## מצב נוכחי
5 אטומי-הרפרנס כבר קוראים `skin.*`, אומת ב-CI (#130 ירוק). כל אטום **חדש** חייב לעקוב אחר כלל-הזהב.
