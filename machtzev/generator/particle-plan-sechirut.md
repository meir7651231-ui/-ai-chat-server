# תכנית-חלקיקים (הכרעה-27 · חיפוש-פתוח בכל הקטלוג)

| חלקיק | ישות | צורה | פעולות ⇒ אטומים (חיפוש) | מחווט |
|---|---|---|---|---|
| חורג | בטוחה | / | ratio⇒StatRow (StatRow/ProgressStatRow) | ForgeGlowSlider |
| מעל התקרה | בטוחה | count | headline⇒KpiTile (KpiTile/ProgressRing) | KvLine |
| אדומים | ממצא | count | headline⇒KpiTile (KpiTile/ProgressRing) | KvLine |
| צבע | ממצא | partition | group⇒AnimatedEmpty (AnimatedEmpty/DsSection) · alert⇒AlertBanner (AlertBanner/ToastCard) | DsSection + DsNote |
| מה לבקש | ממצא | raw | fact⇒DsChip (DsChip/DsEmpty) | DsChip |
| הכנסה | תשלום | sum | headline⇒KpiTile (KpiTile/ProgressRing) | KvLine |
| לא שולם | תשלום | count | headline⇒KpiTile (KpiTile/ProgressRing) | KvLine |
| שכירות לשנה | תיק | raw | fact⇒NumberStepper (NumberStepper/DsChip) | DsChip |
| טבלה | תיק | table | table⇒DsTable (DsTable/ForgeModalDialog) | DsTable |
| פעולה פתח תיק | תיק | act | action⇒DsChipButton (DsChipButton/DsPrimaryButton) | DsChipButton |
| ריק אין ממצאים עדיין | ממצא | empty | empty⇒EmptyStateCard (EmptyStateCard/EmptyState) | EmptyState@premium/feedback |
| החלטה | תיק | partition | group⇒DsSection (DsSection/SectionHeader) · alert⇒ToastCard (ToastCard/AlertBanner) | DsSection + DsNote |
| המספר שלך | תיק | number | hero⇒KpiTile (KpiTile/ProgressRing) | KvLine |
| התשובה | תיק | message | switch⇒SegmentedSwitch (SegmentedSwitch/ForgeCheckPop) · alert⇒AlertBanner (AlertBanner/ToastCard) | ForgeMustChip + DsNote |
| לוח | תיק | dates | magnitude⇒KpiTile (KpiTile/ProgressRing) | KvLine |
| רשימת בדיקה | ממצא | content | group⇒DsSection (DsSection/SectionHeader) · alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| מה החוק קובע | בטוחה | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| נוסחים לוואטסאפ | ממצא | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |
| אסור בפלט | תיק | content | alert⇒ToastCard (ToastCard/AlertBanner) | DsNote |

# תכנית-דוחות (G24 · חלקיק-דוח = מבנה-קבוע-לרשומה)

| דוח | חלק | ref | פתרון | אטומים |
|---|---|---|---|---|
| תיק | [ייצוא] שליחה בוואטסאפ | טלפון, קישור לפתיחת שיחה | action+link | DsChipButton + waLink |
| תיק | המספר שלך | המספר שלך | particle | KvLine |
| תיק | אדום צהוב ירוק | ממצא.צבע | childParticle | DsSection + DsNote |
| תיק | התשובה | התשובה | particle | ForgeMustChip + DsNote |
| תיק | לוח | לוח | particle | KvLine |
| תיק | כרטיס עסקה | לקוח | particle (שדה) | DsChip |
| תיק | כרטיס עסקה | שכירות | particle (שדה) | DsChip |
| תיק | כרטיס עסקה | חודשים | particle (שדה) | DsChip |
| תיק | כרטיס עסקה | שכירות לשנה | particle | DsChip |
| תיק | כרטיס עסקה | בטוחה.סך בטוחות | childParticle (שדה) | DsChip |
| תיק | כרטיס עסקה | בטוחה.חורג מול 3 חודשים | childParticle (שדה) | DsChip |
| תיק | חישוב בטוחות | בטוחה.תקרה לפי 3 חודשים | childParticle (שדה) | DsChip |
| תיק | חישוב בטוחות | בטוחה.תקרה לפי שליש | childParticle (שדה) | DsChip |
| תיק | חישוב בטוחות | בטוחה.חורג | childParticle | ForgeGlowSlider |
| תיק | חישוב בטוחות | בטוחה.מעל התקרה | childParticle | KvLine |
| תיק | בקשות לשינוי | ממצא.מה לבקש | childParticle | DsChip |
| תיק | מה לא בדקנו | [תוכן לא נבדק] | content | DsNote |
| תיק | הסתייגות | [תוכן הסתייגות] | content | DsNote |
