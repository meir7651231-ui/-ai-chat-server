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
| הודעה למשכיר מתווך | תיק | message | switch⇒SegmentedSwitch (SegmentedSwitch/ForgeCheckPop) · alert⇒ToastCard (ToastCard/AlertBanner) | ForgeMustChip + DsNote |

# תכנית-דוחות (G24 · חלקיק-דוח = מבנה-קבוע-לרשומה)

| דוח | חלק | ref | פתרון | אטומים |
|---|---|---|---|---|
| תיק | [ייצוא] שליחה בוואטסאפ | טלפון, קישור לפתיחת שיחה | action+link | DsPrimaryButton + waLink |
| תיק | מפת בטוחות | [תוכן מפת בטוחות] | content | DsNote |
| תיק | חשיפת ההורה במשפט אחד | [תוכן חשיפת ההורה במשפט אחד] | content | DsNote |
| תיק | בקשות לתיקון לפני חתימה | בקשות לתיקון לפני חתימה | particle (שדה) | DsChip |
| תיק | הודעה למשכיר מתווך | הודעה למשכיר מתווך | particle | ForgeMustChip + DsNote |
| תיק | החלטה | השטר | particle (שדה) | DsChip |
| תיק | הסתייגות | [תוכן הסתייגות] | content | DsNote |
