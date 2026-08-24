/** בדיקת-קצה · קופסת-הוורטיקלים — כל 13 החבילות על קונפיג-אמת, חוקי-הבעלים נאכפים. */
import { applyPack, packOf, PACKS, COMMERCIAL_OFF } from './vertical-packs.mjs';
import assert from 'node:assert';

const base = {
  slug: 'root', name: 'מאור', firebase: { apiKey: 'K' }, adminEmails: ['a@b.co'],
  terms: { member: 'ותיק' }, modules: { shop: false }, features: { 'x.y': false },
  theme: 'tsohar', accent: '#123456', accentCustom: true, emoji: '🕎', motion: 'bold',
};

// 1) chesed = הלקוח-החי (בלי צבע-ידני — נקי לגמרי)
const clean = { ...base }; delete clean.accentCustom; delete clean.accent;
const ch = applyPack(clean, 'chesed');
assert.deepStrictEqual(ch.terms, {}); assert.deepStrictEqual(ch.modules, {});
assert.deepStrictEqual(ch.features, {});
assert.strictEqual(ch.theme, 'or-rishon');
for (const k of ['emoji', 'motion', 'accent', 'accentCustom']) assert.ok(!(k in ch), k);

// 2) צבע-ידני שורד כל חבילה; 5) שדות-קודש לא נדרסים
for (const p of PACKS) {
  const out = applyPack(base, p.id);
  assert.strictEqual(out.accent, '#123456', p.id + ': הצבע-הידני נדרס');
  assert.strictEqual(out.accentCustom, true, p.id);
  assert.strictEqual(out.slug, 'root'); assert.strictEqual(out.firebase, base.firebase);
  assert.deepStrictEqual(out.adminEmails, ['a@b.co']);
  assert.deepStrictEqual(out.terms, p.terms, p.id + ': terms לא-הוחלפו');
}

// 3) מסחרית ⇒ כיבוי-מסחרי מלא
const dg = applyPack(clean, 'digital');
for (const k of Object.keys(COMMERCIAL_OFF)) assert.strictEqual(dg.features[k], false, k);
assert.strictEqual(dg.theme, 'heichal');

// 4) מזהה-זר ⇒ אותה-רפרנס
assert.strictEqual(applyPack(base, 'no-such'), base);
assert.strictEqual(packOf('no-such'), null);
assert.strictEqual(packOf('studio').theme, 'kehila');
console.log('✓ קופסת-הוורטיקלים — 13 חבילות · chesed ביט-זהה · צבע-ידני שורד');

/* 🛡 מגן-הכרעה (דפוס הגנת-מקור של maor): הכרעות-החיווט חתומות במקור-הקופסה. */
import { readFileSync } from 'node:fs';
const boxSrc = readFileSync(new URL('./vertical-packs.mjs', import.meta.url), 'utf8');
// הכרעה 1: השקע packs מחווט לאטום-הנתונים המלא — לא לרשימה-חלקית
assert.ok(boxSrc.includes('applyVerticalPack(config, packId, VERTICAL_PACKS)'), 'מגן: תפר-ההזרקה השתנה');
// הכרעה 2: הקופסה מייבאת אך-ורק מאטומים (חוק-2 — אין ייבוא-צד)
for (const m of boxSrc.matchAll(/from '([^']+)'/g)) {
  assert.ok(m[1].startsWith('../atoms/'), 'מגן: ייבוא-זר בקופסה — ' + m[1]);
}
console.log('✓ מגן-הכרעה — התפר והייבוא חתומים');
