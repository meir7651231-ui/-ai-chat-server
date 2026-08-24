import { visibleSupportersForDesignations } from './visible-supporters-for-designations.mjs';
const CASES = [[["\"\"","\"\""],"\"\""],[["\"\"","0"],"\"\""],[["\"\"","1"],"\"\""],[["\"אבג\"","\"\""],"\"אבג\""],[["\"אבג\"","0"],"\"אבג\""],[["\"אבג\"","1"],"\"אבג\""],[["\"כהן לוי\"","\"\""],"\"כהן לוי\""],[["\"כהן לוי\"","0"],"\"כהן לוי\""],[["\"כהן לוי\"","1"],"\"כהן לוי\""],[["\"abc\"","\"\""],"\"abc\""],[["\"abc\"","0"],"\"abc\""],[["\"abc\"","1"],"\"abc\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(visibleSupportersForDesignations(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ visible-supporters-for-designations: ' + CASES.length + ' הקלטות-Golden — ירוק');
