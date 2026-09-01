/** אטום-דאטה · media-shelf — פירוק משפחת-Pure "media" לאטומי-תצוגה רשומים (שכבת-הפירוק).
 *  כל אטום = { name, kind(canonical|signature|inherit), seam }. דאטה-ליטרלית טהורה, אפס-import
 *  (חוק-האטום): הזהות/המראה מוזרקים בקופסה דרך pure-look/pure-resolve, לא כאן. מחולל ע"י
 *  machtzev/pure/pure-decompose.mjs ממקור-האמת machtzev/pure/media-family.html (אל תערוך ידנית — regen). */
export const PURE_MEDIA_SHELF = {
 "family": "media",
 "source": "machtzev/pure/media-family.html",
 "count": 30,
 "atoms": [
  {
   "name": "Avatar",
   "note": "square-rounded xs→l",
   "kind": "signature",
   "seam": "series"
  },
  {
   "name": "AvatarStatus",
   "note": "online / busy / offline",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "AvatarRing",
   "note": "accent halo",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "ProfileAvatar",
   "note": "square + status",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "AvatarStack",
   "note": "+N",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "AvatarGroup",
   "note": "4-up",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "FacePileGroup",
   "note": "square",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "StoryRing",
   "note": "unseen",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "StoryReel",
   "note": "row",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "Thumbnail",
   "note": "canonical",
   "kind": "canonical",
   "seam": "fields"
  },
  {
   "name": "ImageTile",
   "note": "16:9",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "ProofThumb",
   "note": "verified",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "MediaThumb",
   "note": "play",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "ThumbStrip",
   "note": "selected morphs",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "ImageFacePager",
   "note": "middle selected",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "CoverBanner",
   "note": "canonical",
   "kind": "canonical",
   "seam": "fields"
  },
  {
   "name": "ProfileCover",
   "note": "avatar overlay",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "HeroCoverMark",
   "note": "centered",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "LogoMark",
   "note": "solid",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "BrandMark",
   "note": "glyphs",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "GalleryGrid",
   "note": "2×2 + all",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "GalleryMosaic",
   "note": "feature + grid",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "GalleryAllBtn",
   "note": "3-up row",
   "kind": "signature",
   "seam": "collection"
  },
  {
   "name": "ThumbPlaceholder",
   "note": "broken",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "MediaPlaceholder",
   "note": "empty",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "AvatarFallback",
   "note": "initial only",
   "kind": "signature",
   "seam": "fields"
  },
  {
   "name": "12 atoms",
   "note": "same identity primitive · differ by source / shape",
   "kind": "signature",
   "seam": "series"
  },
  {
   "name": "UserAvatar",
   "kind": "inherit"
  },
  {
   "name": "GalleryThumb",
   "kind": "inherit"
  },
  {
   "name": "FacePile",
   "kind": "inherit"
  }
 ]
};
