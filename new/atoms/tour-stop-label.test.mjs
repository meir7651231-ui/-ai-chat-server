import * as m from './tour-stop-label.mjs';
const SNAP = {"TOUR_STOP_LABEL":"\"■ עצירת הדמיה (Esc)\""};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ tour-stop-label: צילום-ערך תואם — ירוק');
