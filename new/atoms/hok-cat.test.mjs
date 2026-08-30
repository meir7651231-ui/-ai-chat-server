import * as __ns_m from './hok-cat.mjs';
// מרחב-שמות-מורכב (מנוע-הקשיחים): המקור + ערכי-המפעל — ה-API החיצוני זהה
const __d_hok_cat_T = {
  k1: "הו\"ק",
  k2: 12,
};
const m = { ...__ns_m, HOK_CAT: __ns_m.makeHOK_CAT(__d_hok_cat_T) };
const SNAP = {"HOK_CAT":"\"הו\\\"ק\""};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ hok-cat: צילום-ערך תואם — ירוק');
