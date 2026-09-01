/** אטום-דאטה · nav-shelf — פירוק משפחת-Pure "nav" לאטומי-תצוגה רשומים (שכבת-הפירוק).
 *  כל אטום = { name, kind(canonical|signature|inherit), seam }. דאטה-ליטרלית טהורה, אפס-import
 *  (חוק-האטום): הזהות/המראה מוזרקים בקופסה דרך pure-look/pure-resolve, לא כאן. מחולל ע"י
 *  machtzev/pure/pure-decompose.mjs ממקור-האמת machtzev/pure/nav-family.html (אל תערוך ידנית — regen). */
export const PURE_NAV_SHELF = {
 "family": "nav",
 "source": "machtzev/pure/nav-family.html",
 "count": 12,
 "atoms": [
  {
   "name": "AnimatedTabs",
   "note": "underline slide · live",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "SegmentedPillToggle",
   "note": "pill slide",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "StockTab",
   "note": "2-up",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "BreadcrumbTrail",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "HopBreadcrumb",
   "note": "icons",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "MenuRow",
   "note": "selected + default",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "HomeShellMenuRow",
   "note": "shortcut",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "WorkerNav",
   "note": "bottom bar · live",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "DsNavTile",
   "note": "rail · active",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "ActionChipRail",
   "note": "horizontal · one active",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "ImageFacePager",
   "note": "dots + thumbs",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "FabMenu",
   "note": "closed vs expanded (X rotate)",
   "kind": "signature",
   "seam": "fields"
  }
 ]
};
