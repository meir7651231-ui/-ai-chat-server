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
| תיק | כרטיס | [תוכן כרטיס] | content | ToastCard |
| תיק | רשימת השלמה | [תוכן רשימת השלמה] | content | ToastCard |
| תיק | נוסח פנייה ללשכה פנייה | [תוכן נוסח פנייה ללשכה פנייה] | content | ToastCard |
| תיק | האם בכלל שייך דחוף | [תוכן האם בכלל שייך דחוף] | content | ToastCard |
| תיק | מה לא | [תוכן מה לא] | content | ToastCard |
| תיק | הסתייגות | [תוכן הסתייגות] | content | ToastCard |
