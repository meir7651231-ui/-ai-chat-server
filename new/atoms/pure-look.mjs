/** אטום-דאטה · pure-look — שפת-Pure כתכנית role→pigment (שכבה A · הכרעה 19: מראה=דאטה).
 *  מבנה: neutral (סולם, לא-מורף) · semantic (err/warn/gold — קבוע) · themes (סט-אקצנט מורף פר-ערכה) · fonts (משפחות קבועות — לא מורף).
 *  G28 (הכרעה-28): on-a/hi/shade = ליטרלים שהיו צרובים ב-15 משפחות-Pure (דיו-על-אקצנט · הבהקה · בסיס-צל) — עכשיו טוקנים, ערכי-הכהה = הליטרלים (ביט-זהה);
 *  skins.paper = עור-הנייר של «בלגן» (לבן · #37352F · קו 8% · צל-שקוף) · themes.t-balagan = כחול-יחיד בלי גרדיאנט/זוהר · fontSets.heebo = גופן-אחד.
 *  ערכים ליטרליים בלבד, אפס var(), אפס-import (חוק-1). הזהות מוזרקת בקופסה, לא באטום (חוק-5/6).
 *  מקור: machtzev/pure/action-family.html:11-15 (טוקני-Pure מאומתים-בעין). חוזה: pure-look.contract.md */
export const PURE_LOOK = {
 "defaultTheme": "t-indigo",
 "neutral": {
  "--canvas": "#0C0C0E",
  "--sunken": "#0A0A0C",
  "--surface": "#151517",
  "--raised": "#1B1B1E",
  "--raised2": "#212126",
  "--ink": "#ECE9E2",
  "--mut": "#9B968C",
  "--faint": "#6E6A62",
  "--hair": "rgba(236, 233, 226, 0.09)",
  "--hair2": "rgba(236, 233, 226, 0.05)",
  "--on-a": "#0B0B0D",
  "--hi": "#FFFFFF",
  "--shade": "#000000"
 },
 "semantic": {
  "--ok": "#43D08C",
  "--warn": "#E6B84F",
  "--err": "#E0574E",
  "--gold": "#E6C766"
 },
 "themes": {
  "t-indigo": {
   "--a-hi": "#B0A4FF",
   "--a": "#7A6BF0",
   "--a-800": "#4B3ECB",
   "--gl": "rgba(122, 107, 240, 0.42)",
   "--c2": "#4CC6E6",
   "--c3": "#B57BE6"
  },
  "t-teal": {
   "--a-hi": "#6FE6D5",
   "--a": "#1FB8A6",
   "--a-800": "#0C7E72",
   "--gl": "rgba(31, 184, 166, 0.42)",
   "--c2": "#4FB6E6",
   "--c3": "#43D08C"
  },
  "t-amber": {
   "--a-hi": "#F2C87E",
   "--a": "#D99A3C",
   "--a-800": "#9E6B1E",
   "--gl": "rgba(217, 154, 60, 0.42)",
   "--c2": "#E8863C",
   "--c3": "#E67BA6"
  },
  "t-balagan": {
   "--a-hi": "#2F6FED",
   "--a": "#2F6FED",
   "--a-800": "#1E4FB8",
   "--gl": "rgba(47, 111, 237, 0)",
   "--c2": "#2F6FED",
   "--c3": "#2F6FED"
  }
 },
 "skins": {
  "paper": {
   "--canvas": "#FFFFFF",
   "--sunken": "#F7F6F3",
   "--surface": "#FFFFFF",
   "--raised": "#F7F6F3",
   "--raised2": "#EFEDE8",
   "--ink": "#37352F",
   "--mut": "rgba(55, 53, 47, 0.6)",
   "--faint": "rgba(55, 53, 47, 0.4)",
   "--hair": "rgba(0, 0, 0, 0.08)",
   "--hair2": "rgba(0, 0, 0, 0.05)",
   "--on-a": "#FFFFFF",
   "--hi": "#FFFFFF",
   "--shade": "rgba(0, 0, 0, 0)",
   "--ok": "#1B8A4C",
   "--warn": "#C98A00",
   "--err": "#C8321E",
   "--gold": "#C98A00"
  }
 },
 "fontSets": {
  "heebo": {
   "serif": "Heebo",
   "serifHe": "Heebo",
   "grotesk": "Heebo",
   "he": "Heebo"
  }
 },
 "fonts": {
  "serif": "Fraunces",
  "serifHe": "Frank Ruhl Libre",
  "grotesk": "Space Grotesk",
  "he": "Heebo"
 }
};
