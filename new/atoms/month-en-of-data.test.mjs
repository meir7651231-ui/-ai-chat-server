// בדיקת-צילום · month-en-of-data — הדאטה שחולצה זהה ביט-אחר-ביט למקור (מנוע-הטיהור).
import * as D from './month-en-of-data.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(D.MONTHS), "[[\"Tishri\",\"תשרי\"],[\"Heshvan\",\"חשוון\"],[\"Kislev\",\"כסלו\"],[\"Tevet\",\"טבת\"],[\"Shevat\",\"שבט\"],[\"Adar\",\"אדר\"],[\"Adar I\",\"אדר א׳\"],[\"Adar II\",\"אדר ב׳\"],[\"Nisan\",\"ניסן\"],[\"Iyar\",\"אייר\"],[\"Sivan\",\"סיוון\"],[\"Tamuz\",\"תמוז\"],[\"Av\",\"אב\"],[\"Elul\",\"אלול\"]]");
console.log('OK month-en-of-data');
