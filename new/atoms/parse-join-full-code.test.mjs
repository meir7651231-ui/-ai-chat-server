import { deepStrictEqual } from 'node:assert';
import { parseJoinFullCode } from './parse-join-full-code.mjs';

// מימוש-שקע לבדיקה — בדיוק המקור (platform/lib.ts:34).
const isValidSlug = (slug) => /^[a-z0-9-]{2,40}$/.test(slug);

const C = [
  ['maor.AB12', { slug: 'maor', code: 'AB12' }],
  [' MAOR.k9 ', { slug: 'maor', code: 'k9' }],
  ['my-org.k.9', { slug: 'my-org', code: 'k.9' }],
  ['maor', null],
  ['.abc', null],
  ['maor.', null],
  ['a!.k99', null],
];
for (const [full, want] of C)
  deepStrictEqual(parseJoinFullCode(full, isValidSlug), want, `parseJoinFullCode(${JSON.stringify(full)})`);
console.log('✓ parse-join-full-code: 7 דוגמאות-חוזה (שקע isValidSlug) — ירוק');
