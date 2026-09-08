# תכנית-חלקיקים (הכרעה-27 · חיפוש-פתוח בכל הקטלוג)

| חלקיק | ישות | צורה | פעולות ⇒ אטומים (חיפוש) | מחווט |
|---|---|---|---|---|
| טבלה | תיק | table | table⇒DsTable (DsTable/ForgeModalDialog) | DsTable |
| פעולה פתח תיק | תיק | act | action⇒DsChipButton (DsChipButton/DsPrimaryButton) | DsChipButton |
| ריק אין תיקים עדיין | תיק | empty | empty⇒EmptyStateCard (EmptyStateCard/EmptyState) | EmptyState@premium/feedback |
| מסגרת | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| בדיקה | ממצא | content | group⇒SectionHeader (SectionHeader/DsSection) · alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| אסור | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| לא נכנס | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| צבע | ממצא | partition | group⇒AnimatedEmpty (AnimatedEmpty/DsSection) · alert⇒AlertBanner (AlertBanner/ToastCard) | DsSection + DsNote |
| לוח | תיק | dates | magnitude⇒KpiTile (KpiTile/ProgressRing) | KvLine |

# תכנית-דוחות (G24 · חלקיק-דוח = מבנה-קבוע-לרשומה)

| דוח | חלק | ref | פתרון | אטומים |
|---|---|---|---|---|
| תיק | [ייצוא] שליחה בוואטסאפ | טלפון, קישור לפתיחת שיחה | action+link | DsChipButton + waLink |
| תיק | כרטיס עסקה ב־ שורות | [תוכן כרטיס עסקה ב־ שורות] | content | DsNote |
| תיק | אדום צהוב ירוק | ממצא.צבע | childParticle | DsSection + DsNote |
| תיק | אדום צהוב ירוק | [תוכן אדום צהוב ירוק] | content | DsNote |
| תיק | חישוב בטוחות | [תוכן חישוב בטוחות] | content | DsNote |
| תיק | בקשות לשינוי | מתווך | particle (שדה) | DsChip |
| תיק | בקשות לשינוי | [תוכן בקשות לשינוי] | content | DsNote |
| תיק | החלטה | החלטה | particle (שדה) | DsChip |
| תיק | מה לא בדקנו | [תוכן מה לא בדקנו] | content | DsNote |
| תיק | לוח | לוח | particle | KvLine |
| תיק | הסתייגות | [תוכן הסתייגות] | content | DsNote |
