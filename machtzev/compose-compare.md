# מנוע מול סוכנים — תוצאות על 15 החלקיקים (3.9.2026)

3 סוכני-זרע (חמושים בחוק+מגן-המזייפים) מול המנוע-הדטרמיניסטי. **כל הסוכנים דחו מזייפים נכון**
(count_up · countdown_timer · badge_pill · check_pop(מצב-כלוא) · live_status_dot · trend_stat-אחוז ·
radial_gauge · linear_progress · stat_block · line_spark · trend_card) — המגן עבד ב-100%.

| חלקיק | מנוע (שמרן) | סוכן (מקסימלי) | הכרעה |
|---|---|---|---|
| ריצה | StatusChip·1 | BareStat×3 (cur ÷ rate = ימים, החילוק גלוי) | **סוכן** — "N ימים" לבד = תובנה-כעובדה |
| השוואה | NeonBars+BareStat×2 | NeonBars+BareStat(מרווח)+**StatRow**(כיסוי-כבר) | **סוכן** — StatRow-סף עדיף על אחוז-ערום |
| מלאי | StatRow·1 | StatRow+BareStat(חוסר) | **הסכמה~** — StatRow ליבה; +חוסר גבולי (=qty) |
| מצב | StatusChip·1 | StatusChip+GaugeMeter+BareStat | **סוכן** — מד-דחיפות אמיתי (gauge_meter נושא-ערך) |
| כמות | BareStat·1 | BareStat×3 (נוכחי·יעד·=להזמנה) | **סוכן** — תבנית-הזהב "עלות" |
| מועד | StatusChip·1 | AlertBanner (glyph+tone+message, 2 ערוצים) | **סוכן** — ערוץ-glyph למצב, לא-צבע-בלבד |
| עלות | BareStat×3 | (זהה — דוגמת-הזהב) | **הסכמה מלאה** ✓ |
| KPI | KpiTile×4 (₪→hero) | **StatHero + BareStat×4** (מספר-על + פירוק) | **סוכן** — hero+פירוק (refactoring-ui) |
| טריאז' | DsSection | DsSection (זהה; דחה AlertBanner ככפל) | **הסכמה מלאה** ✓ |
| עובדות | StatusChip | StatusChip (דחה badge_pill-פועם, premium_chip-כפתור) | **הסכמה מלאה** ✓ |
| זהות | MediaRow·1 | MediaRow + StatusChip(מצב) | **סוכן** — ל-MediaRow אין ערוץ-tone |
| פעולה | SoftButton·1 | SoftButton·1 (דחה check_pop=מצב-כלוא) | **הסכמה מלאה** ✓ |

## מה התוצאות מלמדות
1. **הסכמה = ודאי (5 חלקיקים):** עלות · טריאז' · עובדות · פעולה · (ליבת-מלאי). אלה **נעולים** — מנוע-שמרן וסוכן-מקסימלי מסכימים.
2. **מחלוקת = הסוכנים מקסמו נכון (7 חלקיקים):** ריצה · השוואה · מצב · כמות · מועד · KPI · זהות. הסוכן פירק תובנה שהמנוע-השמרן עצר עליה — **וההצדקה מוצקה** (עם אטומים-אמיתיים, file:line).
3. **המנוע היה שמרן-מדי:** גזר פעולות רק מהאופרטור-העליון בנוסחה (`×`,`vs`), פספס שחילוק (ריצה `cur/rate`) והפרש (כמות `target−cur`) הם גם-הם תובנות-מתפרקות.

## התיקון למנוע (הכללים שנלמדו מהסוכנים)
- **`÷` ו-`−` הם תובנות-מתפרקות** (לא רק `×`,`vs`): חשוף אופרנד+אופרנד+תוצאה (BareStat×3).
- **סיווג-לפי-סף (band)** = תובנה: פסק(StatusChip)+מיקום(GaugeMeter)+מניע(BareStat).
- **מדד-כותרת (KPI)** = hero(StatHero)+פירוק(BareStat×N), לא tiles-שטוחים.
- **מצב על אטום-חסר-tone** (MediaRow) ⇒ הוסף StatusChip(tone).
- **בורר-מזייפים מורחב:** count_up·countdown_timer·badge_pill·check_pop·live_status_dot·trend_stat(%).

**מסקנה:** סוכנים = מנוע-חי שמגלה כללים; מנוע = נעילה-דטרמיניסטית שמונעת-סטיה. הסוכנים **שדרגו את כללי-המנוע**;
הכללים המעודכנים ⇒ מנוע-v2 יגזר את המקסימום דטרמיניסטית. זה בדיוק bootstrap→engine.
