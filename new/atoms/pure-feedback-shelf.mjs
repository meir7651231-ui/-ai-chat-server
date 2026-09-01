/** אטום-דאטה · feedback-shelf — פירוק משפחת-Pure "feedback" לאטומי-תצוגה רשומים (שכבת-הפירוק).
 *  כל אטום = { name, kind(canonical|signature|inherit), seam }. דאטה-ליטרלית טהורה, אפס-import
 *  (חוק-האטום): הזהות/המראה מוזרקים בקופסה דרך pure-look/pure-resolve, לא כאן. מחולל ע"י
 *  machtzev/pure/pure-decompose.mjs ממקור-האמת machtzev/pure/feedback-family.html (אל תערוך ידנית — regen). */
export const PURE_FEEDBACK_SHELF = {
 "family": "feedback",
 "source": "machtzev/pure/feedback-family.html",
 "count": 50,
 "atoms": [
  {
   "name": "SnackToast",
   "note": "docked (bottom, over content)",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "AlertBanner",
   "note": "info / success / warning / error",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "5 atoms",
   "note": "same banner type · differ only by data/icon",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "ModalDialog",
   "note": "centered over contained scrim",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "ConfirmDialog",
   "note": "destructive",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "ConsentDialog",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "RuleInspectDialog",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "SlideSheet",
   "note": "handle · header · close · section (top radius only)",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "6 atoms",
   "note": "same sheet frame · differ by content",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "TooltipBubble",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "EmptyHint",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "ZoomHint",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "EmptyState",
   "note": "canonical",
   "kind": "canonical",
   "seam": "fields"
  },
  {
   "name": "AnimatedEmpty",
   "note": "floating",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "SearchEmptyState",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "10 atoms",
   "note": "same empty pattern · differ by glyph/copy",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "ShimmerSkeleton",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "SkeletonCard",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "LinearProgress",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "ProgressRing",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "OrbitSpinner",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "DotsLoader",
   "note": "MaterialDots",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "StoryRing",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "NotifyBadge",
   "note": "CountBadge · BadgedIcon",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "DraftBadge",
   "note": "UnderConstructionBadge · StatusChip",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "4 atoms",
   "note": "same count badge · differ by source",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "TintedBanner",
   "kind": "inherit"
  },
  {
   "name": "CoinBanner",
   "kind": "inherit"
  },
  {
   "name": "QuickReplyBanner",
   "kind": "inherit"
  },
  {
   "name": "RecommendedKitBanner",
   "kind": "inherit"
  },
  {
   "name": "PersonaPickingSheetBanner",
   "kind": "inherit"
  },
  {
   "name": "SheetScaffold",
   "kind": "inherit"
  },
  {
   "name": "StoreSheetScaffold",
   "kind": "inherit"
  },
  {
   "name": "SnoozeSheet",
   "kind": "inherit"
  },
  {
   "name": "SichaSheet",
   "kind": "inherit"
  },
  {
   "name": "SheetTile",
   "kind": "inherit"
  },
  {
   "name": "SheetStatTile",
   "kind": "inherit"
  },
  {
   "name": "DsEmpty",
   "kind": "inherit"
  },
  {
   "name": "Empty",
   "kind": "inherit"
  },
  {
   "name": "CaEmpty",
   "kind": "inherit"
  },
  {
   "name": "EmptyProducts",
   "kind": "inherit"
  },
  {
   "name": "EmptyConnectors",
   "kind": "inherit"
  },
  {
   "name": "EmptyAccessories",
   "kind": "inherit"
  },
  {
   "name": "EmptySection",
   "kind": "inherit"
  },
  {
   "name": "JourneyEmpty",
   "kind": "inherit"
  },
  {
   "name": "StoreEmptyState",
   "kind": "inherit"
  },
  {
   "name": "RoleRequestsInboxEmpty",
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
   "name": "ZoomHintBadge",
   "kind": "inherit"
  }
 ]
};
