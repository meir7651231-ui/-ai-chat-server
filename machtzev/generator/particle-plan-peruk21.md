# תכנית-חלקיקים (הכרעה-27 · חיפוש-פתוח בכל הקטלוג)

| חלקיק | ישות | צורה | פעולות ⇒ אטומים (חיפוש) | מחווט |
|---|---|---|---|---|
| טבלה | תיק | table | table⇒DsTable (DsTable/ForgeDataGrid) | DsTable |
| פעולה פתח תיק | תיק | act | action⇒DsPrimaryButton (DsPrimaryButton/GlassButton) | DsPrimaryButton |
| ריק אין תיקים עדיין | תיק | empty | empty⇒EmptyStateCard (EmptyStateCard/EmptyState) | EmptyState@premium/feedback |
| מסגרת | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | ToastCard |
| בלוקים | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | ToastCard |
| סיווג | תיק | content | group⇒DsSection (DsSection/SectionHeader) · alert⇒ToastCard (ToastCard/AlertBanner) | ToastCard |
| אסור | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | ToastCard |

# תכנית-דוחות (G24 · חלקיק-דוח = מבנה-קבוע-לרשומה)

| דוח | חלק | ref | פתרון | אטומים |
|---|---|---|---|---|
| תיק | [ייצוא] שליחה בוואטסאפ | טלפון, קישור לפתיחת שיחה | action+link | DsPrimaryButton + waLink |
| תיק | כרטיס בעברית פשוטה | [תוכן כרטיס בעברית פשוטה] | content | ToastCard |
| תיק | רשימת הגשה | [תוכן רשימת הגשה] | content | ToastCard |
| תיק | טיוטת תשובה קצרה למחנכת | [תוכן טיוטת תשובה קצרה למחנכת] | content | ToastCard |
| תיק | שאלות לפגישה | [תוכן שאלות לפגישה] | content | ToastCard |
| תיק | מה לא לכתוב בקבוצת | [תוכן מה לא לכתוב בקבוצת] | content | ToastCard |
| תיק | הסתייגות | [תוכן הסתייגות] | content | ToastCard |
