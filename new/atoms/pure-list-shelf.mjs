/** אטום-דאטה · list-shelf — פירוק משפחת-Pure "list" לאטומי-תצוגה רשומים (שכבת-הפירוק).
 *  כל אטום = { name, kind(canonical|signature|inherit), seam }. דאטה-ליטרלית טהורה, אפס-import
 *  (חוק-האטום): הזהות/המראה מוזרקים בקופסה דרך pure-look/pure-resolve, לא כאן. מחולל ע"י
 *  machtzev/pure/pure-decompose.mjs ממקור-האמת machtzev/pure/list-family.html (אל תערוך ידנית — regen). */
export const PURE_LIST_SHELF = {
 "family": "list",
 "source": "machtzev/pure/list-family.html",
 "count": 51,
 "atoms": [
  {
   "name": "NumberRow",
   "note": "canonical",
   "kind": "canonical",
   "seam": "fields"
  },
  {
   "name": "ProfileRow",
   "note": "canonical",
   "kind": "canonical",
   "seam": "fields"
  },
  {
   "name": "7 atoms",
   "note": "same avatar frame · differ by fields",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "ActionRow",
   "note": "canonical",
   "kind": "canonical",
   "seam": "fields"
  },
  {
   "name": "5 atoms",
   "note": "same action frame · differ by control",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "SwitchRow",
   "note": "canonical",
   "kind": "canonical",
   "seam": "fields"
  },
  {
   "name": "4 atoms",
   "note": "same toggle · differ by binding",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "LinkRow",
   "note": "selected variant",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "6 atoms",
   "note": "same nav row · differ by icon/target",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "KvRow",
   "note": "canonical",
   "kind": "canonical",
   "seam": "fields"
  },
  {
   "name": "8 atoms",
   "note": "same key/value line · differ by source",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "CheckRow",
   "note": "canonical",
   "kind": "canonical",
   "seam": "fields"
  },
  {
   "name": "2 atoms",
   "note": "same check line · differ by binding",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "NotifRow",
   "note": "canonical",
   "kind": "canonical",
   "seam": "fields"
  },
  {
   "name": "SwipeRow",
   "note": "live reveal",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "ManageRow",
   "note": "overflow menu",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "ContactRow",
   "kind": "inherit"
  },
  {
   "name": "SupplierTile",
   "kind": "inherit"
  },
  {
   "name": "CustomerRow",
   "kind": "inherit"
  },
  {
   "name": "CourierAttendanceTableRow",
   "kind": "inherit"
  },
  {
   "name": "SiteRow",
   "kind": "inherit"
  },
  {
   "name": "VacationRow",
   "kind": "inherit"
  },
  {
   "name": "HomeShellMenuRow",
   "kind": "inherit"
  },
  {
   "name": "SettingsActionRow",
   "kind": "inherit"
  },
  {
   "name": "ChatSettingsActionRow",
   "kind": "inherit"
  },
  {
   "name": "StoreSettingsActionRow",
   "kind": "inherit"
  },
  {
   "name": "StockRow",
   "kind": "inherit"
  },
  {
   "name": "DsToggleTile",
   "kind": "inherit"
  },
  {
   "name": "NotifSettingsSwitchRow",
   "kind": "inherit"
  },
  {
   "name": "ChatSettingsSwitchRow",
   "kind": "inherit"
  },
  {
   "name": "CourierSettingsSwitchRow",
   "kind": "inherit"
  },
  {
   "name": "DsNavTile",
   "kind": "inherit"
  },
  {
   "name": "SectionTile",
   "kind": "inherit"
  },
  {
   "name": "NotifSettingsSectionTile",
   "kind": "inherit"
  },
  {
   "name": "StoreSettingsSectionTile",
   "kind": "inherit"
  },
  {
   "name": "ChatSettingsSectionTile",
   "kind": "inherit"
  },
  {
   "name": "SubRow",
   "kind": "inherit"
  },
  {
   "name": "KvLine",
   "kind": "inherit"
  },
  {
   "name": "FinRow",
   "kind": "inherit"
  },
  {
   "name": "ThrRow",
   "kind": "inherit"
  },
  {
   "name": "RewardsHubFinRow",
   "kind": "inherit"
  },
  {
   "name": "StoreSummaryLine",
   "kind": "inherit"
  },
  {
   "name": "WorkerReportsTabKvRow",
   "kind": "inherit"
  },
  {
   "name": "DecisionLine",
   "kind": "inherit"
  },
  {
   "name": "SpecialtyDerivedRow",
   "kind": "inherit"
  },
  {
   "name": "RegressionPanelCheckRow",
   "kind": "inherit"
  },
  {
   "name": "FacetRow",
   "kind": "inherit"
  },
  {
   "name": "PipelineRow",
   "kind": "inherit"
  },
  {
   "name": "LbRow",
   "kind": "inherit"
  },
  {
   "name": "InlineTextRow",
   "kind": "inherit"
  },
  {
   "name": "AccRow",
   "kind": "inherit"
  }
 ]
};
