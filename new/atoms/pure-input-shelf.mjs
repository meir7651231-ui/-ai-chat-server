/** אטום-דאטה · input-shelf — פירוק משפחת-Pure "input" לאטומי-תצוגה רשומים (שכבת-הפירוק).
 *  כל אטום = { name, kind(canonical|signature|inherit), seam }. דאטה-ליטרלית טהורה, אפס-import
 *  (חוק-האטום): הזהות/המראה מוזרקים בקופסה דרך pure-look/pure-resolve, לא כאן. מחולל ע"י
 *  machtzev/pure/pure-decompose.mjs ממקור-האמת machtzev/pure/input-family.html (אל תערוך ידנית — regen). */
export const PURE_INPUT_SHELF = {
 "family": "input",
 "source": "machtzev/pure/input-family.html",
 "count": 31,
 "atoms": [
  {
   "name": "DsField",
   "note": "text · full state theater",
   "kind": "signature",
   "seam": "self"
  },
  {
   "name": "Field",
   "note": "bare",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "LabeledField",
   "note": "label + helper",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "FieldRow",
   "note": "inline",
   "kind": "signature",
   "seam": "self"
  },
  {
   "name": "FieldLabel",
   "note": "label only",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "PremiumField",
   "note": "floating label · aurora underline · leading icon",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "GlowField",
   "note": "focus glow",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "DsDateField",
   "note": "date",
   "kind": "signature",
   "seam": "self"
  },
  {
   "name": "DsNumberField",
   "note": "number",
   "kind": "signature",
   "seam": "self"
  },
  {
   "name": "DsEnumField",
   "note": "select",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "DsSearch",
   "note": "search + clear",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "SearchField",
   "note": "animated · active",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "InputBar",
   "note": "composer + send",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "NumberStepper",
   "note": "− value + · state theater",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "QtyStepperBox",
   "note": "boxed",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "SmartQtyStepper",
   "note": "quick-add",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "4 atoms",
   "note": "same numeric control · differ only by data seam / row wrapper",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "GlowSlider",
   "note": "native range · live",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "DualRange",
   "note": "two-thumb · live",
   "kind": "signature",
   "seam": "self"
  },
  {
   "name": "SegPicker",
   "note": "sliding indicator",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "PickerOption",
   "note": "selected row",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "PickerOptionChip",
   "note": "chip select",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "PickerOptionsPanel",
   "note": "grouped",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "TagInput",
   "note": "removable tags",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "OtpInput",
   "note": "advancing boxes",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "PinPad",
   "note": "numeric keypad · live",
   "kind": "signature",
   "seam": "self"
  },
  {
   "name": "WheelPicker",
   "note": "rotating drum · center = value · live snap",
   "kind": "signature",
   "seam": "self"
  },
  {
   "name": "QtyStepper",
   "kind": "inherit"
  },
  {
   "name": "StoreSmartQtyStepper",
   "kind": "inherit"
  },
  {
   "name": "NumberRow",
   "kind": "inherit"
  },
  {
   "name": "SettingsNumberRow",
   "kind": "inherit"
  }
 ]
};
