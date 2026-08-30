/** בדיקת-חוזה · make-normalize-site — זבל/עוין/תקרות/ריקים/רב-לשוני. */
import { makeNormalizeSite as __pure_makeNormalizeSite } from './make-normalize-site.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_makeNormalizeSite_MAKE_NORMALIZE_SITE_T = {
  k1: "string",
  k2: "object",
  k3: "number",
  k4: "heroTitle",
  k5: "brandLine",
  k6: "heroBadge",
  k7: "titleAccent",
  k8: "servicesHeading",
  k9: "microCopy",
  k10: "ticker",
  k11: "storyTitle",
  k12: "storyTitleAccent",
  k13: "storyBadge",
  k14: "donateNote",
};
const makeNormalizeSite = (...a) => __pure_makeNormalizeSite(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_makeNormalizeSite_MAKE_NORMALIZE_SITE_T);
import assert from 'node:assert';

// שקע-https מינימלי תואם-חוזה (הצלבת-אמת מול safe-https-url = בדיקת-הקופסה)
const safe = (raw) => { const t = (raw || '').trim(); if (!t) return null; try { const u = new URL(t); return u.protocol === 'https:' ? u.toString() : null; } catch { return null; } };
const ns = makeNormalizeSite(safe, ['he', 'en', 'yi']);

// 1) זבל => undefined
for (const junk of [null, undefined, 'str', 42, []]) assert.strictEqual(ns(junk), undefined, String(junk));

// 2) https-בלבד
const evil = ns({ donateUrl: 'javascript:alert(1)', gallery: ['http://x.co/a.jpg', 'https://ok.co/b.jpg'] });
assert.ok(!('donateUrl' in evil), 'javascript: שרד!');
assert.deepStrictEqual(evil.gallery, ['https://ok.co/b.jpg']);

// 3) תווי-בקרה נמחקים + תקרות + שדה-זר נזרק
const s2 = ns({ icon: 'אב' + String.fromCharCode(7) + 'ג', tagline: 'א'.repeat(300), hackerField: 'x' });
assert.strictEqual(s2.icon, 'אבג', 'תו-בקרה שרד');
assert.strictEqual(s2.tagline.length, 200);
assert.ok(!('hackerField' in s2), 'שדה-זר שרד');

// 4) רב-לשוני: רק allowlist, ערך-ריק נזרק; אובייקט-ריק לא נכתב
const s3 = ns({ tagline: { he: 'שלום', xx: 'nope', en: '  ' }, campaign: { junk: 1 } });
assert.deepStrictEqual(s3.tagline, { he: 'שלום' });
assert.ok(!('campaign' in s3), 'קמפיין-ריק נכתב');

// 5) תקרות-כמות: services<=12; faq שלם-בלבד
const s4 = ns({ services: Array.from({ length: 20 }, (_, i) => ({ title: 'ש' + i })), faq: [{ q: 'שאלה' }, { q: 'ש', a: 'ת' }] });
assert.strictEqual(s4.services.length, 12);
assert.deepStrictEqual(s4.faq, [{ q: 'ש', a: 'ת' }]);

// 6) טלפון מנוקה; מייל בלי @ נזרק; וואטסאפ שורד
const s5 = ns({ contact: { phones: ['050-123x4567!', 'abc'], email: 'not-an-email', whatsapp: '+972 50 1234567' } });
assert.deepStrictEqual(s5.contact.phones, ['050-1234567']);
assert.ok(!('email' in s5.contact));
assert.strictEqual(s5.contact.whatsapp, '+972 50 1234567');
console.log('OK make-normalize-site');
