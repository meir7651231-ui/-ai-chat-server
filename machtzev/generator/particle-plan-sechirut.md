# תכנית-חלקיקים (הכרעה-27 · חיפוש-פתוח בכל הקטלוג)

| חלקיק | ישות | צורה | פעולות ⇒ אטומים (חיפוש) | מחווט |
|---|---|---|---|---|
| חורג | בטוחה | / | ratio⇒StatRow (StatRow/ProgressStatRow) | StatRow |
| מעל התקרה | בטוחה | count | headline⇒KpiTile (KpiTile/ProgressRing) | KpiTile |
| אדומים | ממצא | count | headline⇒KpiTile (KpiTile/ProgressRing) | KpiTile |
| צבע | ממצא | partition | group⇒AnimatedEmpty (AnimatedEmpty/DsSection) · alert⇒AlertBanner (AlertBanner/ToastCard) | DsSection + ToastCard |
| מה לבקש | ממצא | raw | fact⇒DsChip (DsChip/DsEmpty) | DsChip |
| הכנסה | תשלום | sum | headline⇒KpiTile (KpiTile/ProgressRing) | KpiTile |
| לא שולם | תשלום | count | headline⇒KpiTile (KpiTile/ProgressRing) | KpiTile |
| שכירות לשנה | תיק | raw | fact⇒NumberStepper (NumberStepper/DsChip) | DsChip |
| טבלה | תיק | table | table⇒DsTable (DsTable/ForgeDataGrid) | DsTable |
| פעולה פתח תיק | תיק | act | action⇒DsPrimaryButton (DsPrimaryButton/GlassButton) | DsPrimaryButton |
| ריק אין ממצאים עדיין | ממצא | empty | empty⇒EmptyStateCard (EmptyStateCard/EmptyState) | EmptyState@premium/feedback |
| החלטה | תיק | partition | group⇒DsSection (DsSection/SectionHeader) · alert⇒ToastCard (ToastCard/AlertBanner) | DsSection + ToastCard |
| רשימת בדיקה | ממצא | content | group⇒DsSection (DsSection/SectionHeader) · alert⇒ToastCard (ToastCard/AlertBanner) | ToastCard |
| מה החוק קובע | בטוחה | content | alert⇒ToastCard (ToastCard/AlertBanner) | ToastCard |
| נוסחים לוואטסאפ | ממצא | content | alert⇒ToastCard (ToastCard/AlertBanner) | ToastCard |
| אסור בפלט | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | ToastCard |

# תכנית-דוחות (G24 · חלקיק-דוח = מבנה-קבוע-לרשומה)

| דוח | חלק | ref | פתרון | אטומים |
|---|---|---|---|---|
| תיק | [ייצוא] שליחה בוואטסאפ | טלפון, קישור לפתיחת שיחה | action+link | DsPrimaryButton + waLink |
| תיק | כרטיס עסקה | לקוח | particle (שדה) | DsChip |
| תיק | כרטיס עסקה | שכירות | particle (שדה) | DsChip |
| תיק | כרטיס עסקה | חודשים | particle (שדה) | DsChip |
| תיק | כרטיס עסקה | שכירות לשנה | particle | DsChip |
| תיק | כרטיס עסקה | בטוחה.סך בטוחות | childParticle (שדה) | DsChip |
| תיק | כרטיס עסקה | בטוחה.חורג מול 3 חודשים | childParticle (שדה) | DsChip |
| תיק | אדום צהוב ירוק | ממצא.צבע | childParticle | DsSection + ToastCard |
| תיק | חישוב בטוחות | בטוחה.תקרה לפי 3 חודשים | childParticle (שדה) | DsChip |
| תיק | חישוב בטוחות | בטוחה.תקרה לפי שליש | childParticle (שדה) | DsChip |
| תיק | חישוב בטוחות | בטוחה.חורג | childParticle | StatRow |
| תיק | חישוב בטוחות | בטוחה.מעל התקרה | childParticle | KpiTile |
| תיק | בקשות לשינוי | ממצא.מה לבקש | childParticle | DsChip |
| תיק | החלטה | החלטה | particle (שדה) | DsChip |
| תיק | מה לא בדקנו | [תוכן לא נבדק] | content | ToastCard |
| תיק | הסתייגות | [תוכן הסתייגות] | content | ToastCard |
