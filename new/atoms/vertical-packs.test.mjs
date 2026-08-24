/** בדיקת-חוזה · vertical-packs — צילום-מבנה + ratchet זהות-הלקוח-החי + כיבוי-מסחרי. */
import { VERTICAL_PACKS } from './vertical-packs.mjs';
import assert from 'node:assert';

// 1) בדיוק 13, ids ייחודיים בסדר המקור
const ids = VERTICAL_PACKS.map(p => p.id);
assert.deepStrictEqual(ids, ['chesed','clinic','shop','services','rooms','fleet','garage','hospitality','gemach','tzedakot','digital','build','studio']);
assert.strictEqual(new Set(ids).size, 13);

// 2) chesed = הלקוח-החי, ביט-זהה
const chesed = VERTICAL_PACKS[0];
assert.deepStrictEqual(chesed.terms, {});
assert.deepStrictEqual(chesed.modules, {});
assert.strictEqual(chesed.theme, 'or-rishon');
for (const k of ['accent','icon','motion','features']) assert.strictEqual(chesed[k], undefined, `chesed.${k} חייב להיעדר`);

// 3) כיבוי-מסחרי מלא בכל חבילה עם features
const OFF = ['core.taxreceipt','families.cred','home.goldbook','home.impactwall','home.community','home.credmetrics','shell.privacy','supporters.hist'];
let commercial = 0;
for (const p of VERTICAL_PACKS) {
  if (!p.features) continue;
  commercial++;
  for (const k of OFF) assert.strictEqual(p.features[k], false, `${p.id}: ${k} חייב false`);
}
assert.strictEqual(commercial, 10, 'בדיוק 10 מסחריות');

// 5) עמותתיות (בלי features) — תמיד המראה הקלאסי or-rishon
for (const p of VERTICAL_PACKS) if (!p.features) assert.strictEqual(p.theme, 'or-rishon', p.id);

// 4) שדות-חובה
for (const p of VERTICAL_PACKS) {
  assert.ok(p.emoji && p.label, p.id);
  assert.strictEqual(typeof p.terms, 'object');
  assert.strictEqual(typeof p.modules, 'object');
}
console.log('✓ vertical-packs — 13 חבילות · chesed ביט-זהה · כיבוי-מסחרי מלא');
