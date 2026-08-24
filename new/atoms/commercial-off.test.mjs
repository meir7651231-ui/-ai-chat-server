import * as m from './commercial-off.mjs';
const SNAP = {"COMMERCIAL_OFF":"{\"core.taxreceipt\":false,\"families.cred\":false,\"home.goldbook\":false,\"home.impactwall\":false,\"home.community\":false,\"home.credmetrics\":false,\"shell.privacy\":false,\"supporters.hist\":false}"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ commercial-off: צילום-ערך תואם — ירוק');
