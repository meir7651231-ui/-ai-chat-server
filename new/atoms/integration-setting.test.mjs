import { integrationSetting } from './integration-setting.mjs';
const C = [
  [{ integrations: { payments: { payUrl: '  https://pay.example  ' } } }, 'payments', 'payUrl', 'https://pay.example'],
  [{}, 'payments', 'payUrl', ''],
  [{ integrations: { payments: {} } }, 'payments', 'payUrl', ''],
  [{ integrations: { payments: { payUrl: 42 } } }, 'payments', 'payUrl', ''],
  [{ integrations: { whatsapp: { enabled: true } } }, 'whatsapp', 'enabled', ''],
  [{ integrations: { campaign: { url: '   ' } } }, 'campaign', 'url', ''],
];
let f = 0;
for (const [cfg, key, field, w] of C) {
  const g = integrationSetting(cfg, key, field);
  if (g !== w) { console.error(`✗ ${JSON.stringify(cfg)} · ${key}.${field} ⇒ ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ integration-setting: 6 דוגמאות-חוזה — ירוק (מחרוזת-trim בלבד, אחרת ריק)');
