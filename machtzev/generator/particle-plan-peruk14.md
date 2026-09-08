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

# תכנית-דוחות (G24 · חלקיק-דוח = מבנה-קבוע-לרשומה)

| דוח | חלק | ref | פתרון | אטומים |
|---|---|---|---|---|
| תיק | [ייצוא] שליחה בוואטסאפ | טלפון, קישור לפתיחת שיחה | action+link | DsPrimaryButton + waLink |
| תיק | כרטיס | [תוכן כרטיס] | content | DsNote |
| תיק | רשימת השלמה לרופא לקופה | [תוכן רשימת השלמה לרופא לקופה] | content | DsNote |
| תיק | טיוטת פנייה קצרה | [תוכן טיוטת פנייה קצרה] | content | DsNote |
| תיק | האם לגעת בשב״ן | [תוכן האם לגעת בשב״ן] | content | DsNote |
| תיק | מה לא | [תוכן מה לא] | content | DsNote |
| תיק | הסתייגות | [תוכן הסתייגות] | content | DsNote |
