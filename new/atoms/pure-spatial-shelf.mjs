/** אטום-דאטה · spatial-shelf — פירוק משפחת-Pure "spatial" לאטומי-תצוגה רשומים (שכבת-הפירוק).
 *  כל אטום = { name, kind(canonical|signature|inherit), seam }. דאטה-ליטרלית טהורה, אפס-import
 *  (חוק-האטום): הזהות/המראה מוזרקים בקופסה דרך pure-look/pure-resolve, לא כאן. מחולל ע"י
 *  machtzev/pure/pure-decompose.mjs ממקור-האמת machtzev/pure/spatial-family.html (אל תערוך ידנית — regen). */
export const PURE_SPATIAL_SHELF = {
 "family": "spatial",
 "source": "machtzev/pure/spatial-family.html",
 "count": 6,
 "atoms": [
  {
   "name": "MapSurface",
   "note": "markers + route",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "Marker states",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "DataTable",
   "note": "sort merges rows",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "SortHeader states",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "Minimap",
   "note": "viewport",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "TreeGrid",
   "note": "nested rows",
   "kind": "signature",
   "seam": "fields"
  }
 ]
};
