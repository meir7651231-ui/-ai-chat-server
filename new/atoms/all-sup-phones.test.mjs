import { allSupPhones } from './all-sup-phones.mjs';
const reg = (n) => (n.startsWith('0') ? 'il' : 'intl');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const C = [
  [{}, []],
  [{ phone: '0501234567' }, [{ num: '0501234567', label: '', note: '', wa: false, region: 'il', primary: true }]],
  [{ phone: '+15551234' }, [{ num: '+15551234', label: '', note: '', wa: false, region: 'intl', primary: true }]],
  [{ phones: [{ num: '0521111111', label: 'בית', wa: true }] }, [{ num: '0521111111', label: 'בית', note: '', wa: true, region: 'il', primary: false }]],
  [{ phones: [{ num: '' }, { num: '0523333333', note: 'נייד' }] }, [{ num: '0523333333', label: '', note: 'נייד', wa: false, region: 'il', primary: false }]],
  [{ phone: '0501234567', phones: [{ num: '0522222222' }] }, [
    { num: '0501234567', label: '', note: '', wa: false, region: 'il', primary: true },
    { num: '0522222222', label: '', note: '', wa: false, region: 'il', primary: false },
  ]],
];
let f = 0;
for (const [a, w] of C) { const g = allSupPhones(a, reg); if (!eq(g, w)) { console.error(`✗ ${JSON.stringify(a)} ⇒ ${JSON.stringify(g)}`); f = 1; } }
if (f) process.exit(1);
console.log('✓ all-sup-phones: 6 דוגמאות-חוזה — ירוק');
