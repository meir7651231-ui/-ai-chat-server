# INVENTORY · חומר-הגלם של האימפריה + תובנת-התפר — 2026-08-31

מקור: ביקורת-נחיל 5-סוכנים (Preact · Flutter · maor · שכבת-לוחות · מדף-אטומים), כל
טענה מעוגנת ב-file:line. נכתב אחרי תת-ספירה חוזרת (483→1,459→4,763) — **מסמך-האמת
כדי שלא נתת-ספור שוב.**

## 0. המספרים האמיתיים (מעוגן)
| ריפו | class-ים | מהות |
|---|---|---|
| buildsmart | 2,318 | Flutter (`app_flutter`) + Preact-PWA (`app/`) |
| genesis (-ai-chat-server) | 1,487 | המחצב + המחולל |
| maor-system | 958 | CRM-עמותה חי (React/TS) |
| **סה"כ** | **~4,763** | ברמת-אטום-מפורק ≈ ה-51K |

## 1. שלושת החצאים המנותקים
```
אטמי-חזות (buildsmart+genesis)   מנועים-טהורים (maor)      לוחות (genesis)
~101 גנריים: גרף/לוח-שנה/gantt/    calendar/dedup/RFM/        79 מסכים · 366 שקעים
tabs/טפסים/אפקטים/device-caps     cockpit/§46/audit          (board-gen.mjs חי)
❌ אפס-דאטה (חוט-תצוגה)           ❌ בלי-UI (lib.ts טהור)   ❌ דורמנטי, מנותק מישויות
```

## 2. תובנת-התפר (הסיבה היחידה — כל 5 הסוכנים מצאו לבד)
> **`DsBars` מחווט כי `{required List<double> values}`. `bar_chart` לא — כי `{int seed}` וממציא ערכים.**

מתוך ~101 אטמי-החזות — **רק ~10 מקבלים דאטה אמיתית** (List). השאר "חוטי-תצוגה"
אפס-דאטה במכוון (`mini_calendar.dart:39` today==תא-17; גרפים מפברקים מ-seed). **תפר-
חיבור-הנתונים הושמט מכולם בכוונה.** לכן המחולל מחווט 13 (ל-ds יש תפר) ולא 101.

## 3. המכרות — פר-שכבה (TOP, מעוגן)
**maor (מנועים טהורים, `lib.ts`, בדוקים, דטרמיניסטיים):**
- לוח-עברי `calendar/calLib.ts` (736ש׳) — גריד-כפול · חזרה-שנתית מודעת-אדר · התנגשות-חדרים · ICS 385-יום. **התכשיט.**
- יומן-חדרים `diary/DiaryView.tsx` · dedup `lib/dedup.ts` (Union-Find, money-safe) · RFM/churn `supporters/intel.ts` (single-pass, 30-50k) · cockpit `supporters/cockpit.ts` · §46 `lib/receipt.ts` (FNV-code) · audit `lib/audit.ts` (8-קטגוריות).
- ⚠️ רבים `=== true` opt-in דורמנטיים — קיים-בקוד ≠ גלוי-בלקוח.

**buildsmart-Flutter (`lib/genesis/dart-ui-bs`, ~90 אפס-דאטה):**
- גרפים: bar/donut/radar/line_spark/heat_grid/radial_gauge/progress_ring · mini_calendar · gantt_bar · timeline_flow.
- שדות: ds_field/number/date/toggle + otp/pin/dual_range/tag/star/seg_picker.
- device: signature_pad · barcode · voice · camera · PDF-seam · geolocation.
- 3 מנועי-הרכבה: `lib/genesis` (משפט→מסך, רץ) · `lib/atoms` (JSON-manifest + `when`) · `lib/studio` (עורך-חזותי, 896 element-descriptors).

**buildsmart-Preact (`app/`):** מנוע-dial רקורסיבי (`{id,emoji,title,children}` = DSL) · kernel-הגדרות הצהרתי · חיפוש-fuzzy · voice/barcode. **אין** טבלה/גרף/לוח-שנה.

**genesis (מדף + לוחות):**
- ~101 אטמי-חזות (83 curated-clean + 18 ds), רק ~10 data-bindable (animated_tabs/accordion/carousel/chip_cloud/seg_picker/dropdown/stat_block/quick_tools_list).
- **44 פונקציות-לוגיקה wire-ready היום** (27 dart-maor + 17 dart, String-scalar) — המחולל כבר שולף כ-xform. ~150 טיוטות ישלשו אחרי retype (dynamic→String, ניקוי-JS).
- אטלס = **כל** 483 ה-widgets (לא מסונן; `atlas.mjs:41`). הצמצום ב-`render-ds`: INPUTS דורש כותרת `שדה לנתון` (רק 7 ds מצהירים).
- **board-gen** (`machtzev/assemble/board-gen.mjs`, שלב 4ג ב-one.mjs): ממלא שקעי-מסך מ**מקור-בנייה-חכמה**, לא מישויות. 366 חורי `TODO-לוח` דורמנטיים. מנותק מ-app-ds/render-ds (נפגשים רק ב-`genesis_gallery.dart`).

## 4. מה חסר באמת (מאומת 5×)
- Kanban אמיתי (drag בין-עמודות) — **אין** באף שכבה. יש status-grouped-lists.
- גרפים data-bound (מעבר ל-DsBars) · טבלה ממוינת/מדפדפת · לוח-שנה-פורס-אירועים · Gantt-UI-גנרי — כולם **קיימים כקונכיה-חזותית, בלי תפר-דאטה**.

## 5. המהלך (retrofit-התפר, לא בנייה-מאפס)
1. להוסיף `values`/`events`/`data` לאטמי-האפס-דאטה (דפוס DsBars) — ~שורה כל אחד.
2. `render-ds` בוחר וכורך ישות: אגרגט→גרף · שדה-תאריך→לוח-שנה · שלבים→timeline.
3. 10 האטומים עם `List` → זמינים מיד. שכבה-2: לחבר board-gen (מקור-פתרון #6 ב-`board-gen.mjs:287-307`) ⇒ ישות→מסך-אמת.

## 6. למה זה לא היה מסודר עד עכשיו
לא בגלל אי-סדר — הריפו **מתועד-כבד** (LAW/LEARNINGS/DECISIONS/30+ CLOSED-*/board-gen-report/atlas). אבל התיעוד **פר-גל ופר-מסלול** (יומני-תהליך), אף פעם לא **אינוונטר-חוצה-שכבות**. שני המסלולים (DS-generator · board-gen) התפתחו בנפרד, כל אחד עם הדוקים שלו. תובנת-התפר **אמרג'נטית** — נראית רק בסריקת-כל-השכבות-בו-זמנית, שאיש לא עשה בפעם-אחת. CLAUDE.md הוא נרטיב-כרונולוגי שהצטבר ⇒ התמונה-הגדולה קבורה. מסמך זה הוא ה-census החסר.
