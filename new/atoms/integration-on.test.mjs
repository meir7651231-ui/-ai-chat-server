import { integrationOn } from './integration-on.mjs';
const C = [
  [{ integrations: { whatsapp: { enabled: true } } }, 'whatsapp', true],
  [{ integrations: { whatsapp: { enabled: false } } }, 'whatsapp', false],
  [{}, 'maps', false],
  [{ integrations: { maps: {} } }, 'maps', false],
  [{ integrations: { ai: { enabled: 'true' } } }, 'ai', false],
  [{ integrations: { gcal: { enabled: true } } }, 'maps', false],
];
let f = 0;
for (const [cfg, key, w] of C) {
  const g = integrationOn(cfg, key);
  if (g !== w) { console.error(`✗ ${JSON.stringify(cfg)} · ${key} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ integration-on: 6 דוגמאות-חוזה — ירוק (opt-in: חסר=כבוי, רק true בוליאני מדליק)');
