import { coursesOfTeacher } from './courses-of-teacher.mjs';
const CASES = [[["\"\"","\"\""],"\"\""],[["\"\"","0"],"\"\""],[["\"אבג\"","\"\""],"\"אבג\""],[["\"אבג\"","0"],"\"אבג\""],[["\"כהן לוי\"","\"\""],"\"כהן לוי\""],[["\"כהן לוי\"","0"],"\"כהן לוי\""],[["\"abc\"","\"\""],"\"abc\""],[["\"abc\"","0"],"\"abc\""],[["\"a@b.com\"","\"\""],"\"a@b.com\""],[["\"a@b.com\"","0"],"\"a@b.com\""],[["\"2026-08-24\"","\"\""],"\"2026-08-24\""],[["\"2026-08-24\"","0"],"\"2026-08-24\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(coursesOfTeacher(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ courses-of-teacher: ' + CASES.length + ' הקלטות-Golden — ירוק');
