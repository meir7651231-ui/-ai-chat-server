# חוזה · קופסת-חיבורים "שכבת-ההעצמה" (הקוקפיט)

**מקור-האמת (L4):** `maor/src/components/supporters/{cockpit,intel,segments,
portfolio,constellation,commands}.ts` — 27 חוטי-ההעצמה. הקופסה מחווטת אותם לפי
גרף-הקריאות; קריאת-שכן ⇒ שקע מוזרק (LAW חוק-1/3). אף אטום לא מייבא אטום.

## שקעי-האגרגט (חיצוניים — נכרכים בקופסה מהמחסן; ה-board מזין מהתומכים)
- **supCount · supLast · supIls · supUsd** `(sp) => number|string` — אגרגט-תומך טהור.
- **supTier** `(score) => string` — דרגה מניקוד.
- **hokDue** `(supporters, todayIso) => Supporter[]` — הו״ק שטרם-נרשמה החודש;
  נכרך מ-`hok-due` + `hokEffectivelyActive` + `hokRecordedThisMonth(·,·,HOK_CAT)`.
- **hokMonthlyTotal** `(supporters, usdRate, todayIso) => number` — סך-הו״ק-צפוי;
  נכרך מ-`hok-monthly-total` + `hokEffectivelyActive`.
- **orgCalEntries** `(supporters) => Entry[]` — אירועי-לוח כלל-ארגוניים; נכרך מ-
  `org-cal-entries` + `supDonEvents` (ללא-config ⇒ fallback עברי, ביט-זהה).

## החלטות החיות בקופסה (סדר-ההצתה, חוק-5)
- **daysSince ≡ cockpitDaysSince** — כינוי-שקע: השם שהחוטים-האחים מצפים לו.
- **בנייה מלמטה-למעלה:** בסיסים חסרי-תלות (`cockpitDaysSince`/`dayDiff`/`donorScan`/
  `trendFromScan`/`cockpitCollectedThisMonth`) ⇒ נגזרות (`cockpitAtRisk`/`cockpitThanks`/
  `rfm|churn|forecast-FromScan`) ⇒ מורכבי-על (`cockpitCalls|Kpis|Queue`/`donorIntel`/
  `segmentCounts`/`portfolioIntel`/`tierTrendCounts`/`donorConstellation`).
- **ברירות-מחדל verbatim מהמקור:** `rate=3.7` · `silentDays=60` (COCKPIT_SILENT_DAYS)
  · `windowDays=3` (COCKPIT_THANK_DAYS) · `feed limit=8` · `months=12` · `topN=10`.
- `buildCommands`/`filterCommands` — טהורים, אפס-שקע (עצמאיים).

## החשיפה (דוגמאות מספריות — fixture: 4 תומכים, TODAY=2026-08-24)
- `cockpitDaysSince('2026-08-20', TODAY)` ⇒ **4**.
- `cockpitAtRisk(sups, TODAY).map(id)` ⇒ **['c','b']** (שקטים מעבר-סף, ממוינים).
- `cockpitCollectedThisMonth(sups, TODAY)` ⇒ **400** (‏100 ב-08-20 + 300 ב-08-23).
- `cockpitThanks(sups, TODAY)` ⇒ **['thanks:d']** (תרם ב-08-23, בחלון 3-ימים).
- `cockpitKpis(sups, TODAY)` ⇒ **{total:4, collected:400, expectedHok:150, atRisk:2}**.
- `cockpitQueue(sups, TODAY).total` ⇒ **4**; `kinds` ⇒ `['call','call','thanks','hok']`.
- `segmentCounts` ⇒ 5 סגמנטים `[atrisk:2, goldsilent:0, hok:1, gave12m:3, noemail:4]`.
- `tierTrendCounts` ⇒ `[זהב:0, כסף:0, ארד:2(rising 2), רדומה:2(stable 2)]`.
- `donorConstellation(sups, TODAY).length` ⇒ **4** (כוכב לכל תומך).
- `buildCommands({supporters}).length` ⇒ **5**.

## הערת-החלפה (חוק-7)
טוענת-לצד את קופסת-התומכים; שער-אימות = זהב-ירוק + אפס-ריק ⇒ היפוך-דגל אחד הפיך.
המקור החי (cockpit.ts ואחיו) נשאר שלם עד שהבעלים מכבה.
