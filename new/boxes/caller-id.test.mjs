/** בדיקת-קצה · קופסת-זיהוי-השיחה — זרימה מלאה מספר⇒כרטיס-שיחה על db-אמת. */
import { identifyCaller, kindLabel, screenPop, phoneKey } from './caller-id.mjs';
import assert from 'node:assert';

const db = {
  families: [{ id: 'F1', name: 'כהן', phone: '050-1234567', members: [{ id: 'M1', name: 'רחל', phone: '0521111111' }] }],
  supporters: [{ id: 'S1', name: 'לוי', phone: '+972-53-2222222' }],
  volunteers: [{ id: 'V1', name: 'מירי', phone: '054 3333333' }],
  tzCoordinators: [{ id: 'C1', name: 'דבורה', phone: '0554444444' }], // שם-האוסף האמיתי במקור (L4)
  deliveries: [{ familyId: 'F1', status: 'picked' }, { familyId: 'F1', status: 'delivered' }],
  shopAssignments: [{ famId: 'F1', status: 'active' }],
};
const cfg = { terms: {} };
const cfgBiz = { terms: { 'entity.family': 'לקוח', 'entity.supporter': 'ליד' } };

// 1+3) זיהוי בכל הצורות של אותו מספר
for (const raw of ['0501234567', '+972-50-1234567', '00972501234567', '050 123 4567']) {
  const c = identifyCaller(db, raw);
  assert.strictEqual(c?.kind, 'family', raw);
  assert.strictEqual(c.id, 'F1');
}
// 2) קצר ⇒ null
assert.strictEqual(identifyCaller(db, '12345'), null);
// סדר-קדימות: בן-משפחה לפני תורם
assert.strictEqual(identifyCaller(db, '0521111111').kind, 'member');
assert.strictEqual(identifyCaller(db, '0532222222').kind, 'supporter');
assert.strictEqual(identifyCaller(db, '0543333333').kind, 'volunteer');
assert.strictEqual(identifyCaller(db, '0554444444').kind, 'coordinator');

// 4) white-label חי: בלי דריסות = היסטורי; עם = נדרס
assert.strictEqual(kindLabel(cfg, 'family'), 'משפחה');
assert.strictEqual(kindLabel(cfgBiz, 'family'), 'לקוח');
assert.strictEqual(kindLabel(cfgBiz, 'supporter'), 'ליד');

// 5) כרטיס-שיחה מלא: משפחה ⇒ הקשר (מסירה פתוחה אחת, שיבוץ פעיל אחד); תורם ⇒ בלי
const pop = screenPop(db, cfg, '+972501234567');
assert.strictEqual(pop.label, 'משפחה');
assert.deepStrictEqual(pop.context, { openDeliveries: 1, activeAssignments: 1 });
assert.strictEqual(screenPop(db, cfg, '0532222222').context, null);
assert.strictEqual(screenPop(db, cfg, '0000000000'), null);

// שפיות-נירמול ישירה
assert.strictEqual(phoneKey('+972-50-1234567'), phoneKey('0501234567'));
console.log('OK קופסת-זיהוי-השיחה');

/* 🛡 מגן-הכרעה: התפרים חתומים במקור-הקופסה; ייבוא רק מאטומים (חוק-2). */
import { readFileSync } from 'node:fs';
const boxSrc = readFileSync(new URL('./caller-id.mjs', import.meta.url), 'utf8');
assert.ok(boxSrc.includes('findCaller(db, rawNumber, phoneKey)'), 'מגן: תפר-הנירמול השתנה');
assert.ok(boxSrc.includes('callerKindLabel(cfg, kind, termOf)'), 'מגן: תפר-המונחים השתנה');
for (const m of boxSrc.matchAll(/from '([^']+)'/g)) assert.ok(m[1].startsWith('../atoms/'), 'מגן: ייבוא-זר — ' + m[1]);
console.log('OK מגן-הכרעה');
