// בדיקת-פירוק · media-shelf — מבנה + ייחודיות + allowlist + צילום-מונה (מוטציה ⇒ אדום, L36).
import { PURE_MEDIA_SHELF as S } from './pure-media-shelf.mjs';
import assert from 'node:assert';

assert.deepStrictEqual(Object.keys(S), ['family', 'source', 'count', 'atoms'], 'מפתחות-על');
assert.strictEqual(S.family, "media", 'שם-משפחה');
assert.ok(Array.isArray(S.atoms) && S.atoms.length === 30, 'צילום-מונה 30');
assert.strictEqual(S.count, S.atoms.length, 'count תואם');
const KINDS = ["canonical","signature","inherit"];
for (const a of S.atoms) {
  assert.ok(typeof a.name === 'string' && a.name.length > 1, 'שם תקין: ' + a.name);
  assert.ok(KINDS.includes(a.kind), 'kind ב-allowlist: ' + a.kind);
  assert.ok(!/[₪€]/.test(a.name), 'אפס-מטבע: ' + a.name);
}
assert.strictEqual(new Set(S.atoms.map(a => a.name)).size, S.atoms.length, 'שמות ייחודיים');
console.log('OK media-shelf — ' + S.atoms.length + ' אטומים מפורקים (' +
  S.atoms.filter(a => a.kind !== 'inherit').length + ' קנוני/חתימה · ' +
  S.atoms.filter(a => a.kind === 'inherit').length + ' יורש)');
