import { supTier as __pure_supTier } from './sup-tier.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_supTier_SUP_TIER_T = {
  k1: "זהב",
  k2: "#fdf3dd",
  k3: "כסף",
  k4: "#eef1f5",
  k5: "ארד",
  k6: "#f6ead1",
  k7: "רדומה",
  k8: "#eceae2",
  k9: 800,
  k10: 600,
  k11: 400,
};
const supTier = (...a) => __pure_supTier(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_supTier_SUP_TIER_T);
const CASES = [[["\"\""],"{\"label\":\"רדומה\",\"bg\":\"#eceae2\",\"c\":\"#8b8474\",\"dot\":\"#a8a29e\"}"],[["\"אבג\""],"{\"label\":\"רדומה\",\"bg\":\"#eceae2\",\"c\":\"#8b8474\",\"dot\":\"#a8a29e\"}"],[["\"כהן לוי\""],"{\"label\":\"רדומה\",\"bg\":\"#eceae2\",\"c\":\"#8b8474\",\"dot\":\"#a8a29e\"}"],[["\"abc\""],"{\"label\":\"רדומה\",\"bg\":\"#eceae2\",\"c\":\"#8b8474\",\"dot\":\"#a8a29e\"}"],[["\"a@b.com\""],"{\"label\":\"רדומה\",\"bg\":\"#eceae2\",\"c\":\"#8b8474\",\"dot\":\"#a8a29e\"}"],[["\"2026-08-24\""],"{\"label\":\"רדומה\",\"bg\":\"#eceae2\",\"c\":\"#8b8474\",\"dot\":\"#a8a29e\"}"],[["\"2026-08-24T12:00:00\""],"{\"label\":\"רדומה\",\"bg\":\"#eceae2\",\"c\":\"#8b8474\",\"dot\":\"#a8a29e\"}"],[["\"0501234567\""],"{\"label\":\"זהב\",\"bg\":\"#fdf3dd\",\"c\":\"#9a6414\",\"dot\":\"#f3c76b\"}"],[["\"03-1234567\""],"{\"label\":\"רדומה\",\"bg\":\"#eceae2\",\"c\":\"#8b8474\",\"dot\":\"#a8a29e\"}"],[["\"https://x.co\""],"{\"label\":\"רדומה\",\"bg\":\"#eceae2\",\"c\":\"#8b8474\",\"dot\":\"#a8a29e\"}"],[["\"שלום עולם\""],"{\"label\":\"רדומה\",\"bg\":\"#eceae2\",\"c\":\"#8b8474\",\"dot\":\"#a8a29e\"}"],[["\"12\""],"{\"label\":\"רדומה\",\"bg\":\"#eceae2\",\"c\":\"#8b8474\",\"dot\":\"#a8a29e\"}"]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(supTier(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ sup-tier: ' + CASES.length + ' הקלטות-Golden — ירוק');
