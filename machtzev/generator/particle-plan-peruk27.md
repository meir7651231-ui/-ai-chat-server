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
| תיק | כרטיס ימים לפי סדר | [תוכן כרטיס ימים לפי סדר] | content | DsNote |
| תיק | מה לא לחתום לא | [תוכן מה לא לחתום לא] | content | DsNote |
| תיק | רשימת ניירת לאסוף חוזה | [תוכן רשימת ניירת לאסוף חוזה] | content | DsNote |
| תיק | טיוטת הודעה עניינית לצד | [תוכן טיוטת הודעה עניינית לצד] | content | DsNote |
| תיק | מתי חובה עו״ד מחר | [תוכן מתי חובה עו״ד מחר] | content | DsNote |
| תיק | הסתייגות | [תוכן הסתייגות] | content | DsNote |
