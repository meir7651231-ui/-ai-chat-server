import { isOrgManager } from './is-org-manager.mjs';
const nrm = (e) => e.trim().toLowerCase();
const C = [
  [' A@b.com', { manager: 'a@B.com ' }, true],
  ['a@b.com', { manager: 'a@b.com' }, true],
  ['c@d.com', { manager: 'a@b.com' }, false],
  ['a@b.com', {}, false],
  ['', { manager: '  ' }, false],
];
let f = 0;
for (const [email, org, w] of C) {
  const g = isOrgManager(email, org, nrm);
  if (g !== w) { console.error(`✗ ${JSON.stringify([email, org])} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ is-org-manager: 5 דוגמאות-חוזה — ירוק');
