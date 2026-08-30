// בדיקת-צילום · marital-chip-style-data — הדאטה שחולצה זהה ביט-אחר-ביט למקור (מנוע-הטיהור).
import * as D from './marital-chip-style-data.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(D.MARITAL_CHIP), "{\"נשואים\":[\"#e6f4ea\",\"#1e7a3a\"],\"אלמן/ה\":[\"#eef1f5\",\"#4a5568\"],\"גרושים\":[\"#fdecec\",\"#b4433a\"],\"פרודים\":[\"#fff4e5\",\"#a15c00\"]}");
console.log('OK marital-chip-style-data');
