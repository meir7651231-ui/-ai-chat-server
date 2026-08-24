import * as m from './manual-driver.mjs';
const SNAP = {"manualDriver":"{\"id\":\"manual\",\"label\":\"חיוג בלחיצה (טלפון קיים)\",\"capabilities\":{\"autoDial\":false,\"record\":false,\"screenPop\":true}}"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ manual-driver: צילום-ערך תואם — ירוק');
