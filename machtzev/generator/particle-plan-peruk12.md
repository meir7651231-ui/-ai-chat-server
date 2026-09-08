# תכנית-חלקיקים (הכרעה-27 · חיפוש-פתוח בכל הקטלוג)

| חלקיק | ישות | צורה | פעולות ⇒ אטומים (חיפוש) | מחווט |
|---|---|---|---|---|
| טבלה | תיק | table | table⇒DsTable (DsTable/ForgeModalDialog) | DsTable |
| פעולה פתח תיק | תיק | act | action⇒DsPrimaryButton (DsPrimaryButton/GlassButton) | DsPrimaryButton |
| ריק אין תיקים עדיין | תיק | empty | empty⇒EmptyStateCard (EmptyStateCard/EmptyState) | EmptyState@premium/feedback |
| מסגרת | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| בלוקים | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| אסור | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |

# תכנית-דוחות (G24 · חלקיק-דוח = מבנה-קבוע-לרשומה)

| דוח | חלק | ref | פתרון | אטומים |
|---|---|---|---|---|
| תיק | [ייצוא] שליחה בוואטסאפ | טלפון, קישור לפתיחת שיחה | action+link | DsPrimaryButton + waLink |
| תיק | כרטיס | מחיר | particle (שדה) | DsChip |
| תיק | רשימת שאלות למוכר מקסימום | [תוכן רשימת שאלות למוכר מקסימום] | content | DsNote |
| תיק | מה לבדוק בנסיעה | [תוכן מה לבדוק בנסיעה] | content | DsNote |
| תיק | מה חייב לפני העברה | [תוכן מה חייב לפני העברה] | content | DsNote |
| תיק | נוסח | [תוכן נוסח] | content | DsNote |
| תיק | החלטה | [תוכן החלטה] | content | DsNote |
| תיק | הסתייגות | [תוכן הסתייגות] | content | DsNote |
