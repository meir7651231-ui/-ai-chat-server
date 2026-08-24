import { genJoinCode } from './gen-join-code.mjs';
const CASES = [[["\"\""],"\"pftntzvf\""],[["\"אבג\""],"\"45c0fya5\""],[["\"כהן לוי\""],"\"hwy4rhnw\""],[["\"abc\""],"\"zagia75b\""],[["\"a@b.com\""],"\"p06g521w\""],[["\"2026-08-24\""],"\"zihyvk16\""],[["\"2026-08-24T12:00:00\""],"\"av8lpigv\""],[["\"0501234567\""],"\"y5uk536u\""],[["\"03-1234567\""],"\"92b8ex1g\""],[["\"https://x.co\""],"\"alhc6c1h\""],[["\"שלום עולם\""],"\"sur1sf1z\""],[["\"12\""],"\"yikua84j\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(genJoinCode(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ gen-join-code: ' + CASES.length + ' הקלטות-Golden — ירוק');
