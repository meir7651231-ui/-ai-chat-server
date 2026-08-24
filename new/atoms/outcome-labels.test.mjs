import * as m from './outcome-labels.mjs';
const SNAP = {"OUTCOME_LABELS":"{\"donated\":\"תרם/ה\",\"noanswer\":\"לא ענה\",\"refused\":\"סירב/ה\",\"callback\":\"לחזור\",\"done\":\"טופל\",\"skip\":\"דילוג\"}"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ outcome-labels: צילום-ערך תואם — ירוק');
