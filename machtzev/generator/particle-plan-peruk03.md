# תכנית-חלקיקים (הכרעה-27 · חיפוש-פתוח בכל הקטלוג)

| חלקיק | ישות | צורה | פעולות ⇒ אטומים (חיפוש) | מחווט |
|---|---|---|---|---|
| טבלה | תיק | table | table⇒DsTable (DsTable/ForgeModalDialog) | DsTable |
| פעולה פתח תיק | תיק | act | action⇒DsPrimaryButton (DsPrimaryButton/GlassButton) | DsPrimaryButton |
| ריק אין תיקים עדיין | תיק | empty | empty⇒EmptyStateCard (EmptyStateCard/EmptyState) | EmptyState@premium/feedback |
| מסגרת | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| בלוקים | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| סיווג | תיק | content | group⇒DsSection (DsSection/SectionHeader) · alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| אסור | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| הודעה למשכיר וואטסאפ תיאור | תיק | message | switch⇒SegmentedSwitch (SegmentedSwitch/ForgeCheckPop) · alert⇒ToastCard (ToastCard/AlertBanner) | ForgeMustChip + DsNote |
| הודעה אם אין תשובה | תיק | message | switch⇒SegmentedSwitch (SegmentedSwitch/ForgeCheckPop) · alert⇒ToastCard (ToastCard/AlertBanner) | ForgeMustChip + DsNote |
| לוח | תיק | dates | magnitude⇒KpiTile (KpiTile/ProgressRing) | KvLine |

# תכנית-דוחות (G24 · חלקיק-דוח = מבנה-קבוע-לרשומה)

| דוח | חלק | ref | פתרון | אטומים |
|---|---|---|---|---|
| תיק | [ייצוא] שליחה בוואטסאפ | טלפון, קישור לפתיחת שיחה | action+link | DsPrimaryButton + waLink |
| תיק | סיווג | [תוכן סיווג] | content | DsNote |
| תיק | שעון | [תוכן שעון] | content | DsNote |
| תיק | הודעה למשכיר וואטסאפ תיאור | הודעה למשכיר וואטסאפ תיאור | particle | ForgeMustChip + DsNote |
| תיק | הודעה אם אין תשובה | הודעה אם אין תשובה | particle | ForgeMustChip + DsNote |
| תיק | אסור | [תוכן אסור] | content | DsNote |
| תיק | אופציות אחרי השעון רק | אופציות אחרי השעון רק | particle (שדה) | DsChip |
| תיק | אופציות אחרי השעון רק | [תוכן אופציות אחרי השעון רק] | content | DsNote |
| תיק | מה לצלם היום כדי | [תוכן מה לצלם היום כדי] | content | DsNote |
| תיק | לוח | לוח | particle | KvLine |
| תיק | הסתייגות | [תוכן הסתייגות] | content | DsNote |
