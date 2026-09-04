# 👪 סגירה · מסך-הורים ותקשורת (SchoolOS) — 4.9.2026

> **מפרט (SSOT):** `knowledge/SPEC-PARENTS-FULL-2026-09-04.md` · **הקובץ:** `new/dart-gen-bs/schoolos_parents.dart` (1,533 שורות · מחלקה ציבורית `ParentsScreen`, const, ללא main)
> **מראה:** `buildsmart/app_flutter/lib/genesis/dart-gen-bs/schoolos_parents.dart` · **בדיקת-widget:** `buildsmart/app_flutter/test/genesis_parents_test.dart` (13/13 ירוקות)
> **כרטיס-מטרה+רנדר:** `machtzev/audit/goals/schoolos_parents.{json,png}` · **רשומות-חיפוש:** 8 ב-`machtzev/audit/search/2026-09-04-*`
> נבנה בדרך (THE-WAY · הכרעה 23-ב/ג/ד): מטרה → 7 פעולות-יסוד → חיפוש-מלא (מאור+בנייה-חכמה+אורקל) → הרכבה → חיווט-בשקעים → אימות-רנדר → משטרה.

## המטרה (צעד-1)
*"ששום הורה לא יגלה משהו על ילדו מאוחר מדי — ושהצוות יגיע לכל הורה בערוץ הנכון, בזמן הנכון, בטון הנכון, ויידע שההודעה נקראה."*

## פעולות-היסוד (צעד-2) והאטומים שמגלמים (צעד-3, הכי-טוב-לייעוד · שתי-השכבות)
| פעולה | לוגיקה (dart-maor / dart / דאטה) | תצוגה (dart-ui-bs) |
|---|---|---|
| איתור | smartFilter⊕smartScore⊕normSearch · finderMatches (10 צירים) · countBy | DsSearch · FilterChipPill · DsEnumField (כיתה/ערוץ/שפה) · DsTable(columnDefs) |
| הערכת-מצב-קשר | phoneIssue⊕waDigits⊕formatIsraeliPhone (זהות מוזרקת) · tzStaleDays · supportUnread · sortSupportThreads | StatusChip (שבב-קשר פר-הורה) · BadgeCount · MediaRow |
| זיהוי-חריגה | dayDiff (לא-נקרא>72ש׳ · קשר-לא-עודכן) · taskOverdue · expiringIntakes⊕shopExpiryWarnDays · cockpitAtRisk (שקט) | AlertBanner (מרכז-אוטומציות) · DsSection (טריאז' 4 דליים) |
| הכרעה (ערוץ/זמן/העלאה) | smartChannel (מה-ההורה-עונה-לו) · contactWindow (PREFIX_TZ·QUIET_FROM/TO) ⊕ blockReason⊕hebParts ⊕ timeToMin ⇒ sendHold · reminderTier | StatusChip ⏸ · AlertBanner 🌙/🕯 |
| ביצוע | sanitizeSupportText⊕isSendableSupportText⊕supportMsgMax · waLink · bulkWaRecipients · renderTemplate⊕templateDefs · openTasksFor · upcomingMeetings | SoftButton×38 · DsField/DsEnumField/DsDateField · PremiumToggle · GlassCard-sheets |
| אימות | sortSupportMsgs⊕supportMsgTime⊕supportDayLabel⊕supportPreview · toCsv⊕csvEscape⊕exportAllowed · auditReportLines · digestLines | PureBubble (receipt sent/delivered/read) · TimelineItem (לוג/אודיט) · StatRow (נקראו-מתוך-נשלחו) · DsBars (ערוצים/שפות) |
| הרשאה | roleOf⊕canGrantedAction (5 תפקידים) · visibleViews (משמורת גוברת · חוק-6) · languageOptions | SegmentedSwitch (תפקיד · 9 טאבים · מבטים) · StatHero⊕BareStat×10 (KPI) |

**ספירה (grep):** 39 ייבואי-לוגיקה (dart-maor) · 25 ייבואי-תצוגה (dart-ui-bs) · 6 ייבואי-דאטה/dart (quiet-hours-data · block-reason-data/strings · phone-issue-strings · support-day-label-strings · digest_lines).

## תואם-מפרט · בנוי-מול-יעד (כנה)
| סעיף-מפרט | יעד | ✅ בנוי | מקום-שמור | ❌ |
|---|---|---|---|---|
| 5 האזורים | 5 | 5 | | |
| KPI עליון | 10 | 10 (משפחות · קשר-מעודכן · ללא-קשר-תקין · נשלחו-החודש · נקראו% · ממתינים · פגים · פניות-פתוחות · זמן-תגובה · פגישות-השבוע) | | |
| עמודות-ליבה | 16 | 16 ב-`columnDefs` (הערה/עדכון = שדה-מואר-כשיש) | | |
| שדות-מתקדמים | 12 | 6 (משמורת · שעות-נוחות · שפה · אפוטרופוס · הורה-לא-מורשה · עריכת-תבניות) | 6 (אנשי-קשר-חירום = מוזרק חוק-6 · תרגום · פורטל-מזוהה · חתימה-דיגיטלית · תשלום-מהפורטל · צ׳אט-חי) | |
| כפתורי-פעולה | 16 | 16 | | |
| פילטרים/חיפוש | 11 | 11 (+ ציר הסדר-ראייה) | | |
| פאנל הורה-נבחר | 8 | 8 | | |
| טאבים פנימיים | 9 | 9 | | |
| מצבים-מיוחדים | 10 | 9 | 1 (שגיאה — שקע `_error`, מאיר כשיהיה fetch) | |
| הרשאות | 6 | 6 (5 תפקידים + משמורת-גוברת) | | |
| אוטומציות | 10 | 9 | 1 (תרגום-אוטו: דגל-שפה⊕isRtl — אין מנוע-תרגום במדף) | |
| אינטגרציות | 6 | 3 (תלמידים·נוכחות·גבייה — הזנות `childFeed/absenceFeed/feesFeed`) | 2 (חוגים/מערכת · לוח⇒אישורים — שקעים בפורטל) | 1 (לוח-הנהלה: בעלות-קבצים §2 — המנהל מחבר) |
| **סה"כ** | **119** | **108** | **10** | **1** |

## הכרעות-אמת (§20-ג · אפס-זיוף)
- **זהות/קשר של הורים = חוק-6:** שמות · טלפונים · מייל · איש-קשר-חירום **אינם בקובץ**. `ParentsScreen(identity: …)` מזריק בהצבה; בלי הזרקה ⇒ "🔒 מוזרק-בהצבה"/"🔒 לא-הוזרק" (מקום-שמור, לא זיוף). הרנדר והבדיקה מזריקים זהות **סינתטית** (קידומות-בדיקה).
- **"נקרא" = רמת-שיחה** (maor `unreadUser==0`), לא פר-הודעה — buildsmart `MsgStatus{pending,sent,delivered,failed}` (sys_chat.dart:60) אינו מכיל `read`. receipt-לבועה נגזר: הודעות-צוות עד גבול-הלא-נקרא = read, אחריו = delivered.
- **שעות-מנוחה:** הקופסה `new/boxes/quiet-hours.mjs` קיימת ב-JS בלבד (אין תאום-Dart) ⇒ `contactWindow` הורכב ב-Dart מאותם אטומי-דאטה (`PREFIX_TZ`·`QUIET_FROM`·`QUIET_TO`) — **חוב-המרה מתועד**. שבת/שישי/חוה"מ מ-`blockReason`; מפת-חגים-נקובים = שקע `holidays` (ריק ⇒ רק שבת/שישי/חוה"מ).
- **תרגום-אוטו:** אין מנוע-תרגום במדף ⇒ דגל "🌐 תרגום-אוטו: <שפה>" בלבד (מקום-שמור), לא תרגום-מזויף.
- **הזנות-בין-מודולים** (נוכחות/גבייה/תלמידים) = שקעי-אינטגרציה עם דמו-ריאליסטי; המודולים המקבילים נבנים במקביל (אין ייבוא-צולב · §2).

## אימות (מה-נבדק · מה-לא)
- `flutter analyze --no-fatal-infos lib/genesis` — **0 errors** (43 infos/warnings בעץ, לא שלי).
- `flutter test test/genesis_parents_test.dart` — **13/13**: KPI+מצב-קשר-מזהות-מוזרקת · מקום-שמור ללא-הזרקה · finderMatches (לא-מגיב ⇒ f2+f5) · פאנל-שיחה (PureBubble + נכשל + שליחה ⇒ 3→4) · שעות-מנוחה (22:00 ⇒ queued) · משמורת (הורה f3/p2 רואה נוכחות בלבד) · היקף-מחנך · מצב-טעינה · **טאבי תבניות (12 = 5 מדף + 7 בית-ספר, נספר ב-grep) / מוסדי (bulkWaRecipients) / לוג / אודיט** · **שידור-לכיתה י׳-1 ⇒ נשלחו 2 · מוחזקים 1 · נכשלו 1** · **שידור-מוסדי ⇒ נשלחו 4 · מוחזקים 5 · נכשלו 2** (חסום מדולג) · **חסימת-שבת (today=2026-09-05 מוזרק ⇒ blockReason='שבת' ⇒ queued) + מצב-משבר עוקף ⇒ נשלח** · **הדפסת-מכתב (sc.letter ⊕ digestLines)** · **ייצוא-לוג (כותרת-CSV + רשומה · מחנך ללא-כפתור)**.
- **רנדר-אמת** (`flutter build web --no-web-resources-cdn` + Playwright/Chromium, 1000×2800): `machtzev/audit/goals/schoolos_parents.png`. **הרנדר תפס באג שהקומפילציה פספסה:** מספר בקידומת-בינ"ל (+1) נפסל ע"י `phoneIssue` (ישראלי) למרות ש-`waDigits` מקבל אותו ⇒ תוקן (בינ"ל נשפט ב-E.164 בלבד; hero 5→4).
- `police --fast` — ירוק (22 ran · 0 failed) · pre-commit (cross-source · goal-proof · truth-fresh · ratchet) ירוק.
- **חוב-§6 (4.9, הכוונת-מנהל) — נסגר:** חמש היכולות שהיו "בקריאת-קוד בלבד" (טאבי תבניות/מוסדי/לוג/אודיט · שידור-לכיתה/מוסד · חסימת-שבת · הדפסת-מכתב · ייצוא-לוג) מאומתות עכשיו בבדיקות-widget דטרמיניסטיות (6 בדיקות נוספות). הבדיקות תפסו שתי טעויות-בודק (V5): סדר-הטריאז' (דורש-פעולה ראשון ⇒ הפאנל נפתח לפי כותרת-כרטיס, לא לפי `.first`) וספירת-תבניות (12, לא 13 — נספר ב-grep).
- **לא-אומת (הצהרה D3, שארית):** ההודעות-המוחזקות (queued) אינן משוחררות אוטומטית בפתיחת-החלון — אין שעון-רץ במנוע (today/nowHour מוזרקים); שחרור = חוזה-הצבה של המתזמר. גליפי-אמוג'י מרונדרים כ-□ בסנדבוקס (אין פונט-אמוג'י) — מגבלת-סביבה, לא באג.

## חוב פתוח
- תאום-Dart לקופסת `quiet-hours` (JS) — כרגע הרכבה מקומית במסך.
- הזרקת מפת-חגים ל-`blockReason` (שקע `holidays`).
- חיבור ניווט-ביתי ורישום-חלקיקים במנוע — **המנהל** (§2).
