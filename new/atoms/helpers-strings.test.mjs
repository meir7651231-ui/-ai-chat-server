// בדיקת-צילום · helpers-strings
import { S } from '../atoms/helpers-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(S), "{\"k0\":\"מקרן\",\"k1\":\"הגברה\",\"k2\":\"מזגן\",\"k3\":\"פסנתר\",\"k4\":\"מראות\",\"k5\":\"מטבח מאובזר\",\"k6\":\"מחשבים\",\"k7\":\"שולחנות מתקפלים\"}");
console.log('OK helpers-strings');
