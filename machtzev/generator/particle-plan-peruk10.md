# תכנית-חלקיקים (הכרעה-27 · חיפוש-פתוח בכל הקטלוג)

| חלקיק | ישות | צורה | פעולות ⇒ אטומים (חיפוש) | מחווט |
|---|---|---|---|---|
| טבלה | תיק | table | table⇒DsTable (DsTable/ForgeModalDialog) | DsTable |
| פעולה פתח תיק | תיק | act | action⇒DsChipButton (DsChipButton/DsPrimaryButton) | DsChipButton |
| ריק אין תיקים עדיין | תיק | empty | empty⇒EmptyStateCard (EmptyStateCard/EmptyState) | EmptyState@premium/feedback |
| מסגרת | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| בלוקים | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| סיווג | תיק | content | group⇒DsSection (DsSection/SectionHeader) · alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| אסור | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |

# תכנית-דוחות (G24 · חלקיק-דוח = מבנה-קבוע-לרשומה)

| דוח | חלק | ref | פתרון | אטומים |
|---|---|---|---|---|
| תיק | [ייצוא] שליחה בוואטסאפ | טלפון, קישור לפתיחת שיחה | action+link | DsChipButton + waLink |
| תיק | כרטיס | [תוכן כרטיס] | content | DsNote |
| תיק | פירוק הסכום לשורות | [תוכן פירוק הסכום לשורות] | content | DsNote |
| תיק | צעד אחד השבוע לא | [תוכן צעד אחד השבוע לא] | content | DsNote |
| תיק | טיוטת פנייה אם יש | [תוכן טיוטת פנייה אם יש] | content | DsNote |
| תיק | מה יקרה אם מתעלמים | [תוכן מה יקרה אם מתעלמים] | content | DsNote |
| תיק | מתי לעצור וללכת לעו״ד | [תוכן מתי לעצור וללכת לעו״ד] | content | DsNote |
| תיק | הסתייגות | [תוכן הסתייגות] | content | DsNote |
