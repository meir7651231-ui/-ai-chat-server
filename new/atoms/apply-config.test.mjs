import { applyConfig } from './apply-config.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const spy = () => { const calls = []; const fn = (...a) => { calls.push(a); }; fn.calls = calls; return fn; };

// 1) קונפיג מלא — כל שדה מגיע לשקע הנכון
let t = spy(), v = spy();
applyConfig({ theme: 'tsohar', accent: '#7c3aed', motion: 'calm', emoji: '💜' }, t, v);
ok(t.calls.length === 1, 'applyTheme לא נקרא פעם-אחת');
ok(JSON.stringify(t.calls[0]) === JSON.stringify(['tsohar', '#7c3aed', 'calm']), 'ארגומנטי-הערכה שגויים');
ok(v.calls.length === 1 && v.calls[0][0] === '💜', 'applyFavicon לא קיבל את האימוג\'י');

// 2) קונפיג ריק — השקעים נקראים עם undefined
t = spy(); v = spy();
applyConfig({}, t, v);
ok(t.calls.length === 1 && t.calls[0].every((a) => a === undefined), 'קונפיג ריק: applyTheme לא נקרא עם undefined');
ok(v.calls.length === 1 && v.calls[0][0] === undefined, 'קונפיג ריק: applyFavicon לא נקרא עם undefined');

// 3) שדות חלקיים לא מסוננים
t = spy(); v = spy();
applyConfig({ theme: 'or-rishon' }, t, v);
ok(t.calls[0][0] === 'or-rishon' && t.calls[0][1] === undefined && t.calls[0][2] === undefined, 'שדה חלקי לא הועבר כמו-שהוא');
ok(v.calls[0][0] === undefined, 'emoji חסר היה אמור להגיע undefined');

// 4) סדר-קריאה: קודם ערכה, אחר-כך אייקון
const order = [];
applyConfig({}, () => order.push('theme'), () => order.push('favicon'));
ok(JSON.stringify(order) === JSON.stringify(['theme', 'favicon']), 'סדר-הקריאה שגוי');

if (f) process.exit(1);
console.log('✓ apply-config: 4 דוגמאות-חוזה — ירוק');
