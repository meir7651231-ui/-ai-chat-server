import { strongMatchForCharge as __pure_strongMatchForCharge } from './strong-match-for-charge.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_strongMatchForCharge_STRONG_MATCH_FOR_CHARGE_T = {
  k1: "ext:",
};
const strongMatchForCharge = (...a) => __pure_strongMatchForCharge(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_strongMatchForCharge_STRONG_MATCH_FOR_CHARGE_T);

// שקע-keysOf אמיתי-לפורמט-החוזה (מקומי לבדיקה — מייבאת רק את האטום שלה):
// ext:/id:/ph:/em: · נרמול ספרות לטלפון/ת"ז · lowercase לאימייל · ריק ⇒ אין מפתח.
const keysOf = (o) => {
  const ks = [];
  const ext = (o.extId || '').trim();
  if (ext) ks.push('ext:' + ext);
  const id = String(o.idNum || o.zeout || '').replace(/\D/g, '');
  if (id) ks.push('id:' + id);
  const ph = String(o.phone || '').replace(/\D/g, '');
  if (ph.length >= 7) ks.push('ph:' + ph);
  const em = (o.email || '').trim().toLowerCase();
  if (em) ks.push('em:' + em);
  return ks;
};

const A = { id: 'A', extId: 'T1' };
const B = { id: 'B', phone: '0501234567' };
const C = { id: 'C', idNum: '123456789' };
const D = { id: 'D', email: 'a@b.co' };
const E = { id: 'E', email: 'a@b.co' };

let f = 0;
const chk = (n, got, want) => { if (got !== want) { console.error(`✗ ${n}: ${got?.id ?? got} ≠ ${want?.id ?? want}`); f = 1; } };

// 1. ext (5) גובר על ph (3)
chk('דוגמה-1', strongMatchForCharge({ toremId: 'T1', phone: '0501234567' }, [B, A], keysOf), A);
// 2. התאמת-טלפון דרך נרמול-השקע
chk('דוגמה-2', strongMatchForCharge({ phone: '050-1234567' }, [A, B], keysOf), B);
// 3. zeout בעסקה מול idNum בכרטיס (ציון 4)
chk('דוגמה-3', strongMatchForCharge({ zeout: '123456789' }, [A, B, C], keysOf), C);
// 4. עסקה בלי אף-מפתח ⇒ null
chk('דוגמה-4', strongMatchForCharge({}, [A, B, C], keysOf), null);
// 5. אין התאמה ⇒ null (בלי ניחוש)
chk('דוגמה-5', strongMatchForCharge({ email: 'x@y.com' }, [A, B, C], keysOf), null);
// 6. שוויון-ציון ⇒ הראשון ברשימה
chk('דוגמה-6', strongMatchForCharge({ email: 'a@b.co' }, [D, E], keysOf), D);

if (f) process.exit(1);
console.log('✓ strong-match-for-charge: 6 דוגמאות-חוזה — ירוק');
