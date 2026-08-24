import { filterVolunteers } from './filter-volunteers.mjs';
const CASES = [[["\"\"","\"\""],"\"\""],[["\"אבג\"","\"\""],"\"אבג\""],[["\"כהן לוי\"","\"\""],"\"כהן לוי\""],[["\"abc\"","\"\""],"\"abc\""],[["\"a@b.com\"","\"\""],"\"a@b.com\""],[["\"2026-08-24\"","\"\""],"\"2026-08-24\""],[["\"2026-08-24T12:00:00\"","\"\""],"\"2026-08-24T12:00:00\""],[["\"0501234567\"","\"\""],"\"0501234567\""],[["\"03-1234567\"","\"\""],"\"03-1234567\""],[["\"https://x.co\"","\"\""],"\"https://x.co\""],[["\"שלום עולם\"","\"\""],"\"שלום עולם\""],[["\"12\"","\"\""],"\"12\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(filterVolunteers(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
// שקע smartFilter (חוק-3) — מוכיח שהמסלול הלא-ריק אינו קורס (getTerms=[name,phone,area]).
// stub-שקע מסנן לפי getTerms; 'לוי' תופס רק את השורה השנייה (שם-מתנדב).
const vols = [{ name: 'כהן', phone: '050', area: 'צפון' }, { name: 'לוי', phone: '052', area: 'דרום' }];
const stubFilter = (q, items, getTerms) => items.filter((it) => getTerms(it).some((t) => t.includes(q)));
const gotSock = JSON.stringify(filterVolunteers(vols, 'לוי', stubFilter));
const wantSock = JSON.stringify([vols[1]]);
if (gotSock !== wantSock) { console.error('✗ socket/smartFilter ⇒ ' + gotSock + ' ≠ ' + wantSock); f = 1; }
if (f) process.exit(1); console.log('✓ filter-volunteers: ' + CASES.length + ' הקלטות-Golden + שקע-smartFilter — ירוק');
