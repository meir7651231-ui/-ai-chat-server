import * as __ns_m from './coral-palette.mjs';
// מרחב-שמות-מורכב (מנוע-הקשיחים): המקור + ערכי-המפעל — ה-API החיצוני זהה
const __d_coral_palette_T = {
  k1: "#FFFCFA",
  k2: "#FBF1EF",
  k3: "#FFF3F0",
  k4: 255,
  k5: 60,
  k6: 360,
  k7: 120,
  k8: 180,
  k9: 240,
  k10: 300,
};
const m = { ...__ns_m, CORAL_PALETTE: __ns_m.makeCORAL_PALETTE(__d_coral_palette_T) };
const SNAP = {"CORAL_PALETTE":"{\"c1\":\"#EC9C9C\",\"c2\":\"#D97F7F\",\"c3\":\"#B95F5F\",\"word\":\"#E29392\",\"ink\":\"#33272A\",\"paper\":\"#FFFCFA\",\"cream\":\"#FBF1EF\",\"blush\":\"#FFF3F0\",\"marquee\":\"#F9E4E1\",\"rgb1\":\"236,156,156\",\"rgb2\":\"217,127,127\",\"inkRgb\":\"51,39,42\"}"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ coral-palette: צילום-ערך תואם — ירוק');
