import { cockpitCsvRows as f } from './cockpit-csv-rows.mjs';
const Q = { tasks: [{ kind: 'call', name: 'אבי', phone: '050', reason: 'יעד' }, { kind: 'thanks', name: '', phone: '', reason: 'תרם ₪100 · היום' }, { kind: 'hok', name: 'דן', phone: '052', reason: 'הוק' }], total: 3 };
const want = '[["קבוצה","שם","טלפון","סיבה"],["שיחה","אבי","050","יעד"],["תודה","","","תרם ₪100 · היום"],["הו״ק","דן","052","הוק"]]';
const got = JSON.stringify(f(Q));
if (got !== want) { console.error('✗', got, '≠', want); process.exit(1); }
console.log('✓ cockpit-csv-rows: 1 Golden — ירוק');
