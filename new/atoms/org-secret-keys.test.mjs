import * as m from './org-secret-keys.mjs';
const SNAP = {"ORG_SECRET_KEYS":"[\"yemotToken\",\"nedarimMosad\",\"nedarimApiPass\",\"smsApiKey\",\"smtpUrl\",\"solaXKey\"]"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ org-secret-keys: צילום-ערך תואם — ירוק');
