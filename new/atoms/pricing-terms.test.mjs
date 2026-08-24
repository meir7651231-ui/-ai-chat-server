import * as m from './pricing-terms.mjs';
const SNAP = {"PRICING_TERMS":"[{\"v\":\"once\",\"t\":\"חד-פעמי\"},{\"v\":\"weekly\",\"t\":\"שבועי\"},{\"v\":\"biweekly\",\"t\":\"דו-שבועי\"},{\"v\":\"monthly\",\"t\":\"חודשי\"},{\"v\":\"months\",\"t\":\"מספר חודשים\"},{\"v\":\"half_year\",\"t\":\"חצי-שנתי\"},{\"v\":\"year\",\"t\":\"שנתי\"}]"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ pricing-terms: צילום-ערך תואם — ירוק');
