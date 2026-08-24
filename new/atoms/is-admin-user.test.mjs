import { isAdminUser } from './is-admin-user.mjs';
const C = [
  [{}, 'anyone@x.com', true],
  [{ adminEmails: [] }, null, true],
  [{ adminEmails: ['a@b.com'] }, null, false],
  [{ adminEmails: [' A@B.Com '] }, 'a@b.com', true],
  [{ adminEmails: ['a@b.com'] }, '  A@B.COM ', true],
  [{ adminEmails: ['a@b.com'] }, 'z@b.com', false],
  [{ adminEmails: ['a@b.com'] }, '', false],
];
let f = 0;
for (const [config, email, w] of C) {
  const g = isAdminUser(config, email);
  if (g !== w) { console.error(`✗ ${JSON.stringify(config)} · ${JSON.stringify(email)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ is-admin-user: 7 דוגמאות-חוזה — ירוק (רשימה-ריקה=כולם · trim+lowercase דו-צדדי)');
