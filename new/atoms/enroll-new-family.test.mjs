import * as __ns_m from './enroll-new-family.mjs';
// מרחב-שמות-מורכב (מנוע-הקשיחים): המקור + ערכי-המפעל — ה-API החיצוני זהה
const __d_enroll_new_family_T = {
  k1: "__new",
  k2: "כ",
  k3: "מ",
  k4: "נ",
  k5: "פ",
  k6: "צ",
};
const m = { ...__ns_m, ENROLL_NEW_FAMILY: __ns_m.makeENROLL_NEW_FAMILY(__d_enroll_new_family_T) };
const SNAP = {"ENROLL_NEW_FAMILY":"\"__new\""};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ enroll-new-family: צילום-ערך תואם — ירוק');
