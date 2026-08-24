import { SHOP_EXPIRY_WARN_DAYS } from './shop-expiry-warn-days.mjs';
let f = 0;
const chk = (name, ok) => { if (!ok) { console.error('✗ ' + name); f = 1; } };
chk('ערך ביט-זהה 7', SHOP_EXPIRY_WARN_DAYS === 7);
chk('מספר שלם', Number.isInteger(SHOP_EXPIRY_WARN_DAYS));
chk('חיובי', SHOP_EXPIRY_WARN_DAYS > 0);
// שבוע קלנדרי: היום + 7 ימים ⇒ אופק (חישוב-האופק כמו במנוע-המקור: T12:00:00 + setDate)
const h = new Date('2026-08-24T12:00:00'); h.setDate(h.getDate() + SHOP_EXPIRY_WARN_DAYS);
const horizonIso = h.getFullYear() + '-' + String(h.getMonth() + 1).padStart(2, '0') + '-' + String(h.getDate()).padStart(2, '0');
chk('אופק 2026-08-31', horizonIso === '2026-08-31');
chk('2026-08-31 בפנים · 2026-09-01 בחוץ', '2026-08-31' <= horizonIso && '2026-09-01' > horizonIso);
if (f) process.exit(1); console.log('✓ shop-expiry-warn-days: 5 דוגמאות-חוזה — ירוק');
