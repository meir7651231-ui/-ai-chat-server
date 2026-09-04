# מנוע-ההרכבה — פלט על 60 החלקיקים

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
| 26 | לוח·טריאז' | `cockpitQueue ⇒ תור+סיבה · cockpitProgress` | תובנה·4 | cockpitQueue + cockpitProgress + StatRow + DsTable |
| 27 | לוח·מגמה | `trendFromScan(סדרה-חודשית) ⇒ {dir,pct}` | תובנה·2 | trendFromScan + TrendStat |
| 28 | לוח·ייצוא | `cockpitCsvRows ⇒ CSV` | תובנה·2 | SoftButton + toCsv |
| 29 | לוח·הרשאות | `הנהלה/ועד/מזכירות ⇒ show/hide` | תובנה·3 | SegmentedSwitch + roleOf + canGrantedAction |
| 30 | תלמידים·רישום | `שדות-ליבה + פרטים-נוספים` | תובנה·3 | DsField + DsEnumField + DsPrimaryButton |
| 31 | תלמידים·ייבוא | `parseCsv ⇒ תצוגה-מקדימה ⇒ רישום` | תובנה·3 | DsField + parseCsv + DsTable |
| 32 | תלמידים·סיכון | `חוזה-הסיכון (4 אותות) ⇒ 0–100` | תובנה·3 | trendFromScan + GaugeMeter + StatusChip |
| 33 | תלמידים·קשר-הורה | `waLink(phone-מוזרק)` | תובנה·3 | AvatarTile + waLink + SoftButton |
| 34 | תלמידים·איתור | `smartScore⊕normSearch` | תובנה·2 | DsSearch + smartFilter |
| 35 | תלמידים·חריגה | `finderMatches` | תובנה·2 | FilterChipPill + finderMatches |
| 36 | נוכחות·גיליון | `sheetSummary(date, roster)` | תובנה·3 | sheetSummary + DsTable + SoftButton |
| 37 | נוכחות·יחס | `present/total ⇒ 0..1` | תובנה·2 | sheetSummary + ProgressRing |
| 38 | נוכחות·השלמות | `pendingMakeups ⇒ תזמון` | תובנה·3 | pendingMakeups + TimelineItem + SoftButton |
| 39 | נוכחות·חג/שבת | `holidayOf⊕blockReason(today)` | תובנה·3 | holidayOf + blockReason + StatusChip |
| 40 | נוכחות·מגמה | `trendFromScan(נוכחות-חודשית)` | תובנה·2 | trendFromScan + TrendStat |
| 41 | חוגים·תפוסה | `enrollCount / capacity · waitlistFor` | תובנה·3 | enrollCount + waitlistFor + StatRow |
| 42 | חוגים·התנגשות | `buildSlots⊕scheduleClashText` | תובנה·3 | buildSlots + scheduleClashText + AlertBanner |
| 43 | חוגים·הקמה | `חוג+חדר(inline)+מורה` | תובנה·3 | DsField + DsEnumField + DsPrimaryButton |
| 44 | חוגים·טבלה | `courses × columnDefs` | עובדה·1 | DsTable |
| 45 | מורים·עומס | `coursesOfTeacher⊕sessionsOf ⇒ שעות/שבוע` | תובנה·3 | coursesOfTeacher + sessionsOf + DsBars |
| 46 | מורים·הסמכות | `certExpiryStatus(today)` | תובנה·3 | certExpiryStatus + StatusChip + AlertBanner |
| 47 | מורים·לוח-משימות | `DsBoard(stages, records)` | תובנה·2 | teacherIdOf + DsBoard |
| 48 | מורים·קשר | `waLink(phone-מוזרק · חוק-6)` | תובנה·3 | AvatarTile + waLink + SoftButton |
| 49 | חדרים·גריד-שבועי | `weeklyRoomSessions ÷ קיבולת-משבצות` | תובנה·3 | sessionsOf + weeklyRoomSessions + DsTable |
| 50 | חדרים·התנגשות | `conflictsOf ⇒ altRooms ⇒ autoRelocate` | תובנה·3 | buildSlots + scheduleClashText + AlertBanner |
| 51 | חדרים·חסימה | `blockReason(שבת/חג/צום-נדחה)` | תובנה·3 | holidayOf + blockReason + StatusChip |
| 52 | חדרים·ייצוא | `CSV/iCal` | תובנה·2 | SoftButton + toCsv |
| 53 | גבייה·יתרה | `payBal⊕enrollmentPaidStatus` | תובנה·3 | payBal + enrollmentPaidStatus + BareStat |
| 54 | גבייה·הוראת-קבע | `hokDue(month)` | תובנה·3 | hokDue + StatusChip + SoftButton |
| 55 | גבייה·חיוב | `חיוב-יחיד/מרוכז + הסדר N/M` | תובנה·3 | DsField + DsEnumField + DsPrimaryButton |
| 56 | גבייה·ייצוא | `toCsv (אפס-קבלה)` | תובנה·2 | SoftButton + toCsv |
| 57 | הורים·קשר | `waLink(phone-מוזרק · חוק-6)` | תובנה·3 | AvatarTile + waLink + SoftButton |
| 58 | הורים·שידור | `bulkWaRecipients⊕renderTemplate` | תובנה·3 | bulkWaRecipients + renderTemplate + SoftButton |
| 59 | הורים·כרטיס | `ExpandableTile(הסכמות, לוג)` | תובנה·2 | ExpandableTile + MediaRow |
| 60 | הורים·הרשאות | `מחנך/הנהלה/הורה ⇒ show/hide` | תובנה·3 | SegmentedSwitch + roleOf + canGrantedAction |

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
- `cockpitQueue` ← dart-maor/cockpit-queue.dart (List,String,num,…) (לוגיקה §21)
- `cockpitProgress` ← dart-maor/cockpit-progress.dart (Map,Set) (לוגיקה §21)
- `trendFromScan` ← dart-maor/intel-trend-from-scan.dart (Map) ⇒ {dir,pct} (לוגיקה §21)
- `TrendStat` ← premium/dataviz/trend_stat.dart:8-10 value+delta+label (אחוז-אמת בלבד)
- `DsField` ← ds/ds_field.dart:8 onChanged (מבוקר)
- `DsEnumField` ← ds/ds_enum_field.dart:7 onChanged (index: collection)
- `DsPrimaryButton` ← ds/ds.dart:244 label+onTap
- `parseCsv` ← dart-maor/parse-csv.dart (String) (לוגיקה §21)
- `GaugeMeter` ← premium/dataviz/gauge_meter.dart (index: fields)
- `AvatarTile` ← premium/lists/avatar_tile.dart:11-13 initials+title+subtitle
- `waLink` ← dart-maor/wa-link.dart (phone-מוזרק · חוק-6) (לוגיקה §21)
- `sheetSummary` ← dart-maor/sheet-summary.dart ⇒ {present,total} (לוגיקה §21)
- `ProgressRing` ← premium/dataviz/progress_ring.dart:69 value 0..1
- `pendingMakeups` ← dart-maor/pending-makeups.dart (List,String?) (לוגיקה §21)
- `holidayOf` ← dart-maor/holiday-of.dart (DateTime, hebParts, scanHebYear, …) (לוגיקה §21)
- `blockReason` ← dart-maor/block-reason.dart (DateTime, hebParts, …) (לוגיקה §21)
- `enrollCount` ← dart-maor/enroll-count.dart (db, course) — מחריג wait (לוגיקה §21)
- `waitlistFor` ← dart-maor/waitlist-for.dart (db, course) (לוגיקה §21)
- `buildSlots` ← dart-maor/build-slots.dart (Map,Map,String,…) (לוגיקה §21)
- `scheduleClashText` ← dart-maor/schedule-clash-text.dart (…, T) (לוגיקה §21)
- `coursesOfTeacher` ← dart-maor/courses-of-teacher.dart (db, teacher) (לוגיקה §21)
- `sessionsOf` ← dart-maor/sessions-of.dart (course) (לוגיקה §21)
- `DsBars` ← ds/ds_bars.dart (index: series)
- `certExpiryStatus` ← dart/cert_expiry_status.dart (DateTime, DateTime) (בנייה-חכמה §21)
- `teacherIdOf` ← dart-maor/teacher-id-of.dart (db, email-מוזרק · חוק-6) (לוגיקה §21)
- `DsBoard` ← ds/ds_board.dart:9-12 stages+records+stageOf+titleOf
- `weeklyRoomSessions` ← dart-maor/weekly-room-sessions.dart (Map, room, String, sessionsOf) (לוגיקה §21)
- `payBal` ← dart-maor/pay-bal.dart (Map, paidOf) (לוגיקה §21)
- `enrollmentPaidStatus` ← dart-maor/enrollment-paid-status.dart (Map, payBal, paidOf) (לוגיקה §21)
- `hokDue` ← dart-maor/hok-due.dart (List, String, hokEffectivelyActive…) (לוגיקה §21)
- `bulkWaRecipients` ← dart-maor/bulk-wa-recipients.dart (List, waDigits) (לוגיקה §21)
- `renderTemplate` ← dart-maor/render-template.dart (Map?, String, Map, List) (לוגיקה §21)
- `ExpandableTile` ← premium/lists/expandable_tile.dart:10-11 title+body

**מזייפים חסומים במנוע (בחירה בהם ⇒ throw):** stat_block · linear_progress · radial_gauge · bar_chart · sparkline

**סיכום:** 44 תובנות (מרובות-אטומים) · 16 עובדות (אטום-יחיד). המנוע דטרמיניסטי — אותה נוסחה תיתן תמיד אותה הרכבה, ואף פעם לא מזייף.
