import * as __ns_m from './guide-foot.mjs';
// מרחב-שמות-מורכב (מנוע-הקשיחים): המקור + ערכי-המפעל — ה-API החיצוני זהה
const __d_guide_foot_T = {
  k1: "המדריך המלא והמפורט נמצא בקובץ \"מדריך למשתמש\" — מסך-מסך וכפתור-כפתור.",
};
const m = { ...__ns_m, GUIDE_FOOT: __ns_m.makeGUIDE_FOOT(__d_guide_foot_T) };
const SNAP = {"GUIDE_FOOT":"\"המדריך המלא והמפורט נמצא בקובץ \\\"מדריך למשתמש\\\" — מסך-מסך וכפתור-כפתור.\""};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ guide-foot: צילום-ערך תואם — ירוק');
