/** אטום-דאטה · status-shelf — פירוק משפחת-Pure "status" לאטומי-תצוגה רשומים (שכבת-הפירוק).
 *  כל אטום = { name, kind(canonical|signature|inherit), seam }. דאטה-ליטרלית טהורה, אפס-import
 *  (חוק-האטום): הזהות/המראה מוזרקים בקופסה דרך pure-look/pure-resolve, לא כאן. מחולל ע"י
 *  machtzev/pure/pure-decompose.mjs ממקור-האמת machtzev/pure/status-family.html (אל תערוך ידנית — regen). */
export const PURE_STATUS_SHELF = {
 "family": "status",
 "source": "machtzev/pure/status-family.html",
 "count": 54,
 "atoms": [
  {
   "name": "StatusChip",
   "note": "canonical · 5-tone (info accent-morph · rest fixed)",
   "kind": "canonical",
   "seam": "series"
  },
  {
   "name": "StatusDotChip",
   "note": "dot + text",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "HierarchyChipPill",
   "note": "info",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "9 atoms",
   "note": "same chip frame · differ by tone/label",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "StatusDot",
   "note": "live / busy / off",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "LiveStatusDot",
   "note": "pulsing",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "LiveStatusPill",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "PulsingStatus",
   "note": "with meta",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "6 atoms",
   "note": "same dot primitive · differ by state/host",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "NotifyBadge",
   "note": "number",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "CountBadge",
   "note": "dot pip (unread)",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "TintedBadgeRow",
   "note": "inline count",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "DraftBadge",
   "note": "UnderConstructionBadge",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "5 atoms",
   "note": "same badge overlay · differ by host icon",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "SeverityChip",
   "note": "low / medium / high / critical",
   "kind": "signature",
   "seam": "series"
  },
  {
   "name": "LinearProgress",
   "note": "canonical (accent)",
   "kind": "canonical",
   "seam": "fields"
  },
  {
   "name": "Meter",
   "note": "success (fixed green)",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "ProgressStatRow",
   "note": "segmented",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "4 atoms",
   "note": "same track/fill · differ by value source",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "RadialGauge",
   "note": "canonical (accent)",
   "kind": "canonical",
   "seam": "fields"
  },
  {
   "name": "ProgressRing",
   "note": "StoryRing",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "ScoreBandChip",
   "note": "segmented + marker",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "StagePill",
   "note": "pipeline (accent current)",
   "kind": "signature",
   "seam": "series"
  },
  {
   "name": "SectionPill",
   "note": "CaPill",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "TrendIndicator",
   "note": "up / down / flat",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "IntelPill",
   "note": "trend up",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "StatTile",
   "note": "embedded trend",
   "kind": "signature",
   "seam": "fields"
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
   "name": "CaPill",
   "kind": "inherit"
  },
  {
   "name": "StorePill",
   "kind": "inherit"
  },
  {
   "name": "RewardsHubPill",
   "kind": "inherit"
  },
  {
   "name": "FilterChipPill",
   "kind": "inherit"
  },
  {
   "name": "Dot",
   "kind": "inherit"
  },
  {
   "name": "LiveDot",
   "kind": "inherit"
  },
  {
   "name": "MaterialDots",
   "kind": "inherit"
  },
  {
   "name": "DotsLoader",
   "kind": "inherit"
  },
  {
   "name": "BadgedIcon",
   "kind": "inherit"
  },
  {
   "name": "CatalogCountBadge",
   "kind": "inherit"
  },
  {
   "name": "ManagerDashboardCountBadge",
   "kind": "inherit"
  },
  {
   "name": "CatalogConfigCountBadge",
   "kind": "inherit"
  },
  {
   "name": "ZoomHintBadge",
   "kind": "inherit"
  },
  {
   "name": "HomeShellBadgedIcon",
   "kind": "inherit"
  },
  {
   "name": "CapacityBar",
   "kind": "inherit"
  },
  {
   "name": "BudgetMeter",
   "kind": "inherit"
  },
  {
   "name": "StoryRing",
   "kind": "inherit"
  },
  {
   "name": "ScoreDial",
   "kind": "inherit"
  },
  {
   "name": "UtilizationGauge",
   "kind": "inherit"
  },
  {
   "name": "StageProgress",
   "kind": "inherit"
  },
  {
   "name": "StepperPill",
   "kind": "inherit"
  },
  {
   "name": "DeltaChip",
   "kind": "inherit"
  },
  {
   "name": "ChangeArrow",
   "kind": "inherit"
  },
  {
   "name": "SparkTrend",
   "kind": "inherit"
  },
  {
   "name": "MetricTile",
   "kind": "inherit"
  }
 ]
};
