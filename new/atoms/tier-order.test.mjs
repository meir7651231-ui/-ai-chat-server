import * as m from './tier-order.mjs';
const SNAP = {"TIER_ORDER":"[\"זהב\",\"כסף\",\"ארד\",\"רדומה\"]"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ tier-order: צילום-ערך תואם — ירוק');
