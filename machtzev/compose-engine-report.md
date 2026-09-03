# מנוע-ההרכבה — פלט על 15 החלקיקים

| # | חלקיק | נוסחה | סוג | אטומים (הכי-טוב-לייעוד) |
|---|---|---|---|---|
| 1 | ריצה | `daysLeft=cur/rate` | עובדה·1 | StatusChip |
| 2 | השוואה | `daysLeft vs lead` | תובנה·3 | NeonBars + BareStat(מרווח) + BareStat(כיסוי%) |
| 3 | מלאי | `cur / target` | עובדה·1 | StatRow |
| 4 | מצב/band | `band(mustOrderIn)` | עובדה·1 | StatusChip |
| 5 | כמות | `target − cur` | עובדה·1 | BareStat |
| 6 | מועד | `mustOrderIn⇒מילה` | עובדה·1 | StatusChip |
| 7 | עלות | `qty × price` | תובנה·3 | BareStat(כמות) + BareStat(מחיר) + BareStat(=עלות) |
| 8 | KPI היום | `count(band==2)` | עובדה·1 | KpiTile |
| 9 | KPI בקרוב | `count(band==1)` | עובדה·1 | KpiTile |
| 10 | KPI יחידות | `Σ qty` | עובדה·1 | KpiTile |
| 11 | KPI ₪ | `Σ(qty×price)` | עובדה·1 | stat_hero |
| 12 | טריאז' | `group by band` | עובדה·1 | DsSection |
| 13 | עובדות | `rate/supplier/price` | עובדה·1 | StatusChip |
| 14 | זהות | `name+glyph+summary` | עובדה·1 | MediaRow |
| 15 | פעולה | `mark ordered` | עובדה·1 | SoftButton |

## הוכחת-נושא-ערך (שקע-הדאטה פר-אטום) + מזייפים-חסומים
- `StatusChip` ← premium/feedback/status_chip.dart:7 required this.label
- `NeonBars` ← premium/dataviz/neon_bars.dart:5 labels+values
- `BareStat` ← bare_stat.dart:6 (inkColor לפי-סימן)
- `StatRow` ← premium/lists/stat_row.dart:11-13 value+fraction
- `KpiTile` ← premium/dataviz/kpi_tile.dart value/label
- `stat_hero` ← premium/surfaces/stat_hero.dart:5 required this.value
- `DsSection` ← ds/ds.dart:155 title+tone
- `MediaRow` ← premium/lists/media_row.dart:12-15 title/subtitle/glyph
- `SoftButton` ← premium/actions/soft_button.dart:7 label+onTap

**מזייפים חסומים במנוע (בחירה בהם ⇒ throw):** stat_block · linear_progress · radial_gauge · bar_chart · sparkline

**סיכום:** 2 תובנות (מרובות-אטומים) · 13 עובדות (אטום-יחיד). המנוע דטרמיניסטי — אותה נוסחה תיתן תמיד אותה הרכבה, ואף פעם לא מזייף.
