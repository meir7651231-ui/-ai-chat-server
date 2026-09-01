/** אטום-דאטה · composite-shelf — פירוק משפחת-Pure "composite" לאטומי-תצוגה רשומים (שכבת-הפירוק).
 *  כל אטום = { name, kind(canonical|signature|inherit), seam }. דאטה-ליטרלית טהורה, אפס-import
 *  (חוק-האטום): הזהות/המראה מוזרקים בקופסה דרך pure-look/pure-resolve, לא כאן. מחולל ע"י
 *  machtzev/pure/pure-decompose.mjs ממקור-האמת machtzev/pure/composite-family.html (אל תערוך ידנית — regen). */
export const PURE_COMPOSITE_SHELF = {
 "family": "composite",
 "source": "machtzev/pure/composite-family.html",
 "count": 32,
 "atoms": [
  {
   "name": "FormCard",
   "note": "header + 3 fields + actions",
   "kind": "signature",
   "seam": "self"
  },
  {
   "name": "SignInForm",
   "note": "compact",
   "kind": "signature",
   "seam": "self"
  },
  {
   "name": "QuickAddForm",
   "note": "error state",
   "kind": "signature",
   "seam": "self"
  },
  {
   "name": "8 assemblies",
   "note": "same head/rhythm/foot · differ by field set",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "FilterBar",
   "note": "search + chips + sort",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "FilterToolbar",
   "note": "segments + view + sort",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "WizardHeader",
   "note": "step 2/4 · progress bar",
   "kind": "signature",
   "seam": "self"
  },
  {
   "name": "WizardStep",
   "note": "dotted indicator + 2-up fields",
   "kind": "signature",
   "seam": "self"
  },
  {
   "name": "RequestComposer",
   "note": "textarea + toolbar + send",
   "kind": "signature",
   "seam": "self"
  },
  {
   "name": "ReplyComposer",
   "note": "single-line + send",
   "kind": "signature",
   "seam": "self"
  },
  {
   "name": "CartSummaryCard",
   "note": "line rows + total",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "SummaryCard",
   "note": "label/value ledger",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "SettingsGroup",
   "note": "switches + select row",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "StripGroupCard",
   "note": "master + child rows",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "6 row atoms",
   "note": "same section rhythm · differ by control",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "SplitControl",
   "note": "master list + detail panel",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "StatClusterCard",
   "note": "header + 3-up strip",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "SummaryStatStrip",
   "note": "4-up · no trend",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "FamilyForm",
   "kind": "inherit"
  },
  {
   "name": "CourseForm",
   "kind": "inherit"
  },
  {
   "name": "SupporterForm",
   "kind": "inherit"
  },
  {
   "name": "DonationModal",
   "kind": "inherit"
  },
  {
   "name": "RoomForm",
   "kind": "inherit"
  },
  {
   "name": "ManageModal",
   "kind": "inherit"
  },
  {
   "name": "CallbackModal",
   "kind": "inherit"
  },
  {
   "name": "IntakePanel",
   "kind": "inherit"
  },
  {
   "name": "SettingsSwitchRow",
   "kind": "inherit"
  },
  {
   "name": "SettingsSectionTile",
   "kind": "inherit"
  },
  {
   "name": "SettingsRadioGroupRow",
   "kind": "inherit"
  },
  {
   "name": "SettingsTimeRow",
   "kind": "inherit"
  },
  {
   "name": "SettingsActionRow",
   "kind": "inherit"
  },
  {
   "name": "RegressionPanelCheckRow",
   "kind": "inherit"
  }
 ]
};
