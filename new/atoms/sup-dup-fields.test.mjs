import * as __ns_m from './sup-dup-fields.mjs';
// מרחב-שמות-מורכב (מנוע-הקשיחים): המקור + ערכי-המפעל — ה-API החיצוני זהה
const __d_sup_dup_fields_T = {
  k1: "name",
  k2: "שם",
  k3: "phone",
  k4: "טלפון",
  k5: "email",
  k6: "אימייל",
  k7: "idNum",
  k8: "ת\"ז",
  k9: "city",
  k10: "עיר",
  k11: "address",
  k12: "כתובת",
  k13: "cat",
  k14: "קטגוריה",
  k15: "forWho",
  k16: "ייעוד",
  k17: "notes",
  k18: "הערות",
};
const m = { ...__ns_m, SUP_DUP_FIELDS: __ns_m.makeSUP_DUP_FIELDS(__d_sup_dup_fields_T) };
const SNAP = {"SUP_DUP_FIELDS":"[{\"key\":\"name\",\"label\":\"שם\"},{\"key\":\"phone\",\"label\":\"טלפון\"},{\"key\":\"email\",\"label\":\"אימייל\"},{\"key\":\"idNum\",\"label\":\"ת\\\"ז\"},{\"key\":\"city\",\"label\":\"עיר\"},{\"key\":\"address\",\"label\":\"כתובת\"},{\"key\":\"cat\",\"label\":\"קטגוריה\"},{\"key\":\"forWho\",\"label\":\"ייעוד\"},{\"key\":\"notes\",\"label\":\"הערות\"}]"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ sup-dup-fields: צילום-ערך תואם — ירוק');
