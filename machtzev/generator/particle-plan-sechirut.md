# תכנית-חלקיקים (הכרעה-27 · חיפוש-פתוח בכל הקטלוג)

| חלקיק | ישות | צורה | פעולות ⇒ אטומים (חיפוש) | מחווט |
|---|---|---|---|---|
| חורג | בטוחה | / | ratio⇒StatRow (StatRow/ProgressStatRow) | StatRow |
| מעל התקרה | בטוחה | count | headline⇒KpiTile (KpiTile/ProgressRing) | KpiTile |
| אדומים | ממצא | count | headline⇒KpiTile (KpiTile/ProgressRing) | KpiTile |
| צבע | ממצא | partition | group⇒AnimatedEmpty (AnimatedEmpty/DsSection) | SectionHeader |
| מה לבקש | ממצא | raw | fact⇒DsChip (DsChip/DsEmpty) | DsChip |
| הכנסה | תשלום | sum | headline⇒KpiTile (KpiTile/ProgressRing) | KpiTile |
| לא שולם | תשלום | count | headline⇒KpiTile (KpiTile/ProgressRing) | KpiTile |
| שכירות לשנה | תיק | raw | fact⇒NumberStepper (NumberStepper/DsChip) | DsChip |
| טבלה | תיק | table | table⇒DsTable (DsTable/ForgeDataGrid) | DsTable |
| פעולה פתח תיק | תיק | act | action⇒DsPrimaryButton (DsPrimaryButton/GlassButton) | DsPrimaryButton |
| ריק אין ממצאים עדיין | ממצא | empty | empty⇒EmptyStateCard (EmptyStateCard/EmptyState) | EmptyState@premium/feedback |
