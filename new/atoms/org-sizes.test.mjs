import * as m from './org-sizes.mjs';
const SNAP = {"ORG_SIZES":"[{\"id\":\"small\",\"label\":\"קטן\",\"sub\":\"עד 5 אנשי צוות\"},{\"id\":\"medium\",\"label\":\"בינוני\",\"sub\":\"5–20 אנשי צוות\"},{\"id\":\"large\",\"label\":\"גדול\",\"sub\":\"20+ אנשי צוות\"}]"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ org-sizes: צילום-ערך תואם — ירוק');
