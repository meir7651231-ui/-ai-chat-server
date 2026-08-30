// בדיקת-צילום · heb-months-of-data — הדאטה שחולצה זהה ביט-אחר-ביט למקור (מנוע-הטיהור).
import * as D from './heb-months-of-data.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(D.ORDER_COMMON), "[\"Tishri\",\"Heshvan\",\"Kislev\",\"Tevet\",\"Shevat\",\"Adar\",\"Nisan\",\"Iyar\",\"Sivan\",\"Tamuz\",\"Av\",\"Elul\"]");
assert.strictEqual(JSON.stringify(D.ORDER_LEAP), "[\"Tishri\",\"Heshvan\",\"Kislev\",\"Tevet\",\"Shevat\",\"Adar I\",\"Adar II\",\"Nisan\",\"Iyar\",\"Sivan\",\"Tamuz\",\"Av\",\"Elul\"]");
console.log('OK heb-months-of-data');
