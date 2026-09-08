# תכנית-חלקיקים (הכרעה-27 · חיפוש-פתוח בכל הקטלוג)

| חלקיק | ישות | צורה | פעולות ⇒ אטומים (חיפוש) | מחווט |
|---|---|---|---|---|
| טבלה | תיק | table | table⇒DsTable (DsTable/ForgeModalDialog) | DsTable |
| פעולה פתח תיק | תיק | act | action⇒DsPrimaryButton (DsPrimaryButton/GlassButton) | DsPrimaryButton |
| ריק אין תיקים עדיין | תיק | empty | empty⇒EmptyStateCard (EmptyStateCard/EmptyState) | EmptyState@premium/feedback |
| מסגרת | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| בלוקים | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| בדיקה | ממצא | content | group⇒SectionHeader (SectionHeader/DsSection) · alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| אסור | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| צבע | ממצא | partition | group⇒AnimatedEmpty (AnimatedEmpty/DsSection) · alert⇒AlertBanner (AlertBanner/ToastCard) | DsSection + DsNote |
| דיף סעיפים | תיק | diff | trend⇒TrendStat (TrendStat/DsDiffRow) · magnitude⇒KpiTile (KpiTile/ProgressRing) | DsDiffRow + KvLine |
| הודעת תשובה אחת | תיק | message | switch⇒SegmentedSwitch (SegmentedSwitch/ForgeCheckPop) · alert⇒ToastCard (ToastCard/AlertBanner) | ForgeMustChip + DsNote |
| לוח | תיק | dates | magnitude⇒KpiTile (KpiTile/ProgressRing) | KvLine |

# תכנית-דוחות (G24 · חלקיק-דוח = מבנה-קבוע-לרשומה)

| דוח | חלק | ref | פתרון | אטומים |
|---|---|---|---|---|
| תיק | [ייצוא] שליחה בוואטסאפ | טלפון, קישור לפתיחת שיחה | action+link | DsPrimaryButton + waLink |
| תיק | כרטיס | [תוכן כרטיס] | content | DsNote |
| תיק | דיף סעיפים | דיף סעיפים | particle | DsDiffRow + KvLine |
| תיק | מספר מיקוח אחד | [תוכן מספר מיקוח אחד] | content | DsNote |
| תיק | הודעת תשובה אחת | הודעת תשובה אחת | particle | ForgeMustChip + DsNote |
| תיק | לוח | לוח | particle | KvLine |
| תיק | הסתייגות | [תוכן הסתייגות] | content | DsNote |
