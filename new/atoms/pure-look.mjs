/** אטום-דאטה · pure-look — שפת-Pure כתכנית role→pigment (שכבה A · הכרעה 19: מראה=דאטה).
 *  מבנה: neutral (סולם, לא-מורף) · semantic (err/warn/gold — קבוע) · themes (סט-אקצנט מורף פר-ערכה).
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
  "--hair2": "rgba(236, 233, 226, 0.05)"
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
  }
 }
};
