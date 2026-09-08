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
| תיק | סדר פעולות ממוספר קודם | [תוכן סדר פעולות ממוספר קודם] | content | DsNote |
| תיק | הודעה למוכר | [תוכן הודעה למוכר] | content | DsNote |
| תיק | טיוטה למנפיק ביט רק | [תוכן טיוטה למנפיק ביט רק] | content | DsNote |
| תיק | מה לצרף | [תוכן מה לצרף] | content | DsNote |
| תיק | אם לא שווה סכום | [תוכן אם לא שווה סכום] | content | DsNote |
| תיק | הסתייגות | [תוכן הסתייגות] | content | DsNote |
