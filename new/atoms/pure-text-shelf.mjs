/** אטום-דאטה · text-shelf — פירוק משפחת-Pure "text" לאטומי-תצוגה רשומים (שכבת-הפירוק).
 *  כל אטום = { name, kind(canonical|signature|inherit), seam }. דאטה-ליטרלית טהורה, אפס-import
 *  (חוק-האטום): הזהות/המראה מוזרקים בקופסה דרך pure-look/pure-resolve, לא כאן. מחולל ע"י
 *  machtzev/pure/pure-decompose.mjs ממקור-האמת machtzev/pure/text-family.html (אל תערוך ידנית — regen). */
export const PURE_TEXT_SHELF = {
 "family": "text",
 "source": "machtzev/pure/text-family.html",
 "count": 20,
 "atoms": [
  {
   "name": "TypeScale",
   "note": "modular ramp",
   "kind": "signature",
   "seam": "series"
  },
  {
   "name": "VoicePair",
   "note": "serif duet",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "PullQuote",
   "note": "accent rule",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "CodeBlock",
   "note": "mono",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "LinkRow",
   "note": "PipeLink",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "BulletList",
   "note": "accent dot",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "NumberedList",
   "note": "marker",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "GradientText",
   "note": "clip + shimmer",
   "kind": "signature",
   "seam": "series"
  },
  {
   "name": "Marquee",
   "note": "live · reduced-motion halts",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "Overline",
   "note": "tick",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "Eyebrow",
   "note": "accent dot",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "SectionLabel",
   "note": "",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "7 atoms",
   "note": "same grotesk label · differ by source",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "EmphasisText",
   "note": "three-tone",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "TruncOne",
   "note": "ellipsis",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "TruncClamp",
   "note": "2 lines",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "SectionTitle",
   "kind": "inherit"
  },
  {
   "name": "CaSubTitle",
   "kind": "inherit"
  },
  {
   "name": "FieldLabel",
   "kind": "inherit"
  },
  {
   "name": "EmojiSectionTitle",
   "kind": "inherit"
  }
 ]
};
