/** אטום-דאטה · temporal-shelf — פירוק משפחת-Pure "temporal" לאטומי-תצוגה רשומים (שכבת-הפירוק).
 *  כל אטום = { name, kind(canonical|signature|inherit), seam }. דאטה-ליטרלית טהורה, אפס-import
 *  (חוק-האטום): הזהות/המראה מוזרקים בקופסה דרך pure-look/pure-resolve, לא כאן. מחולל ע"י
 *  machtzev/pure/pure-decompose.mjs ממקור-האמת machtzev/pure/temporal-family.html (אל תערוך ידנית — regen). */
export const PURE_TEMPORAL_SHELF = {
 "family": "temporal",
 "source": "machtzev/pure/temporal-family.html",
 "count": 7,
 "atoms": [
  {
   "name": "MiniCalendar",
   "note": "month grid",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "RangePicker",
   "note": "two ends + fill",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "WeekStrip + DateCell theater",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "TimeSlot",
   "note": "one selected",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "CountdownTimer",
   "note": "tnum",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "LiveClock + RelativeTime",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "MetaTicker",
   "note": "marquee",
   "kind": "signature",
   "seam": "fields"
  }
 ]
};
