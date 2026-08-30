/** בדיקת-חוזה · org-slug-from-url — חוקי/עוין/גבולות. */
import { orgSlugFromUrl as __pure_orgSlugFromUrl } from './org-slug-from-url.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_orgSlugFromUrl_ORG_SLUG_FROM_URL_T = {
  k1: "org",
};
const orgSlugFromUrl = (...a) => __pure_orgSlugFromUrl(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_orgSlugFromUrl_ORG_SLUG_FROM_URL_T);
import assert from 'node:assert';
assert.strictEqual(orgSlugFromUrl('?org=demo'), 'demo');
assert.strictEqual(orgSlugFromUrl('?x=1&org=or-rishon-2'), 'or-rishon-2');
assert.strictEqual(orgSlugFromUrl('?org=UPPER'), null);
assert.strictEqual(orgSlugFromUrl('?org=a'), null); // קצר מ-2
assert.strictEqual(orgSlugFromUrl('?org=' + 'a'.repeat(41)), null); // ארוך מ-40
assert.strictEqual(orgSlugFromUrl('?org=../etc'), null);
assert.strictEqual(orgSlugFromUrl(''), null);
assert.strictEqual(orgSlugFromUrl(undefined), null);
console.log('✓ org-slug-from-url');
