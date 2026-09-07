# תכנית-חלקיקים (הכרעה-27 · חיפוש-פתוח בכל הקטלוג)

| חלקיק | ישות | צורה | פעולות ⇒ אטומים (חיפוש) | מחווט |
|---|---|---|---|---|
| טבלה | תיק | table | table⇒DsTable (DsTable/ForgeDataGrid) | DsTable |
| פעולה פתח תיק | תיק | act | action⇒DsPrimaryButton (DsPrimaryButton/GlassButton) | DsPrimaryButton |
| ריק אין תיקים עדיין | תיק | empty | empty⇒EmptyStateCard (EmptyStateCard/EmptyState) | EmptyState@premium/feedback |
| מסגרת | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | ToastCard |
| בלוקים | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | ToastCard |
| בדיקה | ממצא | content | group⇒SectionHeader (SectionHeader/DsSection) · alert⇒ToastCard (ToastCard/AlertBanner) | ToastCard |
| אסור | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | ToastCard |
| צבע | ממצא | partition | group⇒AnimatedEmpty (AnimatedEmpty/DsSection) · alert⇒AlertBanner (AlertBanner/ToastCard) | DsSection + ToastCard |

# תכנית-דוחות (G24 · חלקיק-דוח = מבנה-קבוע-לרשומה)

| דוח | חלק | ref | פתרון | אטומים |
|---|---|---|---|---|
| תיק | [ייצוא] שליחה בוואטסאפ | טלפון, קישור לפתיחת שיחה | action+link | DsPrimaryButton + waLink |
| תיק | כרטיס | [תוכן כרטיס] | content | ToastCard |
| תיק | דיף סעיפים | [תוכן דיף סעיפים] | content | ToastCard |
| תיק | מספר מיקוח אחד | [תוכן מספר מיקוח אחד] | content | ToastCard |
| תיק | הודעת תשובה אחת | הודעת תשובה אחת | particle (שדה) | DsChip |
| תיק | הודעת תשובה אחת | [תוכן הודעת תשובה אחת] | content | ToastCard |
| תיק | לוח | [תוכן לוח] | content | ToastCard |
| תיק | הסתייגות | [תוכן הסתייגות] | content | ToastCard |
