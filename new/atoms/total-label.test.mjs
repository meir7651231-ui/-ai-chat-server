import { totalLabel } from './total-label.mjs';
const supIls = (sp) => sp.ils;
const supUsd = (sp) => sp.usd;
const C = [
  [{ ils: 1200, usd: 300 }, '₪1,200 + $300'],
  [{ ils: 1200, usd: 0 }, '₪1,200'],
  [{ ils: 0, usd: 300 }, '$300'],
  [{ ils: 0, usd: 0 }, '—'],
  [{ ils: 1234567, usd: 0 }, '₪1,234,567'],
];
let f = 0;
for (const [sp, w] of C) { const g = totalLabel(sp, supIls, supUsd); if (g !== w) { console.error(`✗ totalLabel(${JSON.stringify(sp)}) = ${g} ≠ ${w}`); f = 1; } }
if (f) process.exit(1); console.log('✓ total-label: 5 דוגמאות-חוזה (שקעי-צבירה מוזרקים) — ירוק');
