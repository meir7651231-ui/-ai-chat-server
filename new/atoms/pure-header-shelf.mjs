/** אטום-דאטה · header-shelf — פירוק משפחת-Pure "header" לאטומי-תצוגה רשומים (שכבת-הפירוק).
 *  כל אטום = { name, kind(canonical|signature|inherit), seam }. דאטה-ליטרלית טהורה, אפס-import
 *  (חוק-האטום): הזהות/המראה מוזרקים בקופסה דרך pure-look/pure-resolve, לא כאן. מחולל ע"י
 *  machtzev/pure/pure-decompose.mjs ממקור-האמת machtzev/pure/header-family.html (אל תערוך ידנית — regen). */
export const PURE_HEADER_SHELF = {
 "family": "header",
 "source": "machtzev/pure/header-family.html",
 "count": 33,
 "atoms": [
  {
   "name": "PageHeader",
   "note": "canonical",
   "kind": "canonical",
   "seam": "title+actions"
  },
  {
   "name": "DetailHeader",
   "note": "back + eyebrow",
   "kind": "signature",
   "seam": "title+actions"
  },
  {
   "name": "CenteredPageHeader",
   "note": "",
   "kind": "signature",
   "seam": "title"
  },
  {
   "name": "TitledSection",
   "note": "stacked",
   "kind": "signature",
   "seam": "title+actions"
  },
  {
   "name": "SectionHeader",
   "note": "canonical",
   "kind": "canonical",
   "seam": "title+link"
  },
  {
   "name": "SectionTitle",
   "note": "subtitle",
   "kind": "signature",
   "seam": "title+link"
  },
  {
   "name": "EmojiSectionTitle",
   "note": "count",
   "kind": "signature",
   "seam": "title"
  },
  {
   "name": "LensGroupHeader",
   "note": "",
   "kind": "signature",
   "seam": "title+link"
  },
  {
   "name": "6 atoms",
   "note": "same title+trailing pattern · differ by lead-in",
   "kind": "signature",
   "seam": "title+link"
  },
  {
   "name": "StickyHeader",
   "note": "pinned in short stage",
   "kind": "signature",
   "seam": "sticky"
  },
  {
   "name": "HeroHeader",
   "note": "aura · canonical",
   "kind": "canonical",
   "seam": "title+cta"
  },
  {
   "name": "GradientHeroCard",
   "note": "full-bleed",
   "kind": "signature",
   "seam": "title+cta"
  },
  {
   "name": "SmartProjectHero",
   "note": "with status",
   "kind": "signature",
   "seam": "title"
  },
  {
   "name": "BrandHeader",
   "note": "canonical",
   "kind": "canonical",
   "seam": "mark+nav"
  },
  {
   "name": "BrandListRow",
   "note": "compact",
   "kind": "signature",
   "seam": "mark"
  },
  {
   "name": "StoreSupplierHeader",
   "note": "generic",
   "kind": "signature",
   "seam": "mark"
  },
  {
   "name": "WizardHeader",
   "note": "canonical",
   "kind": "canonical",
   "seam": "progress"
  },
  {
   "name": "StepProgressHeader",
   "note": "",
   "kind": "signature",
   "seam": "progress"
  },
  {
   "name": "SheetHeader",
   "note": "grabber + close",
   "kind": "signature",
   "seam": "title"
  },
  {
   "name": "ModalHeader",
   "note": "nav bar",
   "kind": "signature",
   "seam": "title"
  },
  {
   "name": "ProfileHeaderRow",
   "note": "canonical",
   "kind": "canonical",
   "seam": "avatar+meta"
  },
  {
   "name": "ProfileCard",
   "note": "centered",
   "kind": "signature",
   "seam": "avatar+meta"
  },
  {
   "name": "ProfileRow",
   "note": "compact",
   "kind": "signature",
   "seam": "avatar"
  },
  {
   "name": "DateHeader",
   "note": "list divider · canonical",
   "kind": "canonical",
   "seam": "divider"
  },
  {
   "name": "DateChip",
   "note": "block",
   "kind": "signature",
   "seam": "date"
  },
  {
   "name": "DatePills",
   "note": "range select",
   "kind": "signature",
   "seam": "date"
  },
  {
   "name": "DsDateField",
   "note": "label + jump",
   "kind": "signature",
   "seam": "divider"
  },
  {
   "name": "CaSubTitle",
   "kind": "inherit"
  },
  {
   "name": "SettingsSectionHead",
   "kind": "inherit"
  },
  {
   "name": "WorkerProfileStat",
   "kind": "inherit"
  },
  {
   "name": "SupplierHeader",
   "kind": "inherit"
  },
  {
   "name": "ContactHeader",
   "kind": "inherit"
  },
  {
   "name": "MemberHeader",
   "kind": "inherit"
  }
 ]
};
