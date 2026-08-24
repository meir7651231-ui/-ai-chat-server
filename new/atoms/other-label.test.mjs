import { OTHER_LABEL } from './other-label.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(OTHER_LABEL === 'אחר — הקלדה חופשית…', 'הנוסח ' + JSON.stringify(OTHER_LABEL) + ' ≠ המקור');
ok(typeof OTHER_LABEL === 'string', 'לא מחרוזת');
ok(OTHER_LABEL.length > 0, 'מחרוזת ריקה');
ok(OTHER_LABEL.includes('…') && OTHER_LABEL.includes('—'), 'חסרים … או — מהנוסח המקורי');
if (f) process.exit(1);
console.log('✓ other-label: 4 דוגמאות-חוזה — ירוק');
