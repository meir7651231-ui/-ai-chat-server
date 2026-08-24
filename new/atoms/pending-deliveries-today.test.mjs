import { pendingDeliveriesToday } from './pending-deliveries-today.mjs';
const db = {
  distributionDays: [
    { id: 'd1', date: '2026-08-20' },
    { id: 'd2', date: '2026-08-24' },
    { id: 'd3', date: '2026-08-25' },
    { id: 'd4', date: '2026-08-10', closed: true },
  ],
  deliveries: [
    { id: 'v1', dayId: 'd1', status: 'pending' },
    { id: 'v2', dayId: 'd2', status: 'delivered' },
    { id: 'v3', dayId: 'd2', status: 'assigned' },
    { id: 'v4', dayId: 'd3', status: 'pending' },
    { id: 'v5', dayId: 'd4', status: 'pending' },
  ],
};
let f = 0;
const r = pendingDeliveriesToday(db, '2026-08-24');
const ids = r.map((d) => d.id).join(',');
if (ids !== 'v1,v3') { console.error('✗ 1 הפלט המדויק', ids); f = 1; }
if (!r.some((d) => d.id === 'v1')) { console.error('✗ 2 יום-שחלף-פתוח נשמט'); f = 1; }
if (r.some((d) => d.id === 'v2')) { console.error('✗ 3 delivered נכלל'); f = 1; }
if (r.some((d) => d.id === 'v4')) { console.error('✗ 4 יום-עתידי נכלל'); f = 1; }
if (r.some((d) => d.id === 'v5')) { console.error('✗ 5 יום-סגור נכלל'); f = 1; }
if (f) process.exit(1);
console.log('✓ pending-deliveries-today: 5 דוגמאות-חוזה — ירוק');
