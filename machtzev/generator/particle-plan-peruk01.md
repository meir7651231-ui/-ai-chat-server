# תכנית-חלקיקים (הכרעה-27 · חיפוש-פתוח בכל הקטלוג)

| חלקיק | ישות | צורה | פעולות ⇒ אטומים (חיפוש) | מחווט |
|---|---|---|---|---|
| טבלה | תיק | table | table⇒DsTable (DsTable/ForgeDataGrid) | DsTable |
| פעולה פתח תיק | תיק | act | action⇒DsPrimaryButton (DsPrimaryButton/GlassButton) | DsPrimaryButton |
| ריק אין תיקים עדיין | תיק | empty | empty⇒EmptyStateCard (EmptyStateCard/EmptyState) | EmptyState@premium/feedback |
| מסגרת | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | ToastCard |
| בדיקה | ממצא | content | group⇒SectionHeader (SectionHeader/DsSection) · alert⇒ToastCard (ToastCard/AlertBanner) | ToastCard |
| אסור | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | ToastCard |
| לא נכנס | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | ToastCard |
| צבע | ממצא | partition | group⇒AnimatedEmpty (AnimatedEmpty/DsSection) · alert⇒AlertBanner (AlertBanner/ToastCard) | DsSection + ToastCard |

# תכנית-דוחות (G24 · חלקיק-דוח = מבנה-קבוע-לרשומה)

| דוח | חלק | ref | פתרון | אטומים |
|---|---|---|---|---|
| תיק | [ייצוא] שליחה בוואטסאפ | טלפון, קישור לפתיחת שיחה | action+link | DsPrimaryButton + waLink |
| תיק | כרטיס עסקה ב־ שורות | [תוכן כרטיס עסקה ב־ שורות] | content | ToastCard |
| תיק | אדום צהוב ירוק | ממצא.צבע | childParticle | DsSection + ToastCard |
| תיק | אדום צהוב ירוק | [תוכן אדום צהוב ירוק] | content | ToastCard |
| תיק | חישוב בטוחות | [תוכן חישוב בטוחות] | content | ToastCard |
| תיק | בקשות לשינוי | מתווך | particle (שדה) | DsChip |
| תיק | בקשות לשינוי | [תוכן בקשות לשינוי] | content | ToastCard |
| תיק | החלטה | החלטה | particle (שדה) | DsChip |
| תיק | מה לא בדקנו | [תוכן מה לא בדקנו] | content | ToastCard |
| תיק | הסתייגות | [תוכן הסתייגות] | content | ToastCard |
