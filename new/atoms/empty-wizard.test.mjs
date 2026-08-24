import * as m from './empty-wizard.mjs';
const SNAP = {"EMPTY_WIZARD":"{\"industry\":\"\",\"size\":\"\",\"needs\":[],\"orgName\":\"\",\"contactName\":\"\",\"phone\":\"\",\"email\":\"\",\"password\":\"\",\"password2\":\"\"}"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ empty-wizard: צילום-ערך תואם — ירוק');
