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
| לוח | תיק | dates | magnitude⇒KpiTile (KpiTile/ProgressRing) | KvLine |

# תכנית-דוחות (G24 · חלקיק-דוח = מבנה-קבוע-לרשומה)

| דוח | חלק | ref | פתרון | אטומים |
|---|---|---|---|---|
| תיק | [ייצוא] שליחה בוואטסאפ | טלפון, קישור לפתיחת שיחה | action+link | DsPrimaryButton + waLink |
| תיק | כרטיס בעברית פשוטה | [תוכן כרטיס בעברית פשוטה] | content | DsNote |
| תיק | רשימת הגשה | [תוכן רשימת הגשה] | content | DsNote |
| תיק | טיוטת תשובה קצרה למחנכת | [תוכן טיוטת תשובה קצרה למחנכת] | content | DsNote |
| תיק | שאלות לפגישה | [תוכן שאלות לפגישה] | content | DsNote |
| תיק | מה לא לכתוב בקבוצת | [תוכן מה לא לכתוב בקבוצת] | content | DsNote |
| תיק | לוח | לוח | particle | KvLine |
| תיק | הסתייגות | [תוכן הסתייגות] | content | DsNote |
