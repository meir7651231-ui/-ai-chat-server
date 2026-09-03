# 📦 סגירה · מסך-מלאי-מלא (SchoolOS) — 3.9.2026

> **הכרעת-בעלים:** "אני רוצה מסך מלאי מלא" ⇒ המפרט `SPEC-INVENTORY-FULL-2026-09-03.md` במלואו.
> נבנה **בדרך** (THE-WAY · הכרעה 23-ב/ג/ד) — 11 גלים, כל אחד מאומת בבייטים + מנוע + רנדר + משטרה.
> קובץ: `new/dart-gen-bs/schoolos.dart` (מראה ל-buildsmart `app_flutter/lib/genesis/`).

## הדרך (איך נבנה — לא מה)
1. **מטרה** (לא צורה): *"לדעת מצב-אמת של כל פריט בזמן-לפעול — שום דבר לא נשמט, אפס-הפתעות."*
2. **פירוק ל-6 פעולות-יסוד:** איתור · הערכת-מצב · זיהוי-חריגה · הכרעה · ביצוע · אימות.
3. **בחירת אטום-הכי-טוב-לייעוד מ-2 המקורות + אורקל** — לכל חלקיק, בשתי-השכבות (תצוגה+לוגיקה §21).
4. **הרכבה** (חוק-ההרכבה: לעולם לא אטום-יחיד למטרה) — לא ציור-ביד.
5. **אימות-מול-המטרה ברנדר** — לא "מתקמפל". תפס 3 באגים שהקומפילציה פספסה
   (TrendStat→אחוז-במקום-ימים · MediaRow-בולע-קליק · fontFamily-monospace-ריק-בסנדבוקס).

## 11 הגלים
| # | יכולת | הרכבה (הכי-טוב-לייעוד, מהמדף) | שכבות |
|---|---|---|---|
| 1 | דאטה-אמת + KPI-8 | סוכני-חקר + compose-engine · BareStat×8 (אפס-StatBlock מזייף) | תצוגה+לוגיקה |
| 2 | טבלה | DsTable (לא DataGrid מזייף) | תצוגה |
| 3 | תנועות | intakeLog ⊕ TimelineItem (לא timeline_flow) | תצוגה+לוגיקה |
| 4 | פאנל-פריט + פעולות | GlassCard ⊕ MediaRow ⊕ StatRow ⊕ SoftButton + פנקס-curOf | תצוגה+state |
| 5 | **איתור + חריגה** (סגירת-קיצור 23-ג) | DsSearch⊕smartFilter⊕smartScore⊕normSearch · FilterChipPill⊕finderMatches | תצוגה+לוגיקה |
| 6 | ייצוא | SoftButton ⊕ toCsv ⊕ csvEscape ⊕ exportAllowed | תצוגה+לוגיקה |
| 7 | הרשאות-פר-תפקיד (חוק-6) | SegmentedSwitch ⊕ roleOf ⊕ canGrantedAction | תצוגה+לוגיקה |
| 8 | אוטומציות פרואקטיביות | AlertBanner ⊕ expiringIntakes ⊕ warehouseValue | תצוגה+לוגיקה |
| 9 | פריט-לא-פעיל | StatusChip ⊕ SoftButton-toggle (דגל active) | תצוגה+state |
| 10 | **מקום-שמור ל-18 עמודות** (חוק-7) | חוזה-דאטה columnDefs (כמו metaFields) | חוזה-דאטה |
| 11 | מצבי-מסך שמורים | טעינה (CircularProgressIndicator) · שגיאה (AlertBanner) — מקום-שמור | תצוגה+state |

## עקרון-הליבה: מקום-שמור (חוק-7 · מבחן-הקונכייה · הכרעת-בעלים "כמו הספק והמחיר")
כל יכולת/עמודה/מצב שאין-לו-נתון עדיין — **יש לו מקום-שמור** שמאיר לבד ברגע שהנתון מגיע,
**אפס-שינוי-קוד**. 18 עמודות-המפרט = שקעי-דאטה (`columnDefs`); שדה מואר רק כשיש ערך, חסר ⇒ שקט.
הודגם: `warehouse`+`barcode` ⇒ עמודות מחסן/ברקוד האירו מיד. אותו דין למצבי טעינה/שגיאה.

## המנוע הדטרמיניסטי (compose-engine)
25 חלקיקים ≡ דוח (`compose-engine-report.md`), שער `compose-determinism` ירוק, 5 מזייפים חסומים.
כל חלקיק-תובנה מורכב מ-2–5 אטומים (תצוגה⊕לוגיקה); כל אטום מאומת ב-`grep` build≡מנוע.
**מזייפים שנחסמו/נדחו:** StatBlock · linear_progress · radial_gauge · bar_chart · sparkline
(במנוע) · DataGrid · timeline_flow · ShimmerSkeleton (זוהו ע"י הסוכנים, מתועדים ב-COMPOSE-INVENTORY).

## הכרעות-אמת (§20-ג · אפס-זיוף — מה לא נבנה ולמה)
- **8/18 עמודות ללא-מקור-אמת** (סוג/מחסן/מיקום/שמור/נק׳-הזמנה/מקס/עלות-ממוצ׳/מחיר-מכירה/ברקוד):
  **לא זויפו** — שוריינו כמקום-שמור בחוזה (מאירות כשיגיע נתון).
- **needsCareShop/staleBoxes** — דומייני-חנות/קופות עם 11 שקעים לא-תואמים ⇒ נדחו (היה מזייף-שקעים);
  הורכב מהאטומים-הנכונים (expiringIntakes/warehouseValue).
- **העברה-בין-מחסנים · תחזית-ביקוש · הדפסת-ברקודים** — דורשים דאטה/היסטוריה שאין ⇒ מקום-שמור בלבד.

## מקור-האמת של האטומים
- לוגיקה (dart-maor): warehouseOverview · warehouseValue · grandTotal · intakeLog · shekel · clampScale ·
  smartFilter · smartScore · normSearch · finderMatches · toCsv · csvEscape · exportAllowed · roleOf ·
  canGrantedAction · expiringIntakes · shopExpiryWarnDays.
- תצוגה (dart-ui-bs): DsSearch · FilterChipPill · DsTable · GlassCard · MediaRow · StatRow · BareStat ·
  StatHero · SoftButton · SegmentedSwitch · AlertBanner · TimelineItem · EmptyState · StatusChip · DsSection.

## אימות
`flutter analyze lib/genesis` — אפס-errors · `compose-engine --gate` ירוק · `police --fast` 22/0 ·
רנדר-אמת מצולם פר-גל. שני הריפו מסונכרנים (ref 0/0).
