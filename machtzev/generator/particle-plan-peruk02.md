# תכנית-חלקיקים (הכרעה-27 · חיפוש-פתוח בכל הקטלוג)

| חלקיק | ישות | צורה | פעולות ⇒ אטומים (חיפוש) | מחווט |
|---|---|---|---|---|
| טבלה | תיק | table | table⇒DsTable (DsTable/ForgeModalDialog) | DsTable |
| פעולה פתח תיק | תיק | act | action⇒DsPrimaryButton (DsPrimaryButton/GlassButton) | DsPrimaryButton |
| ריק אין תיקים עדיין | תיק | empty | empty⇒EmptyStateCard (EmptyStateCard/EmptyState) | EmptyState@premium/feedback |
| מסגרת | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| בלוקים | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| בדיקה | ממצא | content | group⇒SectionHeader (SectionHeader/DsSection) · alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| אסור | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| צבע | ממצא | partition | group⇒AnimatedEmpty (AnimatedEmpty/DsSection) · alert⇒AlertBanner (AlertBanner/ToastCard) | DsSection + DsNote |
| לוח | תיק | dates | magnitude⇒KpiTile (KpiTile/ProgressRing) | KvLine |

# תכנית-דוחות (G24 · חלקיק-דוח = מבנה-קבוע-לרשומה)

| דוח | חלק | ref | פתרון | אטומים |
|---|---|---|---|---|
| תיק | [ייצוא] שליחה בוואטסאפ | טלפון, קישור לפתיחת שיחה | action+link | DsPrimaryButton + waLink |
| תיק | כרטיס | [תוכן כרטיס] | content | DsNote |
| תיק | טבלת שורות | [תוכן טבלת שורות] | content | DsNote |
| תיק | סכום יעד לדרישה | [תוכן סכום יעד לדרישה] | content | DsNote |
| תיק | הודעת וואטסאפ אחת | [תוכן הודעת וואטסאפ אחת] | content | DsNote |
| תיק | אם מתעלמים מדרגה הבאה | [תוכן אם מתעלמים מדרגה הבאה] | content | DsNote |
| תיק | מה חסר | יציאה | particle (שדה) | DsChip |
| תיק | מה חסר | [תוכן מה חסר] | content | DsNote |
| תיק | לוח | לוח | particle | KvLine |
| תיק | הסתייגות | [תוכן הסתייגות] | content | DsNote |
