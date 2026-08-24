import { filterDeliveries } from './filter-deliveries.mjs';
const CASES = [[["\"\"","\"\""],"\"\""],[["\"אבג\"","\"\""],"\"אבג\""],[["\"כהן לוי\"","\"\""],"\"כהן לוי\""],[["\"abc\"","\"\""],"\"abc\""],[["\"a@b.com\"","\"\""],"\"a@b.com\""],[["\"2026-08-24\"","\"\""],"\"2026-08-24\""],[["\"2026-08-24T12:00:00\"","\"\""],"\"2026-08-24T12:00:00\""],[["\"0501234567\"","\"\""],"\"0501234567\""],[["\"03-1234567\"","\"\""],"\"03-1234567\""],[["\"https://x.co\"","\"\""],"\"https://x.co\""],[["\"שלום עולם\"","\"\""],"\"שלום עולם\""],[["\"12\"","\"\""],"\"12\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(filterDeliveries(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
// שקע smartFilter (חוק-3) + statusLabel מוטמע (חוק-1) — מוכיח שהמסלול הלא-ריק אינו קורס.
// stub-שקע מסנן לפי getTerms (⇒ statusLabel המוטמע נקרא); pickup⇒'איסוף' תופס רק את השורה הראשונה.
const rows = [{ familyName: 'כהן', volunteerName: 'לוי', status: 'pickup' }, { familyName: 'לוי', volunteerName: 'דוד', status: 'delivered' }];
const stubFilter = (q, items, getTerms) => items.filter((it) => getTerms(it).some((t) => t.includes(q)));
const gotSock = JSON.stringify(filterDeliveries(rows, 'איסוף', stubFilter));
const wantSock = JSON.stringify([rows[0]]);
if (gotSock !== wantSock) { console.error('✗ socket/statusLabel ⇒ ' + gotSock + ' ≠ ' + wantSock); f = 1; }
if (f) process.exit(1); console.log('✓ filter-deliveries: ' + CASES.length + ' הקלטות-Golden + שקע-smartFilter — ירוק');
