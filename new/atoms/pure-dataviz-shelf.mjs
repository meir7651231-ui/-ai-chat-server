/** אטום-דאטה · dataviz-shelf — פירוק משפחת-Pure "dataviz" לאטומי-תצוגה רשומים (שכבת-הפירוק).
 *  כל אטום = { name, kind(canonical|signature|inherit), seam }. דאטה-ליטרלית טהורה, אפס-import
 *  (חוק-האטום): הזהות/המראה מוזרקים בקופסה דרך pure-look/pure-resolve, לא כאן. מחולל ע"י
 *  machtzev/pure/pure-decompose.mjs ממקור-האמת machtzev/pure/dataviz-family.html (אל תערוך ידנית — regen). */
export const PURE_DATAVIZ_SHELF = {
 "family": "dataviz",
 "source": "machtzev/pure/dataviz-family.html",
 "count": 37,
 "atoms": [
  {
   "name": "BarChart",
   "note": "canonical",
   "kind": "canonical",
   "seam": "fields"
  },
  {
   "name": "RatingBars",
   "note": "horizontal",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "StackedBarGroup",
   "note": "3-series",
   "kind": "signature",
   "seam": "series"
  },
  {
   "name": "9 atoms",
   "note": "same bar primitive · differ by orientation/source",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "AreaChart",
   "note": "canonical",
   "kind": "canonical",
   "seam": "fields"
  },
  {
   "name": "TrendChart",
   "note": "3-series",
   "kind": "signature",
   "seam": "series"
  },
  {
   "name": "StepAreaChart",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "7 atoms",
   "note": "same path primitive · differ by fill/series",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "DonutChart",
   "note": "canonical",
   "kind": "canonical",
   "seam": "fields"
  },
  {
   "name": "PieChart",
   "note": "3-series",
   "kind": "signature",
   "seam": "series"
  },
  {
   "name": "RadialGauge",
   "note": "sweep",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "ProgressRing",
   "note": "nested",
   "kind": "signature",
   "seam": "series"
  },
  {
   "name": "5 atoms",
   "note": "same arc primitive · differ by sweep/nesting",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "LineSpark",
   "note": "inline rows",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "WaveformBars",
   "note": "spark",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "SparkArea",
   "note": "trend",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "HeatGrid",
   "note": "12×5 · accent scale",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "IntensityStrip",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "LinearProgress",
   "note": "stack",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "SegmentedMeter",
   "note": "steps",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "6 atoms",
   "note": "same track primitive · differ by fill mode",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "ChartLegend",
   "note": "series key",
   "kind": "signature",
   "seam": "series"
  },
  {
   "name": "LegendRow",
   "note": "inline swatches",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "StatBlock",
   "note": "viz KPI",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "Bar",
   "kind": "inherit"
  },
  {
   "name": "GanttBar",
   "kind": "inherit"
  },
  {
   "name": "CreditBar",
   "kind": "inherit"
  },
  {
   "name": "ManagerDashboardCreditBar",
   "kind": "inherit"
  },
  {
   "name": "AiBar",
   "kind": "inherit"
  },
  {
   "name": "IntelBar",
   "kind": "inherit"
  },
  {
   "name": "Timeline",
   "kind": "inherit"
  },
  {
   "name": "OrderTimeline",
   "kind": "inherit"
  },
  {
   "name": "DecisionLine",
   "kind": "inherit"
  },
  {
   "name": "PipelineRow",
   "kind": "inherit"
  },
  {
   "name": "RadarChart",
   "kind": "inherit"
  },
  {
   "name": "StoryRing",
   "kind": "inherit"
  },
  {
   "name": "ProgressStatRow",
   "kind": "inherit"
  }
 ]
};
