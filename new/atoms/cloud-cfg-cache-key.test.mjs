import { cloudCfgCacheKey } from './cloud-cfg-cache-key.mjs';
const CASES = [[["\"\""],"\"maor_cloudcfg:\""],[["\"אבג\""],"\"maor_cloudcfg:אבג\""],[["\"כהן לוי\""],"\"maor_cloudcfg:כהן לוי\""],[["\"abc\""],"\"maor_cloudcfg:abc\""],[["\"a@b.com\""],"\"maor_cloudcfg:a@b.com\""],[["\"2026-08-24\""],"\"maor_cloudcfg:2026-08-24\""],[["\"2026-08-24T12:00:00\""],"\"maor_cloudcfg:2026-08-24T12:00:00\""],[["\"0501234567\""],"\"maor_cloudcfg:0501234567\""],[["\"03-1234567\""],"\"maor_cloudcfg:03-1234567\""],[["\"https://x.co\""],"\"maor_cloudcfg:https://x.co\""],[["\"שלום עולם\""],"\"maor_cloudcfg:שלום עולם\""],[["\"12\""],"\"maor_cloudcfg:12\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(cloudCfgCacheKey(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ cloud-cfg-cache-key: ' + CASES.length + ' הקלטות-Golden — ירוק');
