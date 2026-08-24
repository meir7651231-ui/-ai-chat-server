import * as m from './tz-score-rules.mjs';
const SNAP = {"TZ_SCORE_RULES":"{\"emptyPts\":10,\"ilsPerPoint\":50,\"streakDays\":60,\"streakPts\":5}"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ tz-score-rules: צילום-ערך תואם — ירוק');
