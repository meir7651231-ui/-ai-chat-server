# 💰 סגירה · מסך-גבייה ותשלומים (SchoolOS · FEES) — 4.9.2026

> **המפרט (SSOT):** `knowledge/SPEC-FEES-FULL-2026-09-04.md` · **הקובץ:** `new/dart-gen-bs/schoolos_fees.dart` (`FeesScreen`, const, ללא main)
> **מראה:** `buildsmart/app_flutter/lib/genesis/dart-gen-bs/schoolos_fees.dart` · **בדיקת-widget:** `buildsmart/app_flutter/test/genesis_fees_test.dart`
> נבנה **בדרך** (THE-WAY · הכרעה 23-ב/ג/ד): מטרה → 6 פעולות-יסוד → אטום-הכי-טוב-לייעוד **בשתי-השכבות** (מאור + בנייה-חכמה + האורקל) → הרכבה → חיווט-בשקעים → אימות-רנדר (build web + Playwright) + בדיקת-widget → משטרה ירוקה → commit+push.
> **⚠️ גבול-כספי חרוט (נשמר):** המסך רושם חיובים/תשלומים ומזכיר — **אינו** מנפיק קבלות-מס ואינו סולק. קבלה/סליקה/קישור/חשבונית = שער-חיצוני = **מקום-שמור** (חוק-7). אפס מספרי-קבלה מומצאים. אפס `Date.now` (today מוזרק `2026-09-04`).

## הדרך (איך נבנה — לא מה)
1. **מטרה:** *"שכל שקל שמגיע ייגבה בזמן, ששום משפחה לא תיפול בין הכיסאות, ושהמנהל/ת יידע בדיוק מה נגבה, מה חסר ומה בסיכון — בלי לבייש איש."*
2. **6 פעולות-יסוד:** איתור · הערכת-מצב (חיוב−תשלום=יתרה · ותק) · זיהוי-חריגה (ותיק · הו״ק-נכשלה · הסדר-בפיגור · כפול) · **הכרעה** (סיכון-מאוחד ⇒ הפעולה-הנכונה) · ביצוע · אימות.
3. **חיפוש-מלא לפני בחירה:** `ls new/dart-maor | grep pay|hok|charge|receipt|discount|remind…` (74 קבצים רלוונטיים) + סריקת `atom-index-full.json` (1402 · 275 התאמות) + `search-record` חתומה (`machtzev/audit/search/2026-09-04-גבייה-…-68afcb66.json`). **42 מנועי-לוגיקה + 24 אטומי-תצוגה + 5 תאומי-דאטה** מחווטים — אפס inline.
4. **הרכבה רקורסיבית:** כל חלקיק-תובנה = 2–5 אטומים (תצוגה⊕לוגיקה). עובדה (תווית+ערך) = אטום-יחיד.
5. **חיווט דרך שקעים:** זהות (מיילי-תפקיד `@school`), `payUrl` (שער-חיצוני, ריק בהצבה), `today` — מוזרקים (חוק-6). אפס Container/Text כתחליף-ליכולת.
6. **אימות-מול-המטרה ברנדר:** 7 צילומי-Chromium (ראשי · פאנל · טבלה · הו״ק · תזכורות · דוחות · מחנך) + **8 בדיקות-widget** ירוקות (800×2400, pump מפורש).
7. **באגים שהרנדר/הבדיקה תפסו (הקומפילציה פספסה):** (א) חיוב-שכ״ל כפול בדאטה-הבסיס של פרץ ⇒ יתרה 8,400 במקום 4,200 · (ב) הו״ק חיה-ונרשמה לא הורידה סיכון/תזכורת (23-ד: האות חובר להחלטה) · (ג) "לפני-שבוע" חושב ב-clamp בתוך-החודש ⇒ 01/09 במקום 28/08 · (ד) `reverse:true` ב-SingleChildScrollView-RTL הסתיר את הטאב-הראשון · (ה) צפוי-מהו״ק לא התאפס אחרי רישום (הורכב hokDue⊕hokMonthlyTotal) · (ו) גליפים ⊕/⇒ בתוויות = ריבועים בפונט-עברי · (ז) מחנך/ת ראה פרטי-חוב דרך שבבים/באנרים ⇒ מצב דגל-בלבד.

## דאטה-אמת (§20-ג · אפס-זיוף) — מקורות
| ישות | שדות | מקור (legacy/entities.json · maor) |
|---|---|---|
| משפחה | name · payer(father/mother) · phone · email · idNum · members[{first,grade}] · discount→criteria · nextDate/nextNote | `Family` · `Member` · `Supporter.nextDate/nextNote` |
| חיוב | id · date · amount · cur · cat · method · memberId · installmentOf · cancelledAt · note | `PlannedCharge` + `Enrollment.memberId` |
| תשלום | rid · date · amount · method (+ שדות-שער-חיצוני שמורים) | `Payment` |
| שיבוץ | totalDue · carryBalance · paidFull ⇒ `payBal`/`payCredit`/`enrollmentPaidStatus` | `Enrollment` (חוזה pay-bal.contract.md) |
| הו״ק | amount · cur · day · method · active · startedAt · kevaId + hist[{d,a,c,clearer}] | `Hok` · `Supporter.hist` |
| תזכורת | calls[{at,outcome,grade}] | `Supporter.calls` (`CallEntry`) |
| הנחה | criteria[{id,discountPct}] — הגבוה-מנצח | `max-discount-pct.contract.md` |
**⛔ ללא-מקור ⇒ מקום-שמור (לא זויף):** receiptNo · clearingRef · invoiceNo · payUrl/payLinkSent · ניסיון-חיוב-חוזר · הדפסה/PDF · פעולת-סגירת-שנה · הזנת-הרשמה-לחוג (מודול-חוגים).

## הגלים (כל גל: בנייה→analyze→בדיקה/רנדר→משטרה→commit→push)
| # | יכולת | הרכבה (הכי-טוב-לייעוד) | שכבות |
|---|---|---|---|
| 1 | דאטה-אמת + KPI-10 | payBal⊕payCredit⊕enrollmentPaidStatus⊕grandTotal⊕hokDue⊕hokMonthlyTotal⊕maxDiscountPct⊕effectivePrice · StatHero⊕StatRow⊕BareStat×10 | תצוגה+לוגיקה |
| 2 | רשימת-חייבים (טריאז' לפי סיכון) + טבלה | risk (23-ד) ⊕ קיבוץ · MediaRow⊕StatRow⊕BareStat×3⊕StatusChip⊕AlertBanner · DsTable מונחית-columnDefs | תצוגה+לוגיקה |
| 3 | פאנל-משפחה + 9 טאבים + 15 פעולות | GlassCard⊕MediaRow⊕NeonBars⊕DsBars⊕TimelineItem⊕SegmentedSwitch⊕SoftButton · טפסים DsEnumField⊕DsNumberField⊕DsDateField⊕DsField⊕DsPrimaryButton · פנקס-פעולות (state) + אודיט | תצוגה+state |
| 4 | איתור + חריגה | DsSearch⊕smartFilter⊕smartScore⊕normSearch · FilterChipPill×9⊕DsEnumField×6⊕finderMatches (15 צירים) ⊕ dateInRange⊕donationYears | תצוגה+לוגיקה |
| 5 | מצבים-10 + הרשאות-6 | roleOf⊕canGrantedAction · SegmentedSwitch · נעילת-כספים (מחנך=דגל-בלבד) · הורה=משפחתו בלבד · טעינה (CircularProgressIndicator) · שגיאה (AlertBanner, שמור) | תצוגה+לוגיקה |
| 6 | אוטומציות | segulaReminders⊕waPaymentText (מדורג עדינה→רגילה→הנהלה) · supScore⊕tierOf⊕trendFromScan⊕dayDiff (סיכון) · hokEffectivelyActive (נכשלה) · chargeDedupKey (כפול) · strongMatchForCharge (matching) · overdueContactTaskDrafts (מעקב) · הנחת-אחים-אוטו · דוח-גזבר-שבועי · חוב-לפני-טיול · סוף-שנה | לוגיקה+תצוגה |
| 7 | מקום-שמור + ייצוא | columnDefs (4 שקעי-שער) · paymentMeta · payLink(payUrl='') ⇒ כפתור-שמור · toCsv⊕csvEscape⊕exportAllowed | חוזה-דאטה |
| 8 | בדיקת-widget + דוח | 8 בדיקות · צילומים · כרטיס-מטרה חתום | אימות |

## ✅ בנוי-מול-יעד (כנה · סעיף-סעיף)
| סעיף-מפרט | סטטוס |
|---|---|
| 5 אזורים | ✅ 5/5 (פאנל = bottom-sheet · טאבים = 9 בפאנל + 6 מבטי-על) |
| KPI-10 | ✅ 10/10 מערכי-אמת (BareStat; אפס StatBlock) |
| 16 עמודות-ליבה | ✅ 16/16 נגזרות (הערה = Supporter.nextNote) + 4 עמודות-שער-חיצוני = **מקום-שמור** (מוארות כשיגיע נתון) |
| שדות-מתקדמים (13) | ✅ 9 (פירוט-חיוב · חלקי · הסדר · מדיניות-הנחה · מלגה · הו״ק · החזרים · ביטול+סיבה · תאריך-יעד=תאריך-החיוב/הפריסה) · **מקום-שמור 4** (קישור · קבלה · סליקה · חשבונית) |
| כפתורי-פעולה (16) | ✅ 13 (חיוב · מרוכז-לכיתה · תשלום · חלקי · ביטול · הנחה/מלגה · הסדר 2/3/6 · הפעל/הפסק-הו״ק · רישום-הו״ק-מרוכז דו-שלבי · תזכורת · חוב-אבוד · CSV · היסטוריה/אודיט) · **מקום-שמור 3** (קישור-תשלום · PDF · הדפסה — תצוגת-מצב-חשבון קיימת) |
| פילטרים (13) | ✅ 13/13 (9 צ׳יפים + 6 בוררי-ערך + טקסט) דרך finderMatches |
| פאנל משפחה (10 פריטים) | ✅ 10/10 (יתרה צבועה-לפי-ותק · פירוק · ציר · הו״ק · הנחות · תזכורות+תגובה · הסדר · הפעולה-הנכונה · פעולות) |
| טאבים (9) | ✅ 9/9 |
| מצבים-מיוחדים (10) | ✅ 10/10 (אין-חיובים=נחום · הכל-שולם=שמעוני · ותיק=לוי · הו״ק-נכשלה=לוי · הסדר-בפיגור=פרץ · מלגה-מלאה=אברהם · כפול=ביטון · טעינה · שגיאה(שמור) · נעילת-כספים=מחנך) |
| הרשאות (6) | ✅ 6/6 · סכומים=הרשאת-כספים · מחנך=דגל-בלבד (אפס ₪ · אפס פרטי-חוב) · הורה=משפחתו |
| אוטומציות (10) | ✅ 8 · **מקום-שמור 2** (ניסיון-חיוב-חוזר = שער-סליקה · חיוב-אוטו-בהרשמה = הזנה ממודול-חוגים) |
| אינטגרציות (5) | ✅ 3 (תלמידים/משפחות · חוגים=חיוב-פר-חוג · הורים=תפקיד+תזכורת) · **מקום-שמור 2** (מונים ללוח-הנהלה = חיווט-המנהל · שער-חיצוני) |

**סיכום:** תואם-מפרט **101/113** · מקום-שמור **12** · ❌ **0**.

## מקור-האמת של האטומים
- **לוגיקה (dart-maor, 42):** shekel · payBal · payCredit · enrollmentPaidStatus · maxDiscountPct · effectivePrice · dayDiff · hokEffectivelyActive · hokRecordedThisMonth · hokDue · hokMonthlyTotal · hokMethodLabel · hokCat · supScore · supLast · supCount · supIls · supUsd · supTotalIls · tierOf · trendFromScan · segulaReminders · waPaymentText · overdueContactTaskDrafts · chargeDedupKey · strongMatchForCharge · payLink · dateInRange · monthKey · donationYears · fmtDate · countBy · grandTotal · smartFilter · smartScore · normSearch · finderMatches · toCsv · csvEscape · exportAllowed · roleOf · canGrantedAction.
- **תצוגה (dart-ui-bs, 24):** DsScaffold · DsSection · DsTable · DsSearch · DsBars · DsEnumField · DsNumberField · DsDateField · DsField · DsPrimaryButton · BareStat · GradientCard · GlassCard · StatHero · MediaRow · StatRow · TimelineItem · NeonBars · TrendStat · SegmentedSwitch · SoftButton · AlertBanner · StatusChip · StatusDot · EmptyState · FilterChipPill.
- **דאטה (dart-data-maor, 5):** hok-effectively-active-sockets · hok-recorded-this-month-sockets · hok-method-label-terms · tier-of-terms · overdue-contact-task-drafts-sockets.
- **מזייפים שלא נגעו:** StatBlock · DataGrid · linear_progress · radial_gauge · bar_chart · sparkline · timeline_flow · ShimmerSkeleton · PremiumStat(sparkline).

## הכרעות-אמת (§20-ג — מה לא נבנה ולמה)
- **קבלת-מס / סליקה / קישור-תשלום / חשבונית / PDF** — שער-חיצוני שאינו קיים בהצבה ⇒ שקעים שמורים (`columnDefs` · `paymentMeta` · `payUrl`). `payLink` מהמדף מחווט; `payUrl=''` ⇒ `null` ⇒ הכפתור מוצג כ"שער לא-מוגדר", לא מזייף קישור.
- **ניסיון-חיוב-חוזר להו״ק-נכשלה** — פעולת-סליקה ⇒ שמור; ההתרעה + הורדת-דחיפות-תזכורת בנויות.
- **חיוב-אוטו-בהרשמה-לחוג** — דורש הזנת-Enrollment ממודול-החוגים (נבנה במקביל, אסור לייבא) ⇒ שמור; חיוב-פר-חוג ידני/מרוכז קיים.
- **סגירת-שנה** — הסיכום (סגורות/יתרה-להעברה/זכויות) בנוי; פעולת-ההעברה ל-carryBalance נעולה עד אישור-הנהלה (שמור).
- **מונים ללוח-ההנהלה** — `_FeesData.k*` נגזרים; חשיפה ציבורית = חיווט-המנהל (המסך אינו מייבא/מיוצא בין-מודולים).

## מה לא אומת (D3 · אמור מה-לא-בדקת)
- **אמוג׳י ברנדר-Chromium** מוצגים כריבועים — הסנדבוקס חוסם את `fonts.gstatic.com` (fallback-emoji של CanvasKit); הטקסט העברי והמספרים מאומתים. בבדיקת-widget הטקסטים (כולל אמוג׳י) נמצאים ב-finders.
- **טופס חיוב-מרוכז לכיתה** ו**הסדר 2/6** — אומתו בקומפילציה ובלוגיקה (`setArrangement`, `addCharge` bulk); לא צולמו ולא נבדקו ב-widget (נבדקו: תשלום-מלא בטופס, תשלום-חלקי, הו״ק-מרוכז).
- **`DsTable` ברוחב 16+ עמודות** — מגלישה אופקית (כמו במלאי); לא נבדק על מסך-נייד צר.
- `flutter build web` הופק לרתמת-preview לא-מוגשת (`_fees_preview_main.dart`, מחוץ ל-git); המסך עצמו ללא `main`.

## אימות
`flutter analyze lib/genesis/dart-gen-bs/schoolos_fees.dart` — No issues · `flutter test test/genesis_fees_test.dart` — **8/8** · `police --fast` ירוק (22 ran · 0 failed) · `pre-push` משטרה-מלאה ירוקה (29 ran) · כרטיס-מטרה `machtzev/audit/goals/schoolos_fees.json` (21 מודלים · 21 אטומים · 8 מבחני-קבלה · תמונה 1000×2600).
