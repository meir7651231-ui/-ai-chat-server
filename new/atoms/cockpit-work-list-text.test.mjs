import { cockpitWorkListText as f } from './cockpit-work-list-text.mjs';
const Q = { tasks: [{ kind: 'call', name: 'אבי', phone: '050', reason: 'יעד' }, { kind: 'thanks', name: '', phone: '', reason: 'תרם ₪100 · היום' }, { kind: 'hok', name: 'דן', phone: '052', reason: 'הוק' }], total: 3 };
const want = '📞 שיחה · אבי · 050 — יעד\n💛 תודה · ללא שם — תרם ₪100 · היום\n🔁 הו״ק · דן · 052 — הוק';
const got = f(Q);
if (got !== want) { console.error('✗\n' + got); process.exit(1); }
console.log('✓ cockpit-work-list-text: 1 Golden — ירוק');
