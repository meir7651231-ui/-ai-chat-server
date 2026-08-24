import { hasPublicSite } from './has-public-site.mjs';
const C = [
  [{ site: { title: 'מאור' } }, true, 'enabled חסר = פעיל'],
  [{ site: { enabled: true } }, true, 'enabled מפורש'],
  [{ site: { enabled: false } }, false, 'כיבוי מפורש'],
  [{}, false, 'אין site'],
  [{ site: null }, false, 'site=null'],
  [{ site: { enabled: 0 } }, true, 'רק false ממש מכבה'],
];
let f = 0;
for (const [cfg, want, why] of C) {
  const got = hasPublicSite(cfg);
  if (got !== want) { console.error(`✗ ${why}: ${JSON.stringify(cfg)} ⇒ ${got} ≠ ${want}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ has-public-site: 6 דוגמאות-חוזה — ירוק');
