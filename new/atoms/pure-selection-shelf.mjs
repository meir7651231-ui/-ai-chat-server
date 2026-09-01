/** אטום-דאטה · selection-shelf — פירוק משפחת-Pure "selection" לאטומי-תצוגה רשומים (שכבת-הפירוק).
 *  כל אטום = { name, kind(canonical|signature|inherit), seam }. דאטה-ליטרלית טהורה, אפס-import
 *  (חוק-האטום): הזהות/המראה מוזרקים בקופסה דרך pure-look/pure-resolve, לא כאן. מחולל ע"י
 *  machtzev/pure/pure-decompose.mjs ממקור-האמת machtzev/pure/selection-family.html (אל תערוך ידנית — regen). */
export const PURE_SELECTION_SHELF = {
 "family": "selection",
 "source": "machtzev/pure/selection-family.html",
 "count": 57,
 "atoms": [
  {
   "name": "CheckRow",
   "note": "canonical",
   "kind": "canonical",
   "seam": "state"
  },
  {
   "name": "PendingCheckRow",
   "note": "checked",
   "kind": "signature",
   "seam": "state"
  },
  {
   "name": "CheckPop",
   "note": "indeterminate",
   "kind": "signature",
   "seam": "state"
  },
  {
   "name": "RegressionPanelCheckRow",
   "note": "disabled",
   "kind": "signature",
   "seam": "state"
  },
  {
   "name": "PickerOptionsPanel",
   "note": "canonical",
   "kind": "canonical",
   "seam": "group"
  },
  {
   "name": "PickerOption",
   "note": "with value",
   "kind": "signature",
   "seam": "group"
  },
  {
   "name": "4 atoms",
   "note": "same single-choice pattern · differ by option payload",
   "kind": "signature",
   "seam": "group"
  },
  {
   "name": "SwitchRow",
   "note": "canonical",
   "kind": "canonical",
   "seam": "state"
  },
  {
   "name": "AnimatedToggle",
   "note": "disabled-on",
   "kind": "signature",
   "seam": "state"
  },
  {
   "name": "SettingsSwitchRow",
   "note": "status pill fixed",
   "kind": "signature",
   "seam": "state"
  },
  {
   "name": "FacetChip",
   "note": "canonical · click to toggle",
   "kind": "canonical",
   "seam": "collection"
  },
  {
   "name": "PresetChip",
   "note": "add-affordance",
   "kind": "signature",
   "seam": "choice"
  },
  {
   "name": "MustChip",
   "note": "required facet",
   "kind": "signature",
   "seam": "choice"
  },
  {
   "name": "6 atoms",
   "note": "same toggle-chip · differ by facet source/layout",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "UnitSegmentToggle",
   "note": "canonical",
   "kind": "canonical",
   "seam": "exclusive"
  },
  {
   "name": "SegmentedPillToggle",
   "note": "two-up",
   "kind": "signature",
   "seam": "exclusive"
  },
  {
   "name": "SegPicker",
   "note": "four-up",
   "kind": "signature",
   "seam": "exclusive"
  },
  {
   "name": "TagInput",
   "note": "canonical · removable",
   "kind": "canonical",
   "seam": "collection"
  },
  {
   "name": "TintedTag",
   "note": "read row",
   "kind": "signature",
   "seam": "token"
  },
  {
   "name": "TagDetailRow",
   "note": "key + token",
   "kind": "signature",
   "seam": "token"
  },
  {
   "name": "StarRating",
   "note": "canonical · click to set",
   "kind": "canonical",
   "seam": "value"
  },
  {
   "name": "RatingBars",
   "note": "bar scale",
   "kind": "signature",
   "seam": "value"
  },
  {
   "name": "DropSelect",
   "note": "chosen",
   "kind": "signature",
   "seam": "value"
  },
  {
   "name": "DsChip",
   "note": "canonical · accent (selected) vs semantic (status) fixed",
   "kind": "canonical",
   "seam": "series"
  },
  {
   "name": "14 atoms",
   "note": "same chip/pill frame · differ by field payload",
   "kind": "signature",
   "seam": "series"
  },
  {
   "name": "5 atoms",
   "note": "ok/warn/err tint · never morph with theme",
   "kind": "signature",
   "seam": "state"
  },
  {
   "name": "PersonaPickingSheetBanner",
   "kind": "inherit"
  },
  {
   "name": "DeliveryOptionCard",
   "kind": "inherit"
  },
  {
   "name": "FacetRow",
   "kind": "inherit"
  },
  {
   "name": "DsToggleTile",
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
   "name": "NotifSettingsSwitchRow",
   "kind": "inherit"
  },
  {
   "name": "FilterChipPill",
   "kind": "inherit"
  },
  {
   "name": "ChipWrap",
   "kind": "inherit"
  },
  {
   "name": "ChipScroll",
   "kind": "inherit"
  },
  {
   "name": "ChipCloud",
   "kind": "inherit"
  },
  {
   "name": "MatchChip",
   "kind": "inherit"
  },
  {
   "name": "DateChip",
   "kind": "inherit"
  },
  {
   "name": "Pill",
   "kind": "inherit"
  },
  {
   "name": "BadgePill",
   "kind": "inherit"
  },
  {
   "name": "ValueChip",
   "kind": "inherit"
  },
  {
   "name": "PriceChip",
   "kind": "inherit"
  },
  {
   "name": "NameChip",
   "kind": "inherit"
  },
  {
   "name": "AttributeChip",
   "kind": "inherit"
  },
  {
   "name": "StageChip",
   "kind": "inherit"
  },
  {
   "name": "SectionPill",
   "kind": "inherit"
  },
  {
   "name": "SummaryChip",
   "kind": "inherit"
  },
  {
   "name": "ProjectChip",
   "kind": "inherit"
  },
  {
   "name": "IntelPill",
   "kind": "inherit"
  },
  {
   "name": "StorePill",
   "kind": "inherit"
  },
  {
   "name": "ScoreBandChip",
   "kind": "inherit"
  },
  {
   "name": "PickerOptionChip",
   "kind": "inherit"
  },
  {
   "name": "StatusChip",
   "kind": "inherit"
  },
  {
   "name": "SeverityChip",
   "kind": "inherit"
  },
  {
   "name": "WarnChip",
   "kind": "inherit"
  },
  {
   "name": "StatusDotChip",
   "kind": "inherit"
  }
 ]
};
