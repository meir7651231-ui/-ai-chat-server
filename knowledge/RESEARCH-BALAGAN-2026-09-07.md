# 🔬 מחקר · בלגן — עוזר חיים אחד (7.9.2026)

> הבעלים: "אתה הבנת את רמת העיצוב ורמת הפרואקטיביות? אם לא — לך תחקור."
> שלושה חוקרים במקביל · 257 מקורות (אתרים רשמיים, מרכזי-עזרה, תיעוד-API, סקירות) · כל עובדה עם URL · מה שלא אומת מסומן **unverified**.
> הנספחים (§A–§C) הם דוחות-החוקרים כלשונם. §1–§5 = הזיקוק שלי.

---

## §1 · המטרה (כפי שהמסמך מגדיר)

**להיות העוזר האחד של החיים.** אפליקציה אחת שמחליפה את כל אפליקציות-הניהול (משימות · יומן · הערות · תזמון · מיילים · הכל-ביחד) עם המינימום הטוב של כל אחת כבסיס — ומעליו מה שלאף אחת אין: היא **מכירה את החיים** של האדם (בית · ילדים · חשבונות · תורים · משפחה), חיה איתו 24/7, רואה מה מגיע אליו (מכתב · חשבון · הודעה · מסמך) **ומגיבה לבד**, לפני שהוא שואל, כדי שלא יפספס כלום.

שלוש שכבות לפי סדר המסמך: (1) **הבסיס** — 8 יכולות ממיטב-האפליקציות במסך אחד (§2) · (2) **הידיעה והיוזמה** — לא מחכה, שואלת קודם; לא מציגה, מטפלת (§4) · (3) **הדרך** — כל בעיה = מסלול = צעדים, פלט 3 דברים (§8–§10 במסמך; זה מה שנבנה ב-G23–G26). "אם צריך לחשוב — העיצוב נכשל" הוא המטרה, לא כלל-עיצוב.

---

## §2 · הבסיס המינימלי — 8 יכולות, ישויות, פעולות (זיקוק §C)

| יכולת | ישות מינימלית (שדות) | 3–5 פעולות שמשתמשים תלויים בהן | מקומי / שרת |
|---|---|---|---|
| **משימות** (Todoist) | Task: כותרת · הערות · פרויקט · תוויות · עדיפות 1–4 (1=דחוף, 4=ברירת-מחדל) · due {תאריך\|תאריך-שעה, חוזר, המחרוזת-כפי-שהוקלדה} · deadline נפרד · משך · הושלם | Quick-Add `Q` עם תחביר-inline (`#פרויקט`, `%תווית`, `p1`, `!תזכורת`, `{deadline}`, תאריך בשפה-טבעית) · השלמה (חוזר ⇒ המופע הבא) · דחייה (גרירה) · תצוגת-היום (P1 למעלה, overdue נפרד) · Upcoming | **מקומי** (הפרסר טהור) |
| **חוקי-חזרה** (Todoist) | interval+unit · ימי-שבוע · ימי-חודש · יום-סידורי ("3rd tue", "last") · workday · שעה · starting/ending · עוגן = תאריך-מקורי \| השלמה (`every!`) | פרסור "every other fri", "every 3rd Tuesday starting Aug 29 ending in 6 months" | מקומי |
| **יומן** (Google Calendar) | Event: כותרת · תיאור · מקום · start/end {date\|dateTime, tz} · משתתפים · RRULE · תזכורות · etag/updated · remoteId | list/insert/patch/delete · quickAdd (טקסט ⇒ אירוע) · watch | קריאה/כתיבה + poll: **לקוח-בלבד אפשרי** (PKCE, בלי סוד; scope `calendar.events` = אימות-אפליקציה); push בזמן-אמת = **שרת** |
| **מחסנית-חיים** (Notion) | Page {parent, title, blocks[]} · Block {type: paragraph/h1–3/bullet/numbered/todo/toggle/quote/callout/code/divider/image/table, richText} · DataSource {schema: title/text/number/select/multi/status/date/checkbox/url/email/phone/relation} + Rows | עץ-עמודים · עריכת-בלוקים (`/` פקודות, markdown-in-place) · טבלה-מוקלדת עם שורות · חיפוש | מקומי |
| **תזמון-אוטומטי** (Motion) | Task + duration · dueDate · deadlineType HARD/SOFT · priority ASAP/High/Med/Low · startOn · autoScheduled · Schedule (שעות-עבודה) · פלט: chunks[], schedulingIssue | `plan(tasks, busy, schedules, now)` — עדיפות ⇒ hard-deadline ⇒ due; פיצול לצ'אנקים; חריגה משעות-עבודה רק ל-HARD; "Can't fit" מסומן, לא נזרק | **מקומי** (מנוע טהור) |
| **שמירת-זמן** (Reclaim) | Habit: משך min/ideal/max · idealTime · חלון {ימים, מ-, עד} · תדירות · עדיפות · timeDefense (flexible/auto/defensive) · onConflict | הצבה קרוב-לאידיאל בתוך החלון · כיווץ בתוך min/max כשפגישה נוחתת · Free⇒Busy כשמתקרב | מקומי (כתיבה ליומן = סנכרון) |
| **עוזרת שפועלת** (Lindy) | Routine {trigger: schedule\|event(email/calendar/slack)+filter, instructions, destination, dryRun} · Memory (טקסט מתמיד) | CC על שרשור ⇒ קביעת-פגישה · תיוג-inbox (6 תוויות) · טיוטות-תשובה · תדריך-בוקר | **שרת + LLM + OAuth** |
| **ארגון-מיילים** (Saner) | InboxItem {source, ref, summary(AI), priority(AI), suggestedTask?, tags[]} | סנכרון תיבה · הצעת-משימה עם accept · מייל ⇒ הערה עם קישור-למקור | **שרת + LLM + OAuth** |
| **הכל-ביחד** (Akiflow/ClickUp) | — | **המסך-האחד** = 3 אזורים מסונכרנים: רשימה (Overdue / Today / Scheduled / Week) · עמודת-לוח (יום או יומיים) · שורת-פקודה (`Cmd/Ctrl+K`). גרירה מהרשימה ללוח = startTime+duration (ברירת-מחדל 30 דק׳) | מקומי |

**מסקנה:** 6 מתוך 8 = **מקומי לגמרי** (משימות · חזרה · הערות · תזמון · שמירת-זמן · מסך-אחד). יומן = לקוח-בלבד ל-poll, שרת ל-push. מיילים ועוזרת-פועלת = שרת + מודל-שפה + OAuth — **הכרעת-בעלים**.

---

## §3 · רמת-העיצוב — 15 כללים ניתנים-לאכיפה-מכנית (זיקוק §A)

| # | כלל | מקור | נכון היום במנוע? |
|---|---|---|---|
| 1 | **פעולה ראשית אחת גלויה** לכל מסך-רשימה (FAB / "הוספה"); השאר מאחורי `⋯` אחד | Todoist | ❌ (2–5 כפתורים) |
| 2 | **תיבת-קלט אחת עם תחביר-inline** במקום טופס (`#` `!` `=` `<` `//` + תאריך בשפה-טבעית); שדות נוספים אחרי `+` | Todoist · Akiflow · Sunsama | ❌ (טופס מלא) |
| 3 | **≤3 מקשים לכל פעולה**: יצירה = מקש+טקסט+Enter · השלמה = מקש אחד · ניווט = אות | Todoist · Akiflow · Sunsama | ❌ |
| 4 | **`Cmd/Ctrl+K` בכל מסך** + `?` = רשימת-קיצורים | Akiflow · Sunsama · Notion · Motion | ❌ |
| 5 | **Inbox ≠ Today**: חדש נכנס לרשימה נפרדת; בלי-תאריך לא ב-Today | Akiflow · Todoist | ❌ |
| 6 | **Overdue ראשון + פעולה-אחת לפתרון** (≤5 אפשרויות: ASAP / הארך / התעלם / ✓ / מחק) | Akiflow · Todoist · Motion | ❌ |
| 7 | **מונה-עומס בראש-היום**, 3 מצבים בלבד (ירוק/צהוב/אדום מול סף) | Sunsama | ❌ |
| 8 | **יום-יחיד = ברירת-מחדל**; שבוע/חודש במקש; מצב-Focus = משימה אחת + טיימר | Sunsama · Akiflow | ❌ |
| 9 | **טקסים לינאריים ≤5 צעדים**, כל צעד = שאלה אחת ככותרת + "דלג בעתיד" | Sunsama · Akiflow | ❌ |
| 10 | **אפס-הגדרות לפני שימוש**: ≤3 צעדי-onboarding; ברירת-מחדל לכל שדה ⇒ יצירה = טקסט בלבד | Sunsama · Motion · Todoist | ❌ |
| 11 | **טיפוגרפיה**: גוף 16px / 1.5; ראשי `rgb(55,53,47)`, משני 60%; רקע `#fff`, משני `rgb(247,246,243)`; גבול `1px rgba(0,0,0,.08)` | Notion (replica-CSS ⚠️) | ❌ (עור כהה) |
| 12 | **עמודת-תוכן ≤720–900px**, גריד 4px | Notion ⚠️ | ❌ |
| 13 | **בלוקים שטוחים, לא כרטיס-בתוך-כרטיס**; רשימה = שורות | Notion · Sunsama | ❌ (הכל כרטיסים) |
| 14 | **≤5 יעדי-ניווט** ו"עוד" אחד | Todoist · Motion-mobile | ✅ (G26: 3) |
| 15 | **המנוע מציג תוצאה, לא מכניקה**: בלוק על הלוח + מתג on/off; שדה לא-רלוונטי מתאפר, לא נעלם | Motion | חלקי |

**מה לא לאכוף כמספר** (unverified בכל 5): גובה-שורה, פריטים-למסך, נוסח-מסך-ריק. אם נדרש "48–56px לשורה" — הכרעת-מוצר, לא ציטוט.

---

## §4 · רמת-הפרואקטיביות — 15 כללים דטרמיניסטיים (זיקוק §B)

| # | כלל | מקור |
|---|---|---|
| 1 | **תזכורת-מוקדמת לפי קטגוריה**: `due − offset`, offset עריך (Todoist 30 דק׳; Lindy N דק׳ לפני פגישה; Reclaim due=יצירה+3 ימים). לחשבון: −7d/−1d · לתור: −1d/−1h · למכתב: −3d לפני מועד-שבו | Todoist · Lindy · Reclaim |
| 2 | **מיון עדיפות × מועד**: P1–P4, ואז המועד הקרוב; שוויון ⇒ פגישה > הרגל > משימה; חדש = P2 לא P1 | Reclaim |
| 3 | **תכנון-מחדש בכל שינוי-יומן, בשקט, תוך שניות**; אירועי-busy חיצוניים תמיד מנצחים | Motion · Reclaim |
| 4 | **הגנה דו-שלבית (Free ⇒ Busy)**: הופך busy כש-`time_to_start ≤ 30 דק׳` או `נשאר ≤ 1 חלון-פנוי` | Reclaim |
| 5 | **נגיעה-ידנית = נעילה**; Snooze מזיז בלי לנעול; נעול-שהוחמץ משתחרר אחרי 60 דק׳ | Motion · Reclaim |
| 6 | **הוחמץ ⇒ overdue, לא נדחף-בשקט**: מופע-חוזר שהוחמץ לא משוחזר באותה תקופה; חד-פעמי ⇒ שאלה אחת "לדחות?" | Motion · Reclaim |
| 7 | **"לא נכנס" = הסלמה**: אין חלון ב-31 יום ⇒ מסומן למעלה ומבקש עדיפות-מחדש; לא נזרק | Motion |
| 8 | **דגל hard-deadline** מתיר מחוץ לשעות-עבודה; soft לעולם לא | Motion |
| 9 | **תקציר-בוקר אחד + סקירת-ערב אחת** בשעה שהמשתמש בחר (9:00 ברירת-מחדל): אג׳נדה · overdue · ממתין-לאישור · קונפליקטים; שבועי בסוף-שבוע-העבודה | Lindy · Todoist · Reclaim · Saner |
| 10 | **הפרעה רק לפי-חוק**: התראה בזמן-אמת רק כשחוק-לבן תואם (VIP, פגישה תוך 30 דק׳, "דחוף" מפורש); השאר לתקציר | Lindy · Reclaim |
| 11 | **שאל-לפני-פעולה = כרטיס Approve / Deny / Always-allow**: קריאות לא דורשות אישור; כתיבה עם השפעה-חיצונית (שליחה, יצירת-אירוע, תשלום) ⇒ כרטיס; "אשר" = הפעולה הזו בלבד | Lindy |
| 12 | **טיוטה, לא שליחה**: אחרי N ימים בלי תשובה (1/2/3/5/7) ⇒ טיוטת-תזכורת; לעולם לא נשלח לבד | Lindy |
| 13 | **הצע-ואשר למשימות-מחולצות**: כל משימה מחולצת = הצעה עם קטע-המקור; נכנסת רק ב-Accept; מקובצות לתקציר אלא אם דחוף-לפי-חוק | Saner |
| 14 | **צעד-הבא לפי שלב**: פריט בשלב; צעדי-שלב-לא-פעיל = "רפאים" (לא מתוזמנים, לא מתריעים) עד שהשלב מופעל. מכתב: התקבל ⇒ הוסבר ⇒ הוחלט ⇒ שולם/נענה | Motion (ghost tasks) |
| 15 | **היגיינת-סנכרון**: syncToken פר-יומן; 410 ⇒ full resync; חידוש watch ≤50% TTL; תיוג כל אירוע-שנוצר ⇒ דילוג-על-הד; בלוקי-משימה חד-כיווניים | Google · Motion |

**מה דורש LLM/OCR בזמן-ריצה (אין דרך דטרמיניסטית):** קריאת מכתב/חשבון מצולם והסבר בשפה פשוטה · סיכום-מייל וחילוץ משימות/תאריכים/סכומים מטקסט חופשי · קליטה בשפה-טבעית חופשית ("תזכיר לי להתקשר לבנק ביום שישי") · כללי-התראה בטקסט חופשי ("מיילים שנראים דחופים") · ניסוח טיוטות בטון-המשתמש · למידה מתיקונים. **כל השאר** (תזמון · הגנה · טיימרים · תקצירים · כרטיסי-אישור · סנכרון) = חוקים, בלי מודל.

---

## §5 · מפת-הפער מול המנוע (מה יש · מה גל · מה הכרעה)

| שכבה | קיים היום (הוכח על «שכירות») | גל-מנוע (אני) | הכרעת-בעלים |
|---|---|---|---|
| **מסלולים** (סעיף 8–10) | ✅ תוכן + דוח-3-חלקים + שליחה (G24–G25) | 4 ספקים נוספים לגרסה 1 | 28 קבצי-המסלולים |
| **ניווט** | ✅ מבנה (G26) | — | — |
| **מראה** (§3) | ❌ 1/15 | **G27 · שכבת-מטרה**: (א) דקדוק-מסכים בספק `מסך: <שאלה> = …` · `כפתור: <שם> = …`; (ב) ניקוד-לפי-הקשר בחיפוש (פרטים=שורה, כותרת=אריח); (ג) אסימוני-עור לבנים (§3 #11–12) + חוק "בלוק שטוח" (#13); (ד) פעולה-ראשית-אחת (#1), ≤5 יעדים (#14) | — |
| **קלט מהיר** (§3 #2–4) | ❌ | **G28 · קליטה**: תיבה-אחת עם תחביר-inline + פרסר-תאריכים (דקדוק-Todoist, §C) + `Cmd/Ctrl+K` — כולו טהור | — |
| **בסיס-מקומי** (§2: משימות · חזרה · הערות · תזמון · הרגלים · מסך-אחד) | ❌ (יש ישויות גנריות) | **G29–G31**: 5 ישויות-ליבה + מנוע `plan()` טהור (Motion/Reclaim) + מסך-אחד (רשימה · לוח · פקודה) | — |
| **פרואקטיביות דטרמיניסטית** (§4 #1–15) | ❌ | **G32 · טריגרים**: `due−offset` · שלבים ⇒ צעד-הבא · תקציר-בוקר · כרטיסי-אישור · overdue-ראשון | שעת-התקציר, offsets |
| **התראות בזמן** | ❌ אין אטום | תזכורת-מקומית (plugin) | push = שרת |
| **יומן דו-כיווני** | ✅ ics חד-כיווני | poll עם syncToken (לקוח-בלבד) | OAuth-app + אימות-Google; push = שרת |
| **בינה בזמן-ריצה** (§3 סעיף 3 במסמך, §4 רשימת-LLM) | ❌ (`ai.ts` רדום) | עטיפה: הצע-ואשר (§4 #11, #13) סביב כל קריאה למודל | **LLM באפליקציה-המחוללת · מפתח · עלות · פרטיות · OCR** |
| **מיילים / עוזרת-פועלת** | ❌ | — | שרת + OAuth + LLM |

**סדר מומלץ:** G27 (מראה + מטרה — הפער שהבעלים רואה) ⇒ G28 (קליטה) ⇒ G32 (פרואקטיביות דטרמיניסטית על השלבים שכבר קיימים) ⇒ G29–G31 (הבסיס) ⇒ הכרעות-בעלים על בינה/שרת. הכל additive, כל גל = מנוע + ratchet + דוח, «שכירות» ביט-זהה או משתפרת.

---
---

## §A · נספח · דוח-החוקר: רמת-העיצוב (Todoist · Notion · Akiflow · Sunsama · Motion)

מקרא: ✅ מאומת מול המקור המצוטט · ⚠️ ממקור-משני (סקירה/replica) · ❌ unverified (לא נמצא מקור — אין להכניס מספר).

### 1. Todoist — "פשוט: מסך אחד, כפתור אחד"

**המסך הראשי (Today)**
- מציג "every task scheduled for today across all your projects"; משימות ללא תאריך **לא** מופיעות ב-Today. P1 מוצג "at the top of your Today view in red". גרירה לתחתית הרשימה = דחייה למחר. ✅ https://www.todoist.com/help/articles/plan-your-day-with-the-today-view-UVUXaiSs
- כפתורים בכותרת: **Display** (בחירת layout), **Plan** (time-blocking, ב-calendar layout — פותח "Plan sidebar" עם overdue / all-day / time-blocked), **Reschedule** למעלה-מימין ל-overdue. ✅ (אותו מקור + https://todoist.com/help/articles/360012582940)
- Layouts: List · Board · Day calendar · Week calendar · Month calendar; grouping/sorting/filter דרך Display. ✅ https://www.todoist.com/help/articles/customize-views-in-todoist-AoHhBxFdZ
- מובייל: **Dynamic Add button** בפינה ימין-תחתית; ניתן לגרור אותו למיקום המדויק ברשימה ליצירת משימה/תת-משימה. ✅ https://www.todoist.com/help/articles/use-task-quick-add-in-todoist-va4Lhpzz · ⚠️ https://www.macstories.net/reviews/todoist-foundations-key-refinements-for-the-popular-task-manager/
- פעולות ראשיות גלויות: 1 (Add task / Dynamic Add). ❌ גובה-שורה, מספר-פריטים-למסך — unverified.

**האינטראקציה הראשית — Quick Add**
- פתיחה: `Q` (web/desktop) או "Add task"; `A` = משימה בתחתית הרשימה, `Shift+A` = בראש; `Enter` = שמור וצור עוד. ✅ https://www.todoist.com/help/articles/use-keyboard-shortcuts-in-todoist-Wyovn2
- תחביר בשורה אחת: תאריך בשפה-טבעית ("tomorrow at 4 PM", "every other Tuesday starting March 3"), deadline ב-`{march 30}`, `#Project`, `/Section`, `%label`, `p1–p3`, `!14:00` תזכורת, `+Name` אחראי, `//` תיאור (ב-Quick Add `+` מרחיב שדות נוספים). ✅ https://www.todoist.com/help/articles/use-task-quick-add-in-todoist-va4Lhpzz
- דוגמאות תאריך מאומתות: "tod"/"tom", "tomorrow at 4 pm", "Fri 7pm", "in 2 hours", "in 5 days", "tom morning" (=9am), "every 3 months", "50 days before new year's eve"; מחרוזת-תאריך עד 150 תווים. ✅ https://www.todoist.com/help/articles/introduction-to-dates-and-time-q7VobO
- מקשים נוספים: `E` השלם · `T` תאריך · `1–4` עדיפות · `L` תווית · `G then T/I/U` ניווט · `/` חיפוש · `?` רשימת קיצורים. ✅ (keyboard-shortcuts article)
- **מדד keystrokes:** יצירת משימה מלאה = `Q` + הקלדה + `Enter` (2 מקשים + טקסט). השלמה = `E` (1).

**ניווט**
- Desktop sidebar: Inbox, Today, filters & labels, Favorites, פרויקטים; אייקון-sidebar משמאל-למעלה מסתיר/מציג; `Cmd/Ctrl+K` פותח תפריט-פקודות. ✅ https://www.todoist.com/help/articles/customize-the-sidebar-in-todoist-S9JLTYqZV
- Mobile bottom bar — ברירת-מחדל: **Inbox, Today, Upcoming, Team (אם יש), Browse**; אפשרויות: Inbox/Today/Upcoming/Filters & Labels/Search/Browse/Team; "Tap Browse in the bottom-right" לתפריט המלא. ✅ https://www.todoist.com/help/articles/customize-the-todoist-navigation-bar-L4qpkI0xj
- עומק: יצירה=1 (FAB), השלמה=1 (checkbox), שינוי-תאריך=2 (פתח → תאריך).

**Onboarding / Empty state**
- ❌ טקסט מסך-ריק ("#TodoistZero" מוזכר שיווקית בלבד: https://www.todoist.com/features) — הניסוח המדויק unverified. מספר צעדי-setup לפני שימוש — unverified (אין setup חובה מתועד ב-help).

**מה מוסתר בכוונה (Foundations 2019)**
- Quick Add הוצג מחדש כך ש-"date and project more prominent than before, while still offering access to other options like flags, comments, and labels"; sections ניתנות-לקיפול; מטרה מוצהרת: "each view simpler to use". ⚠️ MacStories (לעיל) · ❌ מסמך-עקרונות רשמי של Doist לא נמצא (מאמר Adobe מחזיר 404).

### 2. Notion — "נקי: לבן, הרבה whitespace"

**המסך הראשי (עמוד)**
- עמוד חדש: כותרת + "select any of the options at the bottom of the page to get started" (ייבוא/תבנית/טבלה). ✅ https://www.notion.com/help/create-your-first-page
- Placeholder שורה-ריקה: "Press 'space' for AI, '/' for commands…" ⚠️ https://userstyles.world/style/9202/notion-hide-placeholder-text (ניסוח מדויק — unverified מול Notion רשמי).
- תפריט `•••` לעמוד: **Default / Serif / Mono**, מתג **Small text**, מתג **Full width** ("shrink the margins… widen your content area"). ✅ https://www.notion.com/help/customize-and-style-your-content
- Slash: "hit the slash key, and select or type the content type (e.g., /image)". ✅ https://www.notion.com/help/guides/using-slash-commands
- Markdown-in-place: `#`/`##`/`###`+space = H1/H2/H3; `[]`+space = checkbox; `-`/`*`/`+`+space = bullet; `/` = תפריט בלוקים; `Cmd/Ctrl+P` או `+K` = חיפוש/קפיצה; `Cmd/Ctrl+N` עמוד חדש; `Cmd/Ctrl+\` קיפול sidebar. ✅ https://www.notion.com/help/keyboard-shortcuts

**טיפוגרפיה/צבע — מספרים**
- ⚠️ replica-CSS (react-notion-x, משחזר את ה-DOM של notion.so — לא קובץ רשמי): `.notion { font-size:16px; line-height:1.5 }`; טקסט ראשי `rgb(55,53,47)`; משני `rgba(55,53,47,0.6)` (`--fg-color-3`) ו-`0.4` (`--fg-color-2`); רקע `#fff`; רקע-משני `rgb(247,246,243)`; `--notion-max-width: 720px`; H1 1.875em · H2 1.5em · H3 1.25em · title 2.5em; `.notion-text { padding:3px 2px; margin:1px 0 }`. https://github.com/NotionX/react-notion-x/blob/master/packages/react-notion-x/src/styles.css
- ❌ רוחב-ברירת-מחדל האמיתי של notion.so (קהילת notion-enhancer מזכירה `--theme--page-width: 900px`) — unverified. https://github.com/notion-enhancer/notion-enhancer/issues/906
- ⚠️ אתר-השיווק (לא האפליקציה): פונט "NotionInter"/Inter, משקלים 400/500/600/700, גדלים 12–96px, base spacing 4px, gap בין-סקשנים 80px, card padding 24px, radius 12px(card)/8px(button), borders `1px solid rgba(0,0,0,0.08)`. https://designmd.cc/benchmarks/notion

**ניווט**
- Sidebar: לשוניות Home · Chats with Notion AI · Meetings · Inbox · Search; סקשנים Teamspaces / Shared / Private / Favorites; תחתית Settings · Templates · Trash; `>>`/`<<` או `Cmd/Ctrl+\`; גרירת-קצה לשינוי-רוחב; `+` על hover ליד כל עמוד. ✅ https://www.notion.com/help/navigate-with-the-sidebar
- Density: מסמך-זרימה (בלוקים), לא כרטיסים; ❌ גובה-שורה/פריטים-למסך unverified.

**מוסתר בכוונה**: אין סרגל-עיצוב קבוע — עיצוב מגיע רק מ-`/` וממתג-hover; אפשרויות-עמוד (פונט/רוחב/גודל) מאחורי `•••`. ✅ (customize-and-style)

### 3. Akiflow — "מהיר: מקלדת, בלי עכבר"

**המסך הראשי**
- Today page — סדר: **Overdue ראשון** ("Overdue tasks are the first visible on the Today page") → Today → **Scheduled on Calendar** (משימה שנגררה ללוח נשארת ברשימה) → כפתור **Week** בתחתית. תפריט למעלה-מימין: Compact view · Show Done · Live activity · Sort By · Filter By · Copy and Share. `T` חוזר ל-"current day and time". ✅ https://product.akiflow.com/en/help/articles/0741055-today-page
- Inbox נפרד מ-Today: "separated from your schedule (Today page), so they won't impact what you already have planned"; Compact view מסתיר תיאורים (אייקון-פסקה מסמן שיש). ✅ https://product.akiflow.com/articles/5284502-your-inbox
- ⚠️ שלושה פאנלים (תפריט משמאל · רשימה · לוח) — סקירה, לא מסמך רשמי: https://thebusinessdive.com/akiflow-review
- Time Slot = "containers within your calendar"; מספר המשימות בתוכו מוצג ויורד עם ההשלמה + progress bar בתחתית. ✅ https://product.akiflow.com/help/articles/3089241-time-slots
- Rituals נגישים מפינה שמאל-תחתית. ✅ https://product.akiflow.com/help/articles/0805246-rituals

**האינטראקציה הראשית — Command Bar**
- `Cmd/Ctrl+E` גלובלי (desktop) · `Cmd/Ctrl+K` בתוך האפליקציה · `Esc` יציאה. תחביר: `>` time slot · `#` project · `*` tag · `!` priority · `<` deadline · `=` duration · `|` calendar · `@` guests · `//` description; תאריכים: "6/6", "Monday", "Tomorrow", "Every Week". Capture: העתק טקסט → פתח bar → `Enter` = ל-Inbox; `O` חזרה למקור. ✅ https://product.akiflow.com/en/help/articles/6483573-command-bar
- מקשים: `C` צור · `P` plan · `E` done · `Cmd+S` Someday · `J/K` ניווט · `F` focus · `I/T/U` Inbox/Today/Upcoming · `1–7` תצוגות-לוח · `0` הסתר לוח/רשימה · `#`/`*`/`!`/`<`/`Cmd+=` עריכת שדות בשורה · `?` עזרה. ✅ https://product.akiflow.com/help/articles/7262522-keyboard-shortcuts
- **מדד keystrokes:** יצירה מכל-מקום `Cmd+E` + טקסט + `Enter`; תכנון משימה `P` + טקסט; השלמה `E`.

**Onboarding**: ⚠️ נחיתה ב-"Integration dashboard" → Add Integration → חיבור לוח (Settings → Calendars). https://aiindigo.com/tutorials/getting-started-with-akiflow-mastering-unified-task-calendar-management · ❌ מספר-צעדים רשמי unverified.

**מתודולוגיה (מה מוסתר/מופרד)**: Capture→Process→Execute; "less than 2 minutes → Do it"; "Inbox Zero a couple times daily"; הפרדת Inbox מ-Today = "Motion" vs "Action"; "Learn 2 keyboard shortcuts a day". ✅ https://product.akiflow.com/help/articles/3602719-the-methodology
- Rituals: Daily Planning = Yesterday's Recap → check Inbox/Week/Month → decide today, defer → plan Shutdown; Daily Shutdown = completed+time → Rate your Day → Plan Tomorrow (אופציונלי). ✅ (rituals article)
- ❌ ביקורת-שוק: ב-iOS צריך ללחוץ "Create" למעלה-מימין במקום Enter — נקודת-חיכוך. ⚠️ https://thenewsprint.co/2026/01/25/three-weeks-with-akiflow/

### 4. Sunsama — "רגוע: לא מציף, לא מפחיד"

**המסך הראשי**
- 3 פאנלים: **שמאל** = ניווט (Home `H`, Focus `F`, Today `T`, Rituals; מוסתר עם `<`), **מרכז** = Board (קנבן, עמודה=יום) / Calendar view (`Tab`) / Focus / Today, **ימין** = לוח או רשימה זו-לצד-זו, Backlog, Archive, Weekly Objectives, Search, Integrations, Trash (מוסתר עם `>`). ✅ https://help.sunsama.com/docs/usage-guides/workspace-navigation/
- עמודת-יום: "a date header, a new task creation button, and then a list of tasks"; לחיצה על כותרת-יום ממקדת את לוח-היום-היחיד בפאנל הימני. ✅ https://help.sunsama.com/docs/getting-started/basics/kanban-task-view/
- **מונה-עומס** בראש העמודה: 3 מצבים (זמן-נותר / זמן-עבודה-נותר / actual-vs-planned); **צהוב** בהתקרבות לסף, **אדום** בחריגה. ✅ https://help.sunsama.com/docs/usage-guides/tasks/planned-and-actual-times
- ❌ מספר-עמודות-ימים-ברירת-מחדל, גובה-כרטיס, תוכן-כרטיס מדויק — unverified. ✅ אינדיקטור "numbered circle" לימי-גלגול-רצופים של משימה שלא הושלמה. https://help.sunsama.com/docs/getting-started/basics/task-basics/

**הטקס היומי (Daily Planning) — צעדים**
1. "What do you want to get done today?" (ייבוא פגישות/משימות/backlog) → 2. "What can wait?" (timeline-עומס-חזוי; גרירה לימים אחרים) → 3. "Finalize your plan" (timebox/סדר + קביעת שעת-shutdown) → 4. "Daily plan" (רפלקציה, מכשולים, שיתוף). ✅ https://help.sunsama.com/docs/getting-started/basics/daily-planning-the-basics/
- `P` פותח planning; `D` דחה יום · `Z` backlog · `Shift F` פילטר-ערוץ; אחרי 15:00 → "evening mode and plans **tomorrow's** tasks". המלצה: ~5.5 שעות מתוך יום 9–17. ✅ https://help.sunsama.com/docs/usage-guides/daily-planning/ · "commit to only five or six hours… in your first few days" ✅ https://www.sunsama.com/blog/the-official-daily-planning-guide
- כל צעד ניתן-להסרה: "Skip this step in the future". ✅ https://help.sunsama.com/docs/getting-started/setting-up-your-account/

**Daily Shutdown**: משימות-היום + פירוק-זמן → "Next" → Daily Highlights (אלגוריתם-דירוג + "Other activities") → רפלקציה (מה הלך טוב / דאגות) → "Publish" (אופציונלי Slack). "Your highlights should remain focused, not exhaustive". ✅ https://help.sunsama.com/docs/usage-guides/daily-highlights/ · טריגר: התראה בשעה שנבחרה. ✅ https://roadmap.sunsama.com/changelog/daily-shutdown

**מקשים**: `A` הוסף (`~`=זמן-מתוכנן, `#` ערוץ, `!` עדיפות, `>` תת-משימה) · `Space` טיימר · `C` השלם · `X` auto-schedule · `D` snooze · `Z` backlog · `W`/`E` planned/actual · `Cmd/Ctrl+K` command palette · `?` רשימה · `Cmd/Ctrl+Shift+A` יצירה גלובלית. ✅ https://help.sunsama.com/docs/usage-guides/keyboard-driven-actions/keyboard-shortcuts/ · https://help.sunsama.com/docs/usage-guides/keyboard-driven-actions/command-palette/

**Onboarding**: 3 צעדים (כלי-משימות → לוחות-שנה → "When do you plan your day?") ואז planning מודרך ראשון; "necessary to complete all of these steps to gain access to your Sunsama workspace". ✅ https://help.sunsama.com/docs/getting-started/setting-up-your-account/ · ❌ ברירות-מחדל לסף-עומס/שעות — לא מתועדות. ✅ https://help.sunsama.com/docs/settings/user-settings/

**מוסתר בכוונה**: Focus Mode = "just the task you're working on right now"; מסתיר את כל ניווט-ה-workspace; לוח נחשף רק ב-hover על צד ימין; חצים ↑↓ למשימה הבאה, `A` להוסיף בלי לצאת, `Esc` יציאה. ✅ https://help.sunsama.com/docs/usage-guides/focus-mode/ · שיתוף: "discrepancy between the level of detail in which you've planned your day and what your colleagues care about" → מסננים לפני-שיתוף. ✅ (official guide)

### 5. Motion — "חכם: ה-AI עושה את העבודה"

**המסך הראשי**
- Sidebar (15 פריטים מתועדים): AI Chat · Search · Inbox (התראות) · **AI Agenda** · Resolve past due · Calendar · Projects & Tasks · Team schedule · AI Meeting notes · Favorites · Workspaces · Docs · Shared · Invite · Tutorials. ✅ https://www.usemotion.com/help/getting-started/navigation-basics/sidebar-navigation-guide.md
- AI Agenda: Today's Tasks · Tomorrow's Tasks · rest of week · past deadline. ⚠️ https://www.usemotion.com/help/time-management/ai-agenda (מבנה-מסך מדויק לא מתועד ב-how-to). Past due: אייקון `!!` צהוב ליד Agenda → פעולות: Do ASAP / Extend deadline / Ignore warning / ✓ / 🗑. ⚠️ (חיפוש; אותו help)
- v3: ניווט עבר מלמעלה ל-sidebar שמאלי; "Meetings, events, and tasks each have distinct icons and colors"; Agenda ניתן-לקיפול בלוח; `⌘K` חיפוש. ✅ https://www.usemotion.com/blog/motion-v3 · 2025: "My Tasks"+"All Projects" אוחדו ל-"Projects & Tasks" — "reduces clutter". ✅ https://www.usemotion.com/blog/projects-and-tasks-tab
- מובייל: לשוניות Projects · Calendars · Booking · Settings (+חיפוש); כפתור `+` בווידג'ט; ווידג'ט מציג "today's tasks and events by default"; אין Gantt/bulk-edit/workflow-templates. ✅ https://www.usemotion.com/help/getting-started/mobile-app/reference-mobile-app.md

**האינטראקציה הראשית — יצירת משימה ו-AI מסדר**
- "+ New" → New Task; שדות: Priority (ASAP/High/Medium/Low), Duration, Deadline, Schedule (dropdown של שעות-עבודה שמורות), Recurring; **מתג auto-schedule סגול בראש הסרגל הימני**; כיבוי ⇒ "it won't get scheduled nor appear on your calendar". ✅ https://www.usemotion.com/help/time-management/auto-scheduling/auto-scheduling-how-to-guide
- ASAP ⇒ "the deadline field greys out". קונפליקט ⇒ "automatically moves the task to the next best slot before the deadline". ✅ https://www.usemotion.com/help/time-management/auto-scheduling
- Task Defaults (הגדרות): workspace/project, assignee, status, priority, labels, auto-schedule, duration, schedule, start/deadline יחסיים — **ערכי-ברירת-מחדל של המפעל לא מתועדים** ❌. ✅ https://www.usemotion.com/blog/task-defaults
- מקשים: `Cmd/Ctrl+K` חיפוש · `Option+Space` צור משימה · `Option+C` לוח · `Cmd+/` AI chat. ✅ https://www.usemotion.com/help/getting-started/navigation-basics/sidebar-navigation-guide/keyboard-and-accessibility.md
- Quickstart מתועד = 4 פעולות (AI Chat, task, event, project) — לא רצף-setup. ✅ https://www.usemotion.com/help/getting-started/quickstart.md · ⚠️ onboarding: חשבון Google/Microsoft + ייבוא לוח + סרטון 3 דק׳ + tooltips. https://thedigitalprojectmanager.com/tools/motion-app-review/

**מוסתר בכוונה**: "No more dragging tasks around your calendar", "No manual dragging or reshuffling" — מכניקת-השיבוץ (סריקת-חורים, איזון) אינה מוצגת; המשתמש רואה רק בלוקים על הלוח. ✅ https://www.usemotion.com/help/time-management/auto-scheduling/concept-auto-scheduling/purpose-of-auto-scheduling · ❌ גובה-שורה/צפיפות unverified.

---

## §B · נספח · דוח-החוקר: רמת-הפרואקטיביות (Motion · Reclaim · Lindy · Saner · Google Calendar · Todoist)

Method: official help centers / docs / feature pages fetched directly; third-party reviews used only where noted. "Unverified" = could not confirm in a fetched primary source. Research date: 2026‑09‑07.

### 1. Motion (usemotion.com)

**Triggers (what makes it act on its own)**
- Re-plans when a new meeting/conflict appears, when a higher-priority task appears, or when a deadline is at risk: "Tasks reschedule automatically if new meetings or conflicts arise", "If a deadline is at risk, Motion pushes the task earlier or flags it with an alert", "Events from connected calendars always override task blocks." — https://www.usemotion.com/help/time-management/auto-scheduling/reference-auto-scheduling/how-auto-scheduling-works-behind-the-scenes
- Marketing claims it "re-optimizes it hundreds of times a day" (frequency mechanism not documented). — https://www.usemotion.com/features/ai-task-manager
- Locked (fixed-time) tasks are only rescheduled "if incomplete within 60 minutes post-scheduled slot." — https://www.usemotion.com/help/project-management/task/reference-tasks/task-states-and-task-types
- Future start dates gate scheduling: "Motion will not schedule them until the start date arrives." — how-auto-scheduling-works (URL above)

**Decisions (auto vs. confirm)**
- Auto: placement of every task by priority (ASAP / High / Medium / Low), earlier deadline first, cross-project precedence to "higher-priority or sooner-deadline tasks"; chunking of long tasks respecting "a minimum block size"; a task with no duration is never scheduled. — how-auto-scheduling-works; https://www.usemotion.com/help/time-management/auto-scheduling/auto-scheduling-how-to-guide
- Hard deadline = permission to break working hours: "Motion prioritizes completing the task on time, even if it means scheduling it outside your normal working hours." — https://www.usemotion.com/help/project-management/task/task-scheduling-faq
- Conflict rule: only "busy" events on calendars added to "My Calendars" are avoided; "free" events are scheduled over. — task-scheduling-faq
- Missed recurring instance is NOT re-slotted in the same period; it becomes overdue and the next recurrence keeps its schedule. — task-scheduling-faq
- Unresolvable ⇒ state "Can't Fit": "could not find a feasible time slot ... for the next 31 days (or 92 days for Motion teams)", pinned at top with a red mark. — task-states-and-task-types
- User overrides: manual drag = lock; auto-scheduling can be toggled off per task/globally. — how-auto-scheduling-works

**Timing of notifications / flood control**
- "Past Due" state ("scheduled ... beyond their original deadline" or deadline passed) ⇒ "Motion notifies users and displays a red exclamation mark." — task-states-and-task-types
- Marketing: "When Motion thinks a task is at-risk ... it proactively warns you days, weeks, or months in advance." Exact lead-time formula: **unverified** (the ETA is the mechanism — "ETAs act as 'beacons'"). — ai-task-manager; how-auto-scheduling-works
- Mobile push exists only for "Task assignments", "Status changes", "Mentions in comments", "Auto-archived tasks"; "automatic task reminders are not currently available in the mobile app." — https://www.usemotion.com/help/settings/managing-notifications/notifications-faq
- Meeting reminders are delegated to the external calendar ("external calendar settings drive most attendee reminders"). — https://www.usemotion.com/help/project-management/meeting-events/reference-meeting-events/notifications-and-reminders
- All alerts collect in an in-app Inbox ("alerts, notifications and updates outputs in one place"; search / Unread filter / chronological). — https://www.usemotion.com/help/time-management/inbox/inbox-how-to-guide

**Inputs / integrations**
- Google & Outlook calendars: read ("to display existing events") + write ("create and update events"). Events sync both ways; tasks are written to the external calendar one-way ("changes made externally do not affect the task in Motion"); Free/Busy flag decides whether a task block blocks time externally. Specific OAuth scope URIs: **unverified**. — https://www.usemotion.com/help/time-management/all-things-calendars/reference-all-things-calendars/integration-and-permissions ; https://www.usemotion.com/help/time-management/all-things-calendars/reference-all-things-calendars/all-things-google

**Output form**: calendar blocks with an ETA label; "No ETA" label = not being scheduled; state icons (red "!", lock, recurring wheel). — auto-scheduling-how-to-guide; task-states-and-task-types

**Memory/context**: explicit "schedules" (working-hour templates), priorities, durations, dependencies ("blockers"), start dates, ideal start time for recurring tasks. No learned/implicit memory documented. — auto-scheduling-how-to-guide; task-scheduling-faq

### 2. Reclaim.ai

**Triggers**
- Re-plans "in about 15 seconds or less" when: a higher-priority meeting is booked over an item; you RSVP Yes/Maybe to a conflicting invite; you change rules of a Habit/Task/Smart Meeting. — https://help.reclaim.ai/en/articles/6207587-how-reclaim-manages-your-schedule-automatically
- Todoist/Google Tasks items sync in automatically when they match a rule (project/label) and carry a due date (optional per rule). — https://help.reclaim.ai/en/articles/5961653-todoist-integration-overview ; https://updates.reclaim.ai/announcements/tasks-from-integrations-can-now-be-synced-without-due-dates

**Decisions (auto vs. confirm)**
- Habits are windows, not times: days + window (e.g. 11:30–14:00) + min/max duration + ideal time; "Reclaim will try to schedule the Habit as close to this time as possible, and pick the next closest time if not." — https://help.reclaim.ai/en/articles/4129152-habits-overview-auto-schedule-flexible-time-for-your-routines
- Time Defense (the "flexible vs fixed" dial): placed as **Free** first, then "flip it to busy as your schedule fills up, or as time draws nearer." Two variables: "amount of time left for the Habit in the Habit's time window" and "amount of time left before the Habit is scheduled to begin." Settings: *Most flexible* = "Always free and prefer ideal time over max duration"; *Let Reclaim decide* (default); *Most defensive* = "Always busy and prefer the max duration over the ideal time." Least-defensive flips to Busy "30 minutes before it is scheduled to begin, or if there's less than one free time slot left." — https://help.reclaim.ai/en/articles/4129290-time-defense-settings-for-habits ; https://updates.reclaim.ai/announcements/always-busy-always-free-time-defense-for-habits
- Priority P1–P4 for Habits and Tasks. Critical "can overbook lower-priority Habits, Tasks, and Smart Meetings"; ties broken "Smart Meetings first, Habits second, and Tasks third"; within a priority, "soonest due date" first; never overbooks non-Reclaim events or Scheduling-Link meetings. New tasks default to P2 (High). — https://help.reclaim.ai/en/articles/4129286-prioritizing-your-habits ; https://help.reclaim.ai/en/articles/4292868-how-reclaim-schedules-your-tasks
- "Up Next" = user override that beats all priorities but not locked items. — how-reclaim-schedules-your-tasks
- Conflicted habit: user chooses "Leave it on the calendar" (marked with a warning) or "Remove from the calendar automatically." — habits-overview
- Manual drag ⇒ locked; **Snooze** moves the whole task forward without locking; **Log work** decrements remaining duration. — https://help.reclaim.ai/en/articles/4453312-managing-tasks-and-task-events-on-your-calendar
- Defaults: due date "3 days from now" (rolling offset); one-off task from Slack/Gmail = 30 min; split-task cooldown 30m/1h/2–4h/daily. — https://help.reclaim.ai/en/articles/5153635-changing-your-default-settings-for-reclaim-tasks ; https://help.reclaim.ai/en/articles/5108936-tasks-overview
- Todoist mapping: P1→Critical … P4→Low; two-way; completing in Reclaim completes Todoist; rescheduling un-completes; recurring Todoist tasks don't sync. — todoist-integration-overview

**Timing / flood control**
- Slack **Daily Digest** "summarizes your agenda for the day, highlights any overlapping events, and lists meetings waiting for your RSVP"; **Weekly Digest** "at the end of your workweek (based on your set working hours)"; event alerts on invite / update / cancel / "about to begin"; conflict alerts across connected calendars. Exact digest send hour: **unverified**. — https://help.reclaim.ai/en/articles/3643248-slack-integration-overview
- Per-event-type notification defaults in Google Calendar: Habits/Smart Meetings/Tasks ON; Decompression Time and breaks OFF; Calendar-Sync copies OFF (avoids duplicates). — https://help.reclaim.ai/en/articles/6179615-manage-notifications-for-reclaim-events
- Conflicts are not reported for items Reclaim would auto-reschedule anyway (search snippet from help center; page fetch didn't show the line — **partially verified**). — https://help.reclaim.ai/en/articles/6179615-manage-notifications-for-reclaim-events

**Inputs**: Google/Outlook calendars (write — creates events), Slack (status sync: "in meetings, focusing, or away"), Todoist, Google Tasks, and others. Scope URIs: **unverified**. — slack-integration-overview; todoist-integration-overview

**Output form**: calendar events (Free/Busy, lock icon), Slack DM digests, Planner list with Snooze/Reschedule/Log-work actions. — managing-tasks-and-task-events

**Memory/context**: explicit only — working vs personal hours, per-habit window/ideal/min/max/priority/defense, default task settings. No learned memory documented.

### 3. Lindy (lindy.ai)

**Triggers**
- Routines = "trigger + prompt + destination"; trigger types: schedule (daily/weekly/monthly; default "daily at 9:00 AM") or events: "Incoming or sent emails", "Slack messages", "Calendar events about to start", "Meeting endings." — https://docs.lindy.ai/teammate/routines.md
- Email labeling "runs automatically on incoming email." — https://docs.lindy.ai/features/inbox-management/email-triage.md
- Follow-up bump trigger: "a sent email gets no reply" after Never/1/2/3/5/7 days. — https://docs.lindy.ai/features/inbox-management/follow-up-bumps.md
- Meeting prep: "a set number of minutes before the meeting starts (e.g., 15 minutes before)." — https://docs.lindy.ai/features/meeting-assistant/meeting-prep.md
- Daily brief: "at your preferred time each morning" (users typically "30–60 minutes after they wake up"). — https://docs.lindy.ai/features/meeting-assistant/daily-brief.md
- Legacy builder trigger names ("New Email Matching Search", "New Labeled Email", "New Attachment Received") appear in search snippets only — **unverified** on fetched pages.

**Decisions (auto vs. approval)**
- Hard rule: "Reads are never guarded. Checking your calendar or searching your email always just work." Writes set to "Require approval" ⇒ Lindy "Asks in Slack before writing." Guardrails apply "in shared Slack threads only" — web chat, DMs, iMessage/SMS bypass them. — https://docs.lindy.ai/integrations/overview.md
- Approval UI: "Lindy posts Approve and Deny buttons in the thread"; "Nothing with outside impact waits for approval, such as sending an email, updating a ticket, posting to another channel"; approving "allows that one action and changes nothing else"; "Always allow changes the rule going forward"; requester or any workspace owner/admin can approve. — https://docs.lindy.ai/llms-full.txt
- Drafting features are draft-only by design: follow-up bumps — "you keep the final say before anything sends"; email drafting — "Nothing is ever sent without your approval." — follow-up-bumps.md; llms-full.txt
- Labeling is autonomous: default labels "To Respond, FYI, Newsletters, Comments, Notifications, Invoices"; two buckets "Move these out of my inbox" (label + archive) vs "Keep these in my inbox". — email-triage.md
- Older builder: "Ask for Confirmation" toggle appears only on actions with "side effects"; when ON, "Lindy will not take action ... until you approve the action in the Lindy task view" (also via email). — https://www.lindy.ai/blog/human-in-the-loop-automation (marketing) ; search snippet of docs.lindy.ai/testing/human-in-the-loop (page now redirects — **unverified**)

**Timing / flood control**
- Email alerting is rule-driven: "Alert instructions — describe what counts as urgent. This drives what gets through" (example "Only alert me about meetings within 30 minutes, or emails that seem extremely urgent"). No quiet hours / frequency cap documented. — https://docs.lindy.ai/features/inbox-management/email-alerting.md
- Daily brief = one message at a fixed morning time; Slack channel summary = "one short rundown" per day. — daily-brief.md ; https://www.lindy.ai/templates/gmail-alert-for-new-calendar-event

**Inputs**: Gmail (actions include Send Email, Create Draft, Add Label, Archive, Triage email…), Google Calendar (Create/Update/Delete Event, Find Available Times, Check Availability…), Slack, LinkedIn data for attendee context; OAuth or API key; personal vs team connections. Scope URIs: **unverified** (security page lists SOC2/GDPR/HIPAA only). — https://www.lindy.ai/integrations/gmail ; https://www.lindy.ai/integrations/google-calendar ; integrations/overview.md ; https://www.lindy.ai/security

**Output form**
- Daily brief: sections you prompt ("your schedule", "meeting context", "priorities", "weather"), delivered "Slack DM, a text to your phone (SMS / iMessage), or Lindy chat." — daily-brief.md
- Meeting prep card: Time, Meeting name, Attendees, Attendee context (title/company/LinkedIn), Past meetings. — meeting-prep.md
- Approval = Slack message with Approve / Deny (+ "Always allow"). — llms-full.txt
- Text replies act as feedback: "That draft was too formal" / "Always CC Becky on those." — https://docs.lindy.ai/features/imessage-sms.md

**Memory/context**: "Memories ... persist across all task runs", editable text "inserted into the Lindy's context on each execution", written via Memory actions (example: never schedule before 11am). Also "Lindy learns from how you re-label emails." — https://docs.lindy.ai/fundamentals/lindy-101/memory (search snippet; direct fetch redirected — **partially verified**) ; llms-full.txt

### 4. Saner.AI

**Triggers**
- Gmail sync of *labeled* emails: "Just tag the emails you want processed. Saner.ai will focus specifically on these" / "It instantly syncs the labeled emails." — https://www.saner.ai/blogs/ai-for-emails-feature
- Morning plan: "Every day when you go to the app, Skai automatically gives you an optimal day plan based on your emails, notes, and to-dos"; "automatically crawls your integrated tools to map out a clear day plan." — https://blog.saner.ai/best-adhd-reminder-apps/ ; https://blog.saner.ai/plan-your-day-with-adhd/ (Saner's own blog)

**Decisions**
- Extraction is suggest-then-accept: "Saner.ai reads your emails and clearly suggests tasks ... 'Can we meet next Thursday?' Saner.ai suggests a reminder"; "You quickly review, adjust, and hit 'accept'." Tasks carry email context ("Context-Rich Tasks"). — ai-for-emails-feature
- Read-only on mail: no send action documented. — ai-for-emails-feature
- Tag suggestion on notes ("AI suggests tags based on a note's content"); prioritization of follow-ups. — https://www.saner.ai/

**Timing / flood control**
- Claim: "Saner.ai sends reminders exactly when action is required" and "intelligently schedules reminders to help, not overwhelm you"; "context-aware, non-repetitive task reminders" with "varied reminder messages" to avoid alarm blindness. Exact algorithm/lead times: **unverified**. — ai-for-emails-feature ; best-adhd-reminder-apps
- Third-party: morning view "emails that need responses, tasks pulled from yesterday's notes, calendar conflicts." — https://tooliverse.ai/tools/saner-ai (review, unverified)

**Inputs**: Gmail, Outlook, Google Calendar, Slack (grouped "by day or channel"), Google Drive; Chrome extension for capture. Scopes: **unverified**. — https://www.saner.ai/ ; ai-for-emails-feature

**Output form**: suggested-task cards with accept/adjust; daily plan list; chat with Skai. — ai-for-emails-feature

**Memory/context**: notes + emails + calendar as retrieval context; "Requesting AI to save new information discovered during conversations" (user-initiated). — https://www.saner.ai/

### 5. Google Calendar two-way sync (developer facts)

- Push = watch channel per resource; notification is a header-only ping: "don't include a message body ... you must make another API call to see full change details." Headers: X-Goog-Resource-State = sync | exists | not_exists; X-Goog-Channel-ID; X-Goog-Message-Number; X-Goog-Resource-ID. Requires HTTPS endpoint; "no automatic way to renew" — call watch again with a new ID before expiry. — https://developers.google.com/workspace/calendar/api/guides/push
- Channel TTL: third-party says "up to approximately 30 days", renew at 20–50% of remaining life. Official max: **unverified**. — https://www.codewords.ai/blog/google-calendar-webhooks
- Incremental sync: full sync ⇒ store nextSyncToken ⇒ events.list with syncToken returns only changes and "always contains deleted entries"; on HTTP 410 GONE "clear the client storage and perform a new full sync"; keep identical query params; updatedMin is legacy/not recommended. — https://developers.google.com/workspace/calendar/api/guides/sync
- Scopes (least-privilege options): calendar.events.owned ("See, create, change, and delete events on Google calendars you own", sensitive); calendar.events (sensitive); calendar.events.readonly (restricted); calendar.readonly (restricted); calendar.freebusy / calendar.events.freebusy (non-sensitive); calendar.app.created (own secondary calendar only, sensitive). — https://developers.google.com/workspace/calendar/api/auth
- Loop prevention for two-way: tag every copy you create and skip your own writes when they echo back (third-party; Motion solves the same thing by making task-blocks one-way). — https://syncdate.app/blog/how-calendar-sync-works ; Motion integration-and-permissions (above)

### 6. Todoist reminders

- Automatic reminder: "When you set a due date and time for a task, Todoist will automatically send you a reminder 30 minutes before the task is due (you can change the default reminder time in Settings > Reminders)." — https://www.todoist.com/inspiration/how-to-use-todoist-effectively ; https://www.todoist.com/help/todoist/features/introduction-to-reminders-9PezfU
- Types: automatic (Beginner/Pro/Business), custom absolute or "Before task" relative (Pro/Business; relative offsets only on web/desktop), recurring ("ev Tuesday 7:00", not on Android), location (arrive/leave, mobile push only, radius adjustable on iOS, needs Precise Location + Time-Sensitive notifications). — introduction-to-reminders ; https://www.todoist.com/help/articles/use-location-reminders-in-todoist-uGcwH2AJ6
- Channels: desktop push, mobile push, email — chosen per reminder type in Settings > Reminders. — introduction-to-reminders
- Fixed-hour digests: **Morning overview** ("once daily ... how many tasks you have yet to complete that day. Use the scheduler to choose the hour"), **Evening review** ("prompts you to review what's left ... choose the hour"), **Daily digest email** ("tasks for today. Sent every morning", hour not configurable), goal celebrations. No quiet hours documented. — https://www.todoist.com/help/articles/manage-your-notifications-in-todoist-QxQGXkMu

---

## §C · נספח · דוח-החוקר: הבסיס המינימלי (Todoist · Google Calendar · Notion · Motion · Reclaim · Lindy · Saner · Akiflow/ClickUp)

Scope: for each capability, the smallest thing users depend on, as a data model + 3–5 operations, with citations. "unverified" marks anything not confirmed from an official page. Help-center pages for Akiflow/ClickUp partially blocked (403/404); where search snippets of official pages were used, it is said so.

### 1. Tasks — Todoist

**Minimal model (from the Todoist API v1 Task object + help center)**

```
Task
  id
  content            (title)
  description
  project_id, section_id, parent_id   (subtasks via parent_id)
  order              (manual position)
  labels[]           (names)
  priority           API: 1..4 where 4 = highest; UI shows p1 (highest, red) … p4 (default, none)
  due { date | datetime, timezone?, string (the NL text as typed), is_recurring }
  deadline_date      (separate from due; UI syntax {march 30})
  duration + duration_unit
  checked/completed
Project { id, name }   Label { id, name }   Section { id, name, project_id }
```
- API fields and a "Quick Add" endpoint: https://developer.todoist.com/api/v1/ (Tasks section).
- API priority: "priority 4 represents the highest urgency level and 1 is lowest" — the UI inverts labels (P1 = red, "most important"; P4 = white default): https://www.todoist.com/help/articles/set-a-priority-in-todoist-Wy82Jp
- Key design point: `due.string` keeps the human recurrence text ("every monday 9am") — the recurrence rule *is* the NL string; the app re-parses it on completion. (Inferred from `due.string` + `is_recurring`; the exact internal RRULE is not exposed — unverified.)

**Core operations**
1. **Quick Add with NL parsing** — shortcut `Q`; syntax: `#Project`, `/Section`, `%label` (also `@`, being retired), `p1..p3`, `+assignee`, `!reminder` (`!14:00`, `!30 min before`), `{deadline}`, date/time in plain text. https://www.todoist.com/help/articles/use-task-quick-add-in-todoist-va4Lhpzz
2. **Complete** — recurring task "automatically shifts to the next date"; "Complete forever" ends the series. https://www.todoist.com/help/articles/complete-a-task-with-a-recurring-date-dmI6SVqdP
3. **Reschedule** — drag to bottom of Today = postpone to tomorrow; "Reschedule" button on overdue block; drag across days in Upcoming. https://www.todoist.com/help/articles/plan-your-day-with-the-today-view-UVUXaiSs · https://www.todoist.com/help/articles/plan-your-week-with-the-upcoming-view-OKOg1mR8
4. **Today view** — "every task scheduled for today across all your projects"; Overdue section; P1 at top; only dated tasks appear; list or calendar layout; drag to an hour = time-block; dragging an all-day task onto a time slot adds date+time+30-min default duration. Same Today URL + https://www.todoist.com/help/todoist/get-started/time-blocking-in-todoist-d6Pf1uTpc
5. **Upcoming view** — up to two years ahead, week picker, drag task to a new date.

**Natural-language date parsing coverage (verbatim from docs)**
- One-time: `today`, `tomorrow`, `next week`, `next month`, `next weekday`, `jan 27`, `01/27/2023`, `27th`, `mid January`, `end of month`, `today at 10`, `tomorrow at 16:00`, `Fri 7pm`, `6pm`, `in 5 days`, `in 3 weeks`, `in 2 hours`, `in the morning/afternoon/evening`, `someday`, `later this week`, `next Friday`, `this weekend`, `tom morning`, `tom night`, `50 days before new year's eve`. Military time without colon (`1300`) is NOT recognized in the time field. https://www.todoist.com/help/articles/introduction-to-dates-and-time-q7VobO
- Recurring: `every day`/`daily`, `every weekday`/`every workday`, `every week`, `every month`, `every year`, `every quarter`, `every 3 workday`, `every other day/week/month/year`, `every other fri`, `every monday, friday`, `every 2, 15, 27` (days of month), `every mon, fri at 20:00`, `every last workday at 3pm`, `every 3 days starting next Monday`, `every 3rd Tuesday starting Aug 29 ending in 6 months`. `every` = anchored to original date; `every!` = anchored to completion date. Limitation: cannot combine different day/time pairs in one rule (`every mon at 8pm, tue at 9pm` fails), and no two `every` in one task. https://www.todoist.com/help/articles/introduction-to-recurring-dates-YUYVJJAV
- Parser language follows app language; falls back to English (search snippet of official help — https://www.todoist.com/help/articles/turn-smart-date-recognition-on-or-off-63WfIr, unverified detail).

**Generator implication:** a recurrence grammar with: interval (`every N unit`), weekday sets, month-day sets, ordinal weekday (`3rd tuesday`), `last`, `workday`, time-of-day, `starting`, `ending`/`for N`, and the `!` completion-anchored flag.

### 2. Calendar — Google Calendar

**Minimal model (Events resource)**
```
Calendar { id (email-like), summary, timeZone }
Event
  id, etag, updated, status (confirmed|tentative|cancelled)
  summary, description, location, colorId
  start { date | dateTime, timeZone }    end { same shape; both must be same kind }
  attendees[] { email, responseStatus, organizer? }
  recurrence[]  ("RRULE/EXRULE/RDATE/EXDATE lines", RFC 5545)
  recurringEventId  (instance → parent)
  reminders { useDefault | overrides[{method, minutes}] }
```
https://developers.google.com/workspace/calendar/api/v3/reference/events · concepts: https://developers.google.com/workspace/calendar/api/concepts/events-calendars

**Core operations:** `events.list` (with `timeMin/timeMax`), `insert`, `patch/update`, `delete`, `quickAdd` (text → event, e.g. "Appointment at Somewhere on June 3rd 10am-10:25am": https://developers.google.com/workspace/calendar/api/v3/reference/events/quickAdd), `watch`.

**Two-way sync — what is technically required**
- OAuth scopes: `https://www.googleapis.com/auth/calendar.events` (read/write events on all calendars) is the minimal write scope; `calendar.events.owned` restricts to owned calendars; `calendar.readonly` / `calendar.events.readonly` for read. Sensitive scopes require Google's app verification for public apps. https://developers.google.com/workspace/calendar/api/auth
- Incremental sync: first full `events.list` → store `nextSyncToken`; later calls pass `syncToken`; HTTP 410 ⇒ wipe local cache and full-sync again; page through all `pageToken`s before storing the token. https://developers.google.com/workspace/calendar/api/guides/sync
- Push (real-time): requires an HTTPS webhook with a valid CA-signed cert, `channels.watch`, and manual channel renewal before expiry — i.e. **a server**. Without a server, sync is poll-based (syncToken on app open / periodic). https://developers.google.com/workspace/calendar/api/guides/push
- Conflict model: `etag` + `updated` on each event (last-writer or etag-conditional PATCH).

**What a client-only app can do without a server**
- OAuth for installed apps (Android/iOS/desktop): PKCE, loopback/custom-scheme redirect, **no client secret, no backend required**, refresh tokens always returned. https://developers.google.com/identity/protocols/oauth2/native-app
- Flutter: `google_sign_in` (Android/iOS/macOS/web) → `authorizationClient.authorizeScopes([...])` yields a client-side access token; on **web** the token is not refreshed and expires after 3600 s (re-prompt). https://pub.dev/packages/google_sign_in
- Device calendar (no Google account needed): `device_calendar` 4.3.3 — Android/iOS only (no web); read/create/update/delete events, recurrence, attendees, reminders; needs READ/WRITE_CALENDAR and NSCalendars*UsageDescription. https://pub.dev/packages/device_calendar · one-shot "add to calendar" UI: `add_2_calendar` 3.1.1 (Android/iOS). https://pub.dev/packages/add_2_calendar
- ICS: export a `.ics` file (user imports via Settings → Import & Export; "guests and conference data … are not imported") or publish a feed and let the user add it "From URL" (public link only; Google's refresh interval is not documented on that page — unverified, commonly reported as many hours). https://support.google.com/calendar/answer/37118 · https://support.google.com/calendar/answer/37100. ICS is one-way out.
- Push notifications ⇒ server. Everything else (read, write, incremental poll) is doable client-only.

### 3. Life stack — Notion

**Minimal model (Notion API)**
```
Page  { id, parent {page_id | database_id(data_source) | workspace}, title (rich_text),
        icon, cover, properties{...}, in_trash, created_time, last_edited_time, url }
Block { id, parent, type, has_children, in_trash, created_time, last_edited_time,
        <type payload> — most carry rich_text[] {plain_text, annotations{bold,italic,color…}, href} }
  Types worth supporting minimally: paragraph, heading_1..3, bulleted_list_item,
  numbered_list_item, to_do (checked), toggle, quote, callout, code, divider,
  image/file, bookmark, child_page, child_database, table
Database → DataSource → Pages (rows)  (since Sept 2025 properties live on the data source)
  Property types: title, rich_text, number, select, multi_select, status, date, people,
  files, checkbox, url, email, phone_number, formula, relation, rollup,
  created_time, created_by, last_edited_time, last_edited_by, unique_id
```
https://developers.notion.com/reference/page · https://developers.notion.com/reference/block · https://developers.notion.com/reference/database · https://developers.notion.com/reference/property-object

**Core operations:** create page under a parent (tree of pages); append/edit/move blocks (block tree, `has_children`); create database with a property schema and add rows (pages) — this is how "projects", "home", "family" info become structured tables; search across titles; database views (table/board/list/calendar — UI, not in API; unverified via API).

**Generator implication:** two primitives cover Notion: a block tree with a `parent` pointer (page ⊂ page) and a typed-property table (`DataSource`). "Notes/documents" = Page+Blocks; "projects/home/family info" = DataSource with a handful of property types (title, text, select, date, checkbox, relation).

### 4. Auto-scheduling — Motion

**Minimal model (Motion API Task)**
```
Task
  id, name, description
  duration: minutes | "NONE" | "REMINDER"
  dueDate (ISO datetime; required for scheduled tasks)
  deadlineType: HARD | SOFT (default) | NONE
  priority: ASAP | HIGH | MEDIUM | LOW
  startOn (YYYY-MM-DD; earliest start)
  autoScheduled { startDate, deadlineType, schedule: "Work Hours" | custom } | null
  status, labels[], projectId, workspaceId, assigneeId
  -- outputs of the scheduler:
  scheduledStart, scheduledEnd, chunks[] {scheduledStart, scheduledEnd, completedTime},
  schedulingIssue (bool: could not fit), completed, completedTime
Schedule { name, working hours per weekday }   (referenced by autoScheduled.schedule)
```
https://docs.usemotion.com/api-reference/tasks/post/ · https://docs.usemotion.com/api-reference/tasks/get/ · UI field list: https://www.usemotion.com/help/project-management/task

**Scheduler rules (verbatim-ish from help):** priority first ("nothing outranks an ASAP task unless there is no available time"), then hard deadlines, then due dates (sooner first); respects breaks, working schedules and external events; "splits long tasks into chunks if needed" with a user-set minimum chunk; unfinished tasks are "rescheduled into the next available slot"; hard deadlines may be scheduled "outside your normal working hours"; if it cannot fit before the deadline it "flags the task with a warning" (`schedulingIssue`, "No ETA"). https://www.usemotion.com/help/time-management/auto-scheduling/reference-auto-scheduling/how-auto-scheduling-works-behind-the-scenes · https://www.usemotion.com/help/project-management/task/task-scheduling-faq · https://www.usemotion.com/help/time-management/auto-scheduling/auto-scheduling-how-to-guide

**Core operations:** create task with duration+due+priority → engine places it; toggle auto-schedule on/off; mark done (frees slot, re-plans the rest); reschedule pass when calendar changes; warn when unschedulable.

**Generator implication:** a pure function `plan(tasks, busyEvents, schedules, now) → {task.id: [chunks]}` — greedy by (priority, hardDeadline, dueDate), slotting into free windows of the working schedule; fully local (no server) if events are already known locally.

### 5. Time protection — Reclaim (Habits + Focus Time)

**Minimal model (from help center)**
```
Habit
  title
  durationMin, durationMax  ("no less than x and no more than y per day"; UI also has ideal)
  idealTime  (must lie inside the hours window; scheduler "as close to this time as possible")
  hours: Working | Meeting | Personal | custom one-off  (days + time window)
  frequency: Daily | Weekly | Monthly | Custom (e.g. "2nd Friday of each month")
  priority: Critical … Low
  calendarId (any writable connected calendar)
  timeDefense: MostFlexible (always free, prefer ideal time) | LetReclaimDecide (default) |
               MostDefensive (always busy, prefer max duration)
  onConflict: leaveWithWarning | removeFromCalendar
  visibility, dependencies (sequence habits), autoDecline, keywordMatch
FocusTime { weeklyGoalHours }   Task { duration, minChunk?, dueDate, priority }  (Reclaim tasks — unverified minChunk)
```
https://help.reclaim.ai/en/articles/4129152-habits-overview-auto-schedule-flexible-time-for-your-routines · https://help.reclaim.ai/en/articles/4129290-time-defense-settings-for-habits · https://help.reclaim.ai/en/articles/11325700-habits-vs-tasks-vs-focus-time-when-to-use-each-in-reclaim

**Core operations:** define habit → engine writes a flexible event per occurrence; auto-move when a meeting lands on it (shrink within min/max, or shift toward ideal time); flip Free→Busy as start approaches / remaining window shrinks; mark done/skip; weekly focus-hours goal counted from habits+tasks.

**Generator implication:** same planner as §4 with a different objective: place recurring windows (per frequency) minimizing distance-to-ideal, subject to min/max duration; store a `busyState` that hardens over time.

### 6. Acting assistant — Lindy

**Minimal model (from docs.lindy.ai)**
```
Routine
  trigger: schedule(daily|weekly|monthly) | event(email received/sent, Slack message,
           calendar event about to start, meeting ended, …) + smartFilter (plain-English narrowing)
  instructions (plain English)
  destination (where the result goes: email/Slack/…)
  dryRun (executes end-to-end on real data without acting)
Skill { name, playbook text }  — reusable, auto-picked when a request matches
Prefs for scheduling: workingHours, buffers, blockedTimes, defaultMeetingLength
```
https://docs.lindy.ai/teammate/routines.md · https://docs.lindy.ai/teammate/skills.md · scheduling: https://docs.lindy.ai/features/meeting-assistant/scheduling.md · email labeling: https://docs.lindy.ai/features/inbox-management/email-triage.md

**Core operations (what users depend on):** (1) CC `lindy@lindy.ai` on a thread → it proposes/books meeting times from calendar availability and sends the invite (needs Google Calendar + Gmail); (2) ad-hoc command "Book a call with Sarah next Tuesday afternoon"; (3) inbox labeling routine with 6 default labels (To Respond, FYI, Newsletters, Comments, Notifications, Invoices), each label = name + colour + plain-English rule + archive-or-keep; (4) scheduled routines (daily brief, weekly digest, meeting follow-ups); (5) draft replies into Drafts.

**Requires:** LLM call + mailbox/calendar OAuth (Gmail send, Calendar write) ⇒ **server/integration**; not possible purely on-device.

### 7. Email organization — Saner.AI

**Minimal model (from saner.ai + help center)**
```
InboxItem { source: gmail|outlook|slack|note, ref (email id), summary, priority (AI-assigned),
            suggestedTask?, tags[] (AI), linkedNoteId }
Task { title, dueDate/reminder, priority, contextEmailRef }   Note { body, tags[], embeddedEmail/Event }
Connectors: Gmail (read-only → notes/tasks), Outlook Mail (read-only), Google Calendar (two-way:
            events→notes, tasks→events), Outlook Calendar (read-only), Drive (read-only), Slack (read-only)
```
https://www.saner.ai/blogs/ai-for-emails-feature · https://help.saner.ai/articles/0950228-connectors-overview · https://saner.ai/

**Core operations:** sync inbox; "reads your emails, identifies what tasks you need to do, and sets automatic reminders"; sort inbox items by AI priority; turn an email into a task or note (keeps link to source email); ask the assistant ("when can I work on this?" — calendar-aware). Requires mailbox OAuth + LLM ⇒ server-side.

### 8. All-together — Akiflow / ClickUp

**Akiflow — what "one screen" is (help center, product.akiflow.com)**
- Layout: left sidebar (Inbox, Someday, This Week, This Month; Today; projects/tags) · centre **task list** · right **calendar column** (day / 2-day / weekdays / week). Today page sections in order: **Overdue → Today → "Scheduled on Calendar" (time-blocked tasks) → Week**; a filter/sort menu (Plan Date, Priority, Projects, Deadline). https://product.akiflow.com/en/help/articles/0741055-today-page · sidebar/2-day view from changelog snippet https://product.akiflow.com/changelog (unverified layout detail)
- Methodology: capture in Inbox → process (≤2 min do now; known date → plan day; unsure → Time Frame week/month; not actionable → Someday) → work from Today. https://product.akiflow.com/help/articles/3602719-the-methodology
- Command bar (`Cmd/Ctrl+E` desktop global, `Cmd/Ctrl+K` web): `#project`, `*tag`, `!priority`, `|calendar`, `@guest` (events), `>time slot`, `=duration`, `<deadline`, `//description`, plus NL dates ("6/6", "June 6", "Monday", "Tomorrow", "Every Week"; planning examples "Tom 9am", "Fri at 16 for 1h", "In 2 weeks"). Commands: create task/event, plan (`P`), go-to project/tag, join meeting, settings/theme. https://product.akiflow.com/en/help/articles/6483573-command-bar · https://product.akiflow.com/en/help/articles/8286936-task-planning
- Time-blocking: task with date only = "To-do"; date+time (+duration) = on the calendar; "drag and drop tasks from here into your calendar to time block specific hours"; locking a task to the calendar creates a real calendar event (Public/Private/Busy), optional auto-lock; **Time Slots** = named/recurring containers on the calendar holding several tasks, colour by project. https://product.akiflow.com/help/articles/3677363-time-blocking-101
- Akiflow task model (derived): `{title, description, project, tags[], priority, planDate, startTime?, duration?, deadline?, timeSlotId?, recurrence("every day/week/month/year"), inboxSource, done}`; `TimeSlot {title, start, end, projectId?, recurrence?}`.

**ClickUp — what "one screen" is**
- **All Tasks (formerly Everything view)**: "tasks from your entire Workspace in one view", default List view, works with all task views except Form; grouped by status by default; hierarchy Workspace › Space › Folder › List › Task. (Help center returned 403; from search snippets of https://help.clickup.com/hc/en-us/articles/6309783246103-View-all-your-tasks and https://help.clickup.com/hc/en-us/articles/6310138041367-Add-a-view-to-All-Tasks — treat wording as unverified) · API: `GET /v2/team/{team_id}/view` "Everything level" views https://developer.clickup.com/reference/getteamviews
- **My Tasks / Home**: card canvas — **My Work** (tabs To Do / Done / Delegated; To Do grouped Today / Overdue / Next / Unscheduled), **Agenda** (scheduled tasks + reminders + external calendar events), **Personal List**, **LineUp**, Reminders, Comments/Mentions; cards can be added/resized/reordered. https://clickup.com/features/home (+ help snippets https://help.clickup.com/hc/en-us/articles/18947060934423-Use-the-My-Work-card-in-Home, unverified wording)
- Calendar: tasks with start/due appear; unscheduled tasks in a sidebar; drag onto calendar to time-block using the task's `time_estimate`; day/4-day/week/month; Google Calendar 2-way sync claimed. https://clickup.com/features/calendar-view (marketing) · a Home drag-drop bug was acknowledged (https://feedback.clickup.com/bugs/p/dragdrop-unscheduled-tasks-to-calendar)
- Task model (API): `name, description, assignees[], tags[], status, priority 1..4 (Urgent/High/Normal/Low; API maps 3→"normal"; exact colours unverified), due_date (ms) + due_date_time (bool), start_date + start_date_time, time_estimate (ms), parent, custom_fields[], links_to`. https://developer.clickup.com/reference/createtask · priorities https://help.clickup.com/hc/en-us/articles/6304483666199-Set-task-Priorities (snippet)

**Concrete "all in one screen" = three synchronized regions:** (a) a **task list** whose sections are *Overdue / Today / Later (week, month, someday) / Inbox(unscheduled)*, (b) a **calendar column** (day or 2-day) fed by external events + time-blocked tasks + habits, (c) a **command bar** for capture/navigation. Drag from (a) into (b) sets `startTime` and `duration` (default 30 min in Todoist; ClickUp uses `time_estimate`). Notes/pages live one click away (sidebar), not in the primary screen in Akiflow; ClickUp adds Docs as another view type.

### Consolidated "minimum base of the one app"

| Entity | Fields (minimum) | Source app |
|---|---|---|
| **Task** | id · title · notes · projectId · sectionId? · parentId? · order · labels[] · priority 1–4 (1 = highest, p4 default) · due {date \| dateTime, tz, isRecurring, nlString} · deadlineDate? · duration (min) · startOn? · hardDeadline (HARD/SOFT/NONE) · autoSchedule bool · minChunk? · scheduledStart/End, chunks[], schedulingIssue (planner outputs) · timeSlotId? · sourceRef (email/slack id)? · completed, completedAt | Todoist + Motion + Akiflow |
| **RecurrenceRule** | text (as typed) · interval+unit · weekdays[] · monthDays[] · ordinalWeekday ("3rd tue", "last") · workdayOnly · timeOfDay · startsOn · endsOn/count · anchor = originalDate \| completionDate (`every!`) | Todoist |
| **Project / Label / Section** | id · name · colour · (project: parent?, archived) | Todoist, Akiflow, ClickUp |
| **Event** | id · calendarId · title · description · location · start/end {date \| dateTime, tz} · attendees[{email, responseStatus}] · recurrence[RRULE…] · recurringEventId · reminders[] · status · colourId · etag/updated · remoteId · linkedTaskId? | Google Calendar |
| **Calendar** | id · name · tz · source (local \| google \| device \| ics) · writable · colour | Google Calendar |
| **TimeSlot** | title · start/end · projectId? · recurrence? · taskIds[] | Akiflow |
| **Habit** | title · durationMin/Ideal/Max · idealTime · hoursWindow {days[], from, to} · frequency (daily/weekly N×/monthly/custom) · priority · calendarId · timeDefense (flexible/auto/defensive) · onConflict · occurrences[] {eventId, busy bool, done} | Reclaim |
| **FocusGoal** | weeklyHours · countsHabits/Tasks | Reclaim |
| **Page (Note)** | id · parentId (page \| dataSource \| root) · title · icon · blocks[] · updatedAt · trashed | Notion |
| **Block** | id · pageId · parentBlockId? · type (paragraph, h1–h3, bullet, numbered, todo{checked}, toggle, quote, callout, code, divider, image, table, childPage, childDatabase) · richText[] {text, bold/italic/color, href} · order | Notion |
| **DataSource + Row** | schema: {name: type} with types title, text, number, select, multiSelect, status, date, people, checkbox, url, email, phone, relation, formula?, rollup?, createdTime, lastEdited; rows = Pages with `properties` | Notion |
| **InboxItem** | source (email/slack/note) · remoteRef · subject/sender · summary (AI) · priority (AI) · labels[] (To Respond, FYI, Newsletter, …) · suggestedTask? · archived | Saner.AI + Lindy |
| **Routine** | trigger {schedule \| event(email/calendar/slack) + filter} · instructions · destination · dryRun · lastRun | Lindy |
| **Schedule (work hours)** | name · per-weekday windows | Motion/Reclaim |

| Operation | From | Local-only? |
|---|---|---|
| Quick capture with NL parse (`#`, `%/@`, `p1`, `+`, `{deadline}`, `=duration`, `>slot`, dates + recurrence grammar above) | Todoist, Akiflow | **Local** (parser is pure) |
| Complete (incl. recurring → next occurrence; complete forever) | Todoist | Local |
| Reschedule (drag to day; "Reschedule overdue"; postpone to tomorrow) | Todoist | Local |
| Today / Upcoming / Inbox / Someday sections; sort by priority/date/project | Todoist, Akiflow, ClickUp My Work | Local |
| Drag task → calendar = set startTime + duration (default 30 min) and create linked Event | Todoist, Akiflow, ClickUp | Local (writes to Event store; pushing to Google/device is the sync step) |
| Time Slots (containers on calendar) | Akiflow | Local |
| Auto-plan pass: priority → hard deadline → due → chunks into free windows of Schedule; flag `schedulingIssue` | Motion | Local (pure planner) |
| Habit placement + min/max shrink + free→busy hardening | Reclaim | Local (pure planner; writing to external calendar is sync) |
| Everything/All-Tasks list across projects with group-by status | ClickUp | Local |
| Page tree + block editor + typed tables | Notion | Local |
| Command palette (create, go-to, plan `P`) | Akiflow | Local |
| ICS export / share file | — | Local (one-way) |
| Device calendar read/write (Android/iOS; not web) | device_calendar | Local plugin |
| Google Calendar read/write + incremental poll (syncToken, 410 → resync, etag conflicts) | Google API | **Client-only possible** (PKCE, no secret; needs OAuth app + verification for `calendar.events`); web tokens expire hourly |
| Google Calendar real-time push (`watch` webhooks) | Google API | **Server required** (HTTPS endpoint, channel renewal) |
| Email inbox sync, AI summary/priority/label, email→task | Saner.AI, Lindy | **Server + integration** (Gmail/Outlook OAuth, LLM) |
| Acting routines (book meeting, send invite, draft reply, scheduled briefs) | Lindy | **Server + integration** (mail send, calendar write, LLM, scheduler) |

**The "one screen":** Left rail: Inbox · Today · Upcoming · Someday · Projects · Pages. Centre: task list with sections **Overdue / Today / Scheduled on calendar / This week**. Right: **day or 2-day calendar** showing external events + time-blocked tasks + habit blocks; drag between centre and right. Top: command bar (`Ctrl/Cmd+K`). Pages/tables open in the centre pane in place of the list. Everything above runs locally; Google/device calendar sync and any AI/email/acting features are the only pieces that need OAuth integrations, and only push-notifications/mail-sending/LLM steps need a server.

**Unverified items (flagged):** Todoist internal recurrence representation; Google "From URL" refresh interval; ClickUp priority flag colours and exact help-center wording (403); Akiflow sidebar composition (from changelog snippet); Reclaim "lunch" example wording and Reclaim task `minChunk`; Notion database views via API.
