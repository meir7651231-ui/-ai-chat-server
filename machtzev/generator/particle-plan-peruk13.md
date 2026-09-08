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
| תיק | מה במסמך מסומן חריג | [תוכן מה במסמך מסומן חריג] | content | DsNote |
| תיק | מה לא כתוב לא | [תוכן מה לא כתוב לא] | content | DsNote |
| תיק | שאלות לרופא | [תוכן שאלות לרופא] | content | DsNote |
| תיק | דחוף לא דחוף לפי | [תוכן דחוף לא דחוף לפי] | content | DsNote |
| תיק | הנחיה קשיחה | [תוכן הנחיה קשיחה] | content | DsNote |
| תיק | הסתייגות | [תוכן הסתייגות] | content | DsNote |
