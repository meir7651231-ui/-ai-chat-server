# מנוע-ההרכבה — פלט על 25 החלקיקים

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
| 16 | איתור | `q ⇒ ניקוד-רב-מילתי-מנורמל (smartScore)` | תובנה·2 | DsSearch + smartFilter |
| 17 | זיהוי-חריגה | `נעילת-ציר-AND (finderMatches)` | תובנה·2 | FilterChipPill + finderMatches |
| 18 | טבלה | `records × 10 שדות-אמת` | עובדה·1 | DsTable |
| 19 | תנועות | `intakeLog ⇒ rows+Σcost` | תובנה·2 | DsSection(כותרת+Σ) + TimelineItem |
| 20 | פאנל-פריט | `GlassCard(זהות+מצב+תנועות+פעולה)` | תובנה·5 | GlassCard + MediaRow + StatRow(מלאי מול יעד) + TimelineItem + SoftButton |
| 21 | מצב-ריק | `shown==0` | עובדה·1 | EmptyState |
| 22 | ייצוא | `items ⇒ CSV+BOM (toCsv⊕csvEscape)` | תובנה·2 | SoftButton + toCsv |
| 23 | הרשאות | `role ⇒ show/hide (roleOf⊕canGrantedAction)` | תובנה·3 | SegmentedSwitch + roleOf + canGrantedAction |
| 24 | אוטומציות | `פקיעה + מלאי-מת ⇒ התראה (expiringIntakes⊕warehouseValue)` | תובנה·3 | AlertBanner + expiringIntakes + warehouseValue |
| 25 | מחזור-חיים | `active ⇒ תג + toggle (StatusChip⊕SoftButton)` | תובנה·2 | StatusChip(לא-פעיל) + SoftButton(toggle) |

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
- `DsSearch` ← ds/ds_search.dart:5 value+onChanged (מבוקר)
- `smartFilter` ← dart-maor/smart-filter.dart:84 ⊕smartScore⊕normSearch (לוגיקה §21)
- `FilterChipPill` ← screens__manager_dashboard_screen/filter_chip_pill.dart:7 selected+onTap (מבוקר)
- `finderMatches` ← dart-maor/finder-matches.dart:23 locks+axisValue (לוגיקה §21)
- `DsTable` ← ds/ds_table.dart:7 labels+rows+מיון
- `TimelineItem` ← premium/lists/timeline_item.dart title+time+body
- `GlassCard` ← premium/surfaces/glass_card.dart:5 required this.child
- `EmptyState` ← premium/feedback/empty_state.dart glyph+message
- `toCsv` ← dart-maor/to-csv.dart ⊕csvEscape⊕exportAllowed (לוגיקה §21)
- `SegmentedSwitch` ← premium/actions/segmented_switch.dart items+selected+onSelect
- `roleOf` ← dart-maor/role-of.dart admin/teacher/staff (לוגיקה §21)
- `canGrantedAction` ← dart-maor/can-granted-action.dart גידור-פר-מפתח (לוגיקה §21)
- `AlertBanner` ← premium/feedback/alert_banner.dart message+tone+glyph
- `expiringIntakes` ← dart-maor/expiring-intakes.dart ⊕shopExpiryWarnDays (לוגיקה §21)
- `warehouseValue` ← dart-maor/warehouse-value.dart Σqty×cost (לוגיקה §21)

**מזייפים חסומים במנוע (בחירה בהם ⇒ throw):** stat_block · linear_progress · radial_gauge · bar_chart · sparkline

**סיכום:** 10 תובנות (מרובות-אטומים) · 15 עובדות (אטום-יחיד). המנוע דטרמיניסטי — אותה נוסחה תיתן תמיד אותה הרכבה, ואף פעם לא מזייף.
