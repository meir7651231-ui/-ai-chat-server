import { isMember } from './is-member.mjs';
const nrm = (e) => e.trim().toLowerCase();
const mgr = (e, o) => {
  const m = (o.manager ?? '').trim().toLowerCase();
  return !!m && nrm(e) === m;
};
const C = [
  ['boss@x.com', { manager: 'Boss@x.com', members: [] }, true],
  [' Anna@x.com', { manager: 'boss@x.com', members: ['anna@x.com '] }, true],
  ['guest@x.com', { manager: 'boss@x.com', members: ['anna@x.com'] }, false],
  ['a@x.com', {}, false],
  ['b@x.com', { members: [' B@X.com '] }, true],
];
let f = 0;
for (const [email, org, w] of C) {
  const g = isMember(email, org, nrm, mgr);
  if (g !== w) { console.error(`✗ ${JSON.stringify([email, org])} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ is-member: 5 דוגמאות-חוזה — ירוק');
