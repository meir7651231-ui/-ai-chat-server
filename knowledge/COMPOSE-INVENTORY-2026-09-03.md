# 🧩 מפרט-הרכבה · מסך-מלאי-מלא (4 סוכני-חקר → מנוע → פיקוח · 3.9.2026)

> נבנה בדרך THE-WAY. צעד-1 מטרה · צעד-2 פעולות-יסוד · צעד-3 בחירת-אטום-הכי-טוב מ**שני המקורות**
> (4 סוכנים דיסjointים, בייטים) · צעד-4 חיווט · צעד-6 אימות-רנדר. אפס-ציור-ביד · אפס-זיוף.

## 🎯 המטרה (צעד-1, מהבייטים)
לדעת את מצב-האמת של כל פריט בזמן-לפעול = **לנצח את החוסר, העודף והבזבוז — שום פריט לא נשמט, אפס הפתעות.**
הצורה (5 אזורים · 18 עמודות · 9 טאבים) = אמצעי, לא המטרה.

## 🔺 פעולות-היסוד (צעד-2 — לא אזורים/עמודות)
איתור · הערכת-מצב-אמת · זיהוי-חריגה · הכרעה · ביצוע · אימות.

---

## 🔴 ממצא-על מהסוכן-דאטה (מכריע · §20-ג — לעולם לא לזייף)
**סכמת-פריט-המלאי היחידה עם מקור-אמת** (סרוק שלושה מקורות):
| ישות | שדות-אמת | מקור file:line |
|---|---|---|
| `WarehouseItem` (מאור, ישות-23) | id · name · unit · qty · cost | `maor-system/src/types/domain.ts:464-473` |
| `ShopItem` (מאור, SHOP4/6/10) | stock · **minStock** · waits · kind · validDays · holidays · active | `domain.ts:910-930` |
| `ShopIntake` (מאור, מערך-18 · אצווה) | itemId · date · qty · kind · **source**(ספק-טקסט) · cost · **expiry** | `domain.ts:955-968` |
| `InventoryItem`/`StockItem` (בנייה-חכמה) | **sku** · price · stock · **location**('warehouse'\|'site') | `buildsmart/app_flutter/lib/data/repositories/store_inventory.dart:98`, `stock_firebase.dart:78-101` |
| `CatalogProduct` (בנייה-חכמה) | **categoryTopId/LeafId** · price · emoji | `buildsmart/app/src/data/catalog.ts:15-37` |

**שדות ללא-מקור-אמת בשום מקום (⇒ פער-חיווט, לא דאטה-מזויפת):**
`reorderQty`/נקודת-הזמנה-מחדש · ברקוד(שדה) · lot/batch נפרד(האצווה=ShopIntake שלם) ·
מחסן-מרובה(מאור=מחסן-יחיד; בנייה=בינארי) · ישות-ספק(רק source-טקסט) · runway/ימים-עד-ריקון על נתוני-מאור(אין מנוע-קצב; קיים רק `computeStockForecast` בבנייה מ-Orders).
**⇒ המסך מציג רק עמודות עם מקור; חסרות-מקור = תווית "פער-חיווט", לעולם לא ערך-מומצא.**

## 🚫 אטומים-מזייפים חסומים (זוהו בבייטים · §20-ג)
| אטום-מזייף | file:line | הוכחת-זיוף | תחליף-אמת |
|---|---|---|---|
| `DataGrid` | `data_grid.dart:6,33-43` | `int rows` דקורטיבי, פסי-צבע ריקים, אפס-מחרוזת | `DsTable` |
| `StatBlock` | `stat_block.dart:17` | `math.sin(i*1.7)*40+60` — ערך מומצא | `BareStat`/`KpiTile` |
| `Timeline`(flow) | `timeline_flow.dart:6,17` | `int events` — כמות, לא רשימה | `TimelineItem`×list |
| `ShimmerSkeleton` | `shimmer_skeleton.dart:6,9` | `int bars` — כמות-שורות מומצאת | `SkeletonBlock` |
| root `alert_banner`/`animated_empty`/`skeleton_card` | root | דורשים 3-6 צבעים-ידניים + פועם דקורטיבי | גרסאות `premium/**` |
| `chip_cloud`/`seg_picker`/`animated_toggle` | root | בולעים מצב ב-`setState`, אפס-callback | `FilterChipPill`/`SegmentedSwitch` (מבוקרים) |

---

## 🗺️ מפת-הרכבה op→atom (הכי-טוב-לייעוד · display⊕logic)

### פעולה-1 · איתור (סינון · חיפוש · קיבוץ · דירוג)
| תת-פעולה | תצוגה (שקע-פלט) | לוגיקה (מנוע) | file:line |
|---|---|---|---|
| חיפוש | `DsSearch(value,onChanged)` | `smartFilter`⊕`smartScore`⊕`normSearch` | `ds/ds_search.dart:5` · `smart-filter.dart:84` |
| סינון | `FilterChipPill(label,selected,onTap,…)` | `finderMatches(db,locks,axis)` · `numMatch` | `…/filter_chip_pill.dart:7` · `finder-matches.dart:23` |
| קיבוץ | תג-מונה | `countBy(items,key)` | `count-by.dart:8` |
| דירוג | `SegmentedPillToggle(items,activeIndex,onSelect)` | `smartFilter`/`nameSortKey`/`tierOrder` | `segmented_pill_toggle.dart:7` |

### פעולה-2 · הערכת-מצב-אמת (הפרש · יחס · צבירה)
| מדד | מנוע | חתימה | file:line |
|---|---|---|---|
| זמין = qty − הוקצה | `warehouseOverview` | `List<Map> warehouseOverview(List warehouse, List supporters, String Function(dynamic) norm)` | `warehouse-overview.dart:66` |
| ערך = Σ qty×cost | `warehouseValue` | `num warehouseValue(dynamic warehouse)` | `warehouse-value.dart:17` |
| עלות-חומרים | `matCostTotal` | `num matCostTotal(Map a)` | `mat-cost-total.dart:12` |
| סכום-כללי | `grandTotal` | `num grandTotal(List, num Function(dynamic))` | `grand-total.dart:4` |

### פעולה-3 · זיהוי-חריגה (מתחת-מינ׳ · אזל · פקיעה · סף)
| חריגה | מנוע | file:line |
|---|---|---|
| מתחת-מינ׳/אזל/restock | `needsCare` (rem==0⇒stockOut · rem<minStock⇒restock) | `needs-care-shop.dart:44,70-99` |
| פקיעה-אצוות | `expiringIntakes(db,today,isoOf,[7])` | `expiring-intakes.dart:5` |
| פקיעה-קופון | `couponExpiry(a,comp,isoOf)` | `coupon-expiry.dart:23` |
| סף-סיכון | `CRED_RED_THRESHOLD`(=500) + הרכבה | `cred-red-threshold.dart:15` |

### פעולה-4 · הכרעה (איחוד-מודלים · קיבוץ-פר-מצב)
`sev = short ∨ band` · `orderQty = max(יעד, הקצאה)` — כבר בנוי ב-`_InvData` (מודל-כפול). קיבוץ-טריאז' פר-מצב.

### פעולה-5 · ביצוע (מצב · טריגר)
| פעולה | תצוגה | לוגיקה | file:line |
|---|---|---|---|
| הזמן/קלוט/הוצא | `SoftButton(label,onTap,tone)` · `SplitAction(onMain,onMore)` | `advanceStatus(status)` · `itemRemaining` | `premium/actions/soft_button.dart:4` · `advance-status.dart:4` |
| סמן-מצב | `SegmentedSwitch(items,selected,onSelect)` | — | `premium/actions/segmented_switch.dart:4` |

### פעולה-6 · אימות (תנועות · ייצוא · KPI)
| תת-פעולה | תצוגה | לוגיקה | file:line |
|---|---|---|---|
| תנועות | `TimelineItem(title,time,body)`×list | `intakeLog(db)`{rows,totalCost} · `pullAuditRing` | `premium/lists/timeline_item.dart:4` · `intake-log.dart:26` |
| ייצוא | — | `deliveriesCsvRows`→`toCsv`(`csvEscape`) · שער `guardExport` | `to-csv.dart:3` · `guard-export.dart` |
| KPI-רצועה | `BareStat(value,label)`×8 / `KpiTile(glyph,value,label)` / `TrendStat(value,delta,label)` | `warehouseValue`·`countBy`·`needsCare`·`expiringIntakes` | `bare_stat.dart:6` · `premium/dataviz/kpi_tile.dart:5` |

### הצגה · טבלה + פאנל + טאבים
| אזור | אטום-אמת | חתימה | file:line |
|---|---|---|---|
| טבלה | `DsTable` | `DsTable({required List<String> labels, required List<List<String>> rows})` | `ds/ds_table.dart:7` |
| שורה-קומפקטית/נבחר | `PureTableRow` | `PureTableRow({label,value,meta,status:PureRowStatus,selected,zebra})` (דורש `PureScope`) | `pure_table_row.dart:11` |
| פאנל-צד | `GlassCard(child:)` / `DsCardElevated(child:)` | `({required Widget child})` | `premium/surfaces/glass_card.dart:5` |
| 9-טאבים | `SegmentedSwitch(items,selected,onSelect)` | (יחיד מבוקר — לא AnimatedTabs/SegPicker) | `premium/actions/segmented_switch.dart:4` |
| ריק | `EmptyState(glyph,message)` | premium | `premium/feedback/empty_state.dart:4` |
| טעינה | `SkeletonBlock(width,height)` | שלד-לגיטימי (מידות-בלבד) | `premium/feedback/skeleton_block.dart:4` |
| התראה | `AlertBanner(message,tone,glyph)` | premium | `premium/feedback/alert_banner.dart:4` |

---

## 📋 סדר-הרכבה (גלים · כל אחד: הרכבה→בייטים→רנדר→משטרה→push)
1. **דאטה-אמת:** סכמת-פריט מהאיחוד-האמיתי בלבד (name·unit·qty·cost·stock·minStock·source·expiry·kind + sku/category/location מבנייה); שדות-ללא-מקור = פער-חיווט מסומן.
2. **KPI-8:** 8 `BareStat` מ-`warehouseValue`/`countBy`/`needsCare`/`expiringIntakes` — אפס `StatBlock`.
3. **טבלה:** `DsTable(labels,rows)` על עמודות-האמת בלבד.
4. **פס-עליון:** `DsSearch`+`FilterChipPill`+`SoftButton`.
5. **פאנל+טאבים:** `GlassCard(child:)`+`SegmentedSwitch` + תוכן פר-טאב (Overview/Movements(`TimelineItem`+`intakeLog`)/…).
6. **פעולות+מצבים+אוטומציות:** `SoftButton`/`SplitAction` · `EmptyState`/`SkeletonBlock` · `needsCare`/`expiringIntakes`.
