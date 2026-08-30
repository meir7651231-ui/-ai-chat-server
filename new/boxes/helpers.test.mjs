import * as m from './helpers.mjs';
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
const FN = {"fmtDate":[[["\"123456782\""],"\"123456782\""],[["\"\""],"\"—\""],[["\"אבג\""],"\"אבג\""],[["\"כהן לוי\""],"\"כהן לוי\""],[["\"abc\""],"\"abc\""],[["\"a@b.com\""],"\"a@b.com\""],[["\"2026-08-24\""],"\"24/08/2026\""],[["\"0501234567\""],"\"0501234567\""],[["\"https://x.co\""],"\"https://x.co\""],[["\"12\""],"\"12\""]],"fmtDateTime":[[["\"123456782\""],"\"123456782\""],[["\"\""],"\"—\""],[["\"אבג\""],"\"אבג\""],[["\"כהן לוי\""],"\"כהן לוי\""],[["\"abc\""],"\"abc\""],[["\"a@b.com\""],"\"a@b.com\""],[["\"2026-08-24\""],"\"24/08/2026\""],[["\"0501234567\""],"\"0501234567\""],[["\"https://x.co\""],"\"https://x.co\""],[["\"12\""],"\"12\""]]};
let f = 0;
for (const [n, cs] of Object.entries(FN)) for (const [args, want] of cs) { const got = JSON.stringify(m[n](...args.map(de))); if (got !== want) { console.error('✗ ' + n + '(' + args + ') ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ helpers: ' + Object.values(FN).flat().length + ' golden — ירוק');
