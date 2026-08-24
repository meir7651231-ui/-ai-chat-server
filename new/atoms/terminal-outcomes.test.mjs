import * as m from './terminal-outcomes.mjs';
const SNAP = {"TERMINAL_OUTCOMES":"[\"donated\",\"refused\",\"callback\",\"done\"]"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ terminal-outcomes: צילום-ערך תואם — ירוק');
