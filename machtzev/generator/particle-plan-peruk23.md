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
| תיק | מה באמת חשוב למבחן | [תוכן מה באמת חשוב למבחן] | content | DsNote |
| תיק | הסבר אחד פשוט לנקודת | [תוכן הסבר אחד פשוט לנקודת] | content | DsNote |
| תיק | תרגילים דומים פתרון נפרד | [תוכן תרגילים דומים פתרון נפרד] | content | DsNote |
| תיק | סדר דקות | [תוכן סדר דקות] | content | DsNote |
| תיק | מה לא לכסות הלילה | [תוכן מה לא לכסות הלילה] | content | DsNote |
| תיק | הסתייגות | [תוכן הסתייגות] | content | DsNote |
