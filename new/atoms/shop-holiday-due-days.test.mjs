import * as m from './shop-holiday-due-days.mjs';
const SNAP = {"SHOP_HOLIDAY_DUE_DAYS":"30"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ shop-holiday-due-days: צילום-ערך תואם — ירוק');
