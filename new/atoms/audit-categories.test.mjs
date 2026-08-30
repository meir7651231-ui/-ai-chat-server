import * as __ns_m from './audit-categories.mjs';
// מרחב-שמות-מורכב (מנוע-הקשיחים): המקור + ערכי-המפעל — ה-API החיצוני זהה
const __d_audit_categories_T = {
  k1: "כפילות",
  k2: "ת\"ז",
  k3: "טלפון",
  k4: "אימייל",
  k5: "כתובת",
  k6: "לוגיקה",
  k7: "ילדים",
  k8: "קשר",
};
const m = { ...__ns_m, AUDIT_CATEGORIES: __ns_m.makeAUDIT_CATEGORIES(__d_audit_categories_T) };
const SNAP = {"AUDIT_CATEGORIES":"[\"כפילות\",\"ת\\\"ז\",\"טלפון\",\"אימייל\",\"כתובת\",\"לוגיקה\",\"ילדים\",\"קשר\"]"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ audit-categories: צילום-ערך תואם — ירוק');
