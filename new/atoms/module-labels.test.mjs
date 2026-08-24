import * as m from './module-labels.mjs';
const SNAP = {"MODULE_LABELS":"{\"families\":\"משפחות\",\"courses\":\"חוגים\",\"calendar\":\"לוח שנה\",\"diary\":\"יומן חדרים\",\"supporters\":\"תורמים\",\"reports\":\"דוחות\",\"tzedaka\":\"קופות צדקה\",\"shop\":\"חנות\",\"shop7\":\"חלוקה\"}"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ module-labels: צילום-ערך תואם — ירוק');
