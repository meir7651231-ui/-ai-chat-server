import * as __ns_m from './grantable-staff-features.mjs';
// מרחב-שמות-מורכב (מנוע-הקשיחים): המקור + ערכי-המפעל — ה-API החיצוני זהה
const __d_grantable_staff_features_T = {
  k1: "supporters.bulkselect",
  k2: "supporters.bulkdelete",
  k3: "supporters.purpose",
  k4: "supporters.delete",
  k5: "families.delete",
  k6: "courses.delete",
  k7: "courses.bulkadmin",
  k8: "settings.teachers.delete",
  k9: "shop.delete",
  k10: "tzedaka.delete",
};
const m = { ...__ns_m, GRANTABLE_STAFF_FEATURES: __ns_m.makeGRANTABLE_STAFF_FEATURES(__d_grantable_staff_features_T) };
const SNAP = {"GRANTABLE_STAFF_FEATURES":"{}"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ grantable-staff-features: צילום-ערך תואם — ירוק');
