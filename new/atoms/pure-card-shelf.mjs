/** אטום-דאטה · card-shelf — פירוק משפחת-Pure "card" לאטומי-תצוגה רשומים (שכבת-הפירוק).
 *  כל אטום = { name, kind(canonical|signature|inherit), seam }. דאטה-ליטרלית טהורה, אפס-import
 *  (חוק-האטום): הזהות/המראה מוזרקים בקופסה דרך pure-look/pure-resolve, לא כאן. מחולל ע"י
 *  machtzev/pure/pure-decompose.mjs ממקור-האמת machtzev/pure/card-family.html (אל תערוך ידנית — regen). */
export const PURE_CARD_SHELF = {
 "family": "card",
 "source": "machtzev/pure/card-family.html",
 "count": 57,
 "atoms": [
  {
   "name": "FlatCard",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "SectionCard",
   "note": "elevated",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "OutlinedCardSection",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "GlassCard",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "GradientHeroCard",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "SpotlightCard",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "HeroCard",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "StatTile",
   "note": "canonical",
   "kind": "canonical",
   "seam": "fields"
  },
  {
   "name": "MetricTile",
   "note": "down",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "KpiBox",
   "note": "sparkline",
   "kind": "signature",
   "seam": "series"
  },
  {
   "name": "TrendCard",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "SummaryStatStrip",
   "note": "4-up",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "11 atoms",
   "note": "same stat pattern · differ by source",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "DsRecordCard",
   "note": "canonical",
   "kind": "canonical",
   "seam": "fields"
  },
  {
   "name": "ProfileCard",
   "note": "round avatar",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "ProductCard",
   "note": "media top",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "9 atoms",
   "note": "same record frame · differ by fields",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "HubTile",
   "note": "selected",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "GridHubCard",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "ContactTile",
   "note": "row",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "6 atoms",
   "note": "same tile · differ by icon/target",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "AccordionPanel",
   "note": "open",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "AccordionSectionCard",
   "note": "closed",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "PriceEstimatePanel",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "StripPanelFrame",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "StatusDot",
   "note": "live / off / warn",
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
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "FlipCard",
   "note": "hover",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "RevealCard",
   "note": "hover",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "Stat",
   "kind": "inherit"
  },
  {
   "name": "DsStat",
   "kind": "inherit"
  },
  {
   "name": "BareStat",
   "kind": "inherit"
  },
  {
   "name": "RStat",
   "kind": "inherit"
  },
  {
   "name": "SStat",
   "kind": "inherit"
  },
  {
   "name": "TodayStat",
   "kind": "inherit"
  },
  {
   "name": "IntelStat",
   "kind": "inherit"
  },
  {
   "name": "StatBlock",
   "kind": "inherit"
  },
  {
   "name": "StatsCard",
   "kind": "inherit"
  },
  {
   "name": "WorkerAppStat",
   "kind": "inherit"
  },
  {
   "name": "WorkerProfileStat",
   "kind": "inherit"
  },
  {
   "name": "OrderCard",
   "kind": "inherit"
  },
  {
   "name": "CustomerCard",
   "kind": "inherit"
  },
  {
   "name": "SupplierTile",
   "kind": "inherit"
  },
  {
   "name": "SummaryCard",
   "kind": "inherit"
  },
  {
   "name": "ProposalCard",
   "kind": "inherit"
  },
  {
   "name": "ApprovalCard",
   "kind": "inherit"
  },
  {
   "name": "PenaltyCard",
   "kind": "inherit"
  },
  {
   "name": "VacationRequestCard",
   "kind": "inherit"
  },
  {
   "name": "DeliveryOptionCard",
   "kind": "inherit"
  },
  {
   "name": "DsNavTile",
   "kind": "inherit"
  },
  {
   "name": "CategoryTile",
   "kind": "inherit"
  },
  {
   "name": "ServiceTile",
   "kind": "inherit"
  },
  {
   "name": "ConnectorTile",
   "kind": "inherit"
  },
  {
   "name": "AccessoryTile",
   "kind": "inherit"
  },
  {
   "name": "SiteHubCaCard",
   "kind": "inherit"
  }
 ]
};
