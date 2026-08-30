import { cockpitWorkListText as __pure_cockpitWorkListText } from './cockpit-work-list-text.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_cockpitWorkListText_COCKPIT_WORK_LIST_TEXT_T = {
  k1: "📞 שיחה",
  k2: "💛 תודה",
  k3: "🔁 הו״ק",
  k4: "ללא שם",
};
const f = (...a) => __pure_cockpitWorkListText(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_cockpitWorkListText_COCKPIT_WORK_LIST_TEXT_T);
const Q = { tasks: [{ kind: 'call', name: 'אבי', phone: '050', reason: 'יעד' }, { kind: 'thanks', name: '', phone: '', reason: 'תרם ₪100 · היום' }, { kind: 'hok', name: 'דן', phone: '052', reason: 'הוק' }], total: 3 };
const want = '📞 שיחה · אבי · 050 — יעד\n💛 תודה · ללא שם — תרם ₪100 · היום\n🔁 הו״ק · דן · 052 — הוק';
const got = f(Q);
if (got !== want) { console.error('✗\n' + got); process.exit(1); }
console.log('✓ cockpit-work-list-text: 1 Golden — ירוק');
