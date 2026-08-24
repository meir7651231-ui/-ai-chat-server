import * as m from './guide-foot.mjs';
const SNAP = {"GUIDE_FOOT":"\"המדריך המלא והמפורט נמצא בקובץ \\\"מדריך למשתמש\\\" — מסך-מסך וכפתור-כפתור.\""};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ guide-foot: צילום-ערך תואם — ירוק');
