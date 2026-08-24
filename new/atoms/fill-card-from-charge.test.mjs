import { fillCardFromCharge } from './fill-card-from-charge.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` ⇒ ${JSON.stringify(a)}`);

// שקעים נאמנים-למקור (dedup.ts) — הבדיקה מייבאת רק את האטום שלה
const normPhone = (s) => {
  let d = (s || '').replace(/\D/g, '');
  if (/^(\d)\1+$/.test(d)) return '';
  d = d.replace(/^00/, '');
  if (d.startsWith('972')) d = '0' + d.slice(3);
  return d.replace(/^0{2,}/, '0');
};
const normId = (s) => {
  const d = (s || '').replace(/\D/g, '');
  if (!d || /^0+$/.test(d)) return '';
  if (d.replace(/^0+/, '').length < 4) return '';
  return d.length >= 5 ? d : '';
};
const S = [normPhone, normId];
const CH = { phone: ' 052-1234567 ', email: ' a@b.co.il ', zeout: '0-1234567-8', name: ' דוד לוי ' };

// 1) כרטיס-ריק ⇒ ארבעת השדות מולאו (phone גלם-גזום, idNum מנורמל)
eq(fillCardFromCharge({}, CH, ...S),
  { phone: '052-1234567', email: 'a@b.co.il', idNum: '012345678', name: 'דוד לוי' },
  'מילוי כרטיס-ריק שגוי');

// 2) ערך-קיים לא נדרס
const sp2 = { phone: '03-1111111', name: 'לוי', email: '' };
const r2 = fillCardFromCharge(sp2, CH, ...S);
ok(r2.phone === '03-1111111' && r2.name === 'לוי', 'ערך-קיים נדרס');
ok(r2.email === 'a@b.co.il' && r2.idNum === '012345678', 'שדה-ריק לא הושלם');

// 3) מספר-דמה ⇒ לא ממלא גם שדה-ריק (C12)
ok(!('phone' in fillCardFromCharge({}, { phone: '0000000000' }, ...S)), 'מספר-דמה מילא טלפון');

// 4) טלפון-קצר (<7 ספרות) ⇒ לא מולא
ok(!('phone' in fillCardFromCharge({}, { phone: '123-45' }, ...S)), 'טלפון-קצר מילא');

// 5) zeout קצר ⇒ normId '' ⇒ idNum לא מולא
ok(!('idNum' in fillCardFromCharge({}, { zeout: '123' }, ...S)), 'ת"ז-פסולה מילאה');

// 6) אין-מה-למלא ⇒ אותה רפרנס
const sp6 = { phone: '03-1111111' };
ok(fillCardFromCharge(sp6, {}, ...S) === sp6, 'עסקה-ריקה לא החזירה אותה רפרנס');

// 7) רווחים-בלבד = ריק ⇒ מולא
eq(fillCardFromCharge({ phone: '   ' }, { phone: '052-1234567' }, ...S).phone,
  '052-1234567', 'שדה-רווחים לא נחשב ריק');

if (f) process.exit(1);
console.log('✓ fill-card-from-charge: 7 דוגמאות-חוזה — ירוק');
