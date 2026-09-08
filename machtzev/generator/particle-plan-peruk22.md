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
| תיק | מי נשאר החלטה ברורה | [תוכן מי נשאר החלטה ברורה] | content | DsNote |
| תיק | נוסח קצר למנהל ללקוח | [תוכן נוסח קצר למנהל ללקוח] | content | DsNote |
| תיק | מה לבדוק מול המעון | [תוכן מה לבדוק מול המעון] | content | DsNote |
| תיק | דגלים לרופא מיון לפי | [תוכן דגלים לרופא מיון לפי] | content | DsNote |
| תיק | מה לא | [תוכן מה לא] | content | DsNote |
| תיק | הסתייגות | [תוכן הסתייגות] | content | DsNote |
