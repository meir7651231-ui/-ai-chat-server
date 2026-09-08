# תכנית-חלקיקים (הכרעה-27 · חיפוש-פתוח בכל הקטלוג)

| חלקיק | ישות | צורה | פעולות ⇒ אטומים (חיפוש) | מחווט |
|---|---|---|---|---|
| טבלה | תיק | table | table⇒DsTable (DsTable/ForgeModalDialog) | DsTable |
| פעולה פתח תיק | תיק | act | action⇒DsChipButton (DsChipButton/DsPrimaryButton) | DsChipButton |
| ריק אין תיקים עדיין | תיק | empty | empty⇒EmptyStateCard (EmptyStateCard/EmptyState) | EmptyState@premium/feedback |
| מסגרת | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| בלוקים | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| בדיקה | ממצא | content | group⇒SectionHeader (SectionHeader/DsSection) · alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| אסור | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| צבע | ממצא | partition | group⇒AnimatedEmpty (AnimatedEmpty/DsSection) · alert⇒AlertBanner (AlertBanner/ToastCard) | DsSection + DsNote |

# תכנית-דוחות (G24 · חלקיק-דוח = מבנה-קבוע-לרשומה)

| דוח | חלק | ref | פתרון | אטומים |
|---|---|---|---|---|
| תיק | [ייצוא] שליחה בוואטסאפ | טלפון, קישור לפתיחת שיחה | action+link | DsChipButton + waLink |
| תיק | כרטיס | [תוכן כרטיס] | content | DsNote |
| תיק | ציר | [תוכן ציר] | content | DsNote |
| תיק | טבלת כסף | [תוכן טבלת כסף] | content | DsNote |
| תיק | הודעה | [תוכן הודעה] | content | DsNote |
| תיק | הודעה | [תוכן הודעה] | content | DsNote |
| תיק | מה לא לעשות השבוע | [תוכן מה לא לעשות השבוע] | content | DsNote |
| תיק | הסתייגות | [תוכן הסתייגות] | content | DsNote |
