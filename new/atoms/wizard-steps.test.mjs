import { WIZARD_STEPS as W } from './wizard-steps.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(W === 5, 'הערך ' + W + ' ≠ 5');
ok(Number.isInteger(W), 'לא מספר-שלם');
ok(W > 0, 'לא חיובי');
if (f) process.exit(1);
console.log('✓ wizard-steps: 3 דוגמאות-חוזה — ירוק');
