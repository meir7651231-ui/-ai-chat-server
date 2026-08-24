import { findAllOpenPlans } from './find-all-open-plans.mjs';
const db = {
  supporters: [
    { id: 's1', name: 'ראובן', plannedCharges: [{ id: 'p1' }, { id: 'p2', chargedRid: 'R-5' }, { id: 'p3', cancelledAt: '2026-01-01' }] },
    { id: 's2', name: 'שמעון' },
  ],
  enrollments: [
    { id: 'e1', memberId: 'm1', plannedCharges: [{ id: 'p4' }] },
    { id: 'e2', memberId: 'mX', plannedCharges: [] },
    { id: 'e3', memberId: 'ghost', plannedCharges: [{ id: 'p6' }] },
  ],
  families: [{ id: 'f1', name: 'לוי', members: [{ id: 'm1', first: 'יעקב' }] }],
  shopAssignments: [{ id: 'a1', famId: 'f1', plannedCharges: [{ id: 'p5' }] }],
};
const expected = [
  { entityType: 'supporter', entityId: 's1', plan: { id: 'p1' }, name: 'ראובן' },
  { entityType: 'enrollment', entityId: 'e1', plan: { id: 'p4' }, name: 'יעקב לוי' },
  { entityType: 'enrollment', entityId: 'e3', plan: { id: 'p6' }, name: '' },
  { entityType: 'shopAssignment', entityId: 'a1', plan: { id: 'p5' }, name: 'לוי' },
];
const got = findAllOpenPlans(db);
if (JSON.stringify(got) !== JSON.stringify(expected)) {
  console.error('✗ got:', JSON.stringify(got, null, 1));
  process.exit(1);
}
console.log('✓ find-all-open-plans: דוגמת-חוזה (4 שורות, דילוגים) — ירוק');
