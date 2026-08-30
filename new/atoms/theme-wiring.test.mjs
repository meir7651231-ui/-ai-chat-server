// בדיקת-צילום · theme-wiring — סימטריית-תפקידים + מבנה שני-מצבים.
import { WIRING } from './theme-wiring.mjs';
import assert from 'node:assert';
assert.deepStrictEqual(Object.keys(WIRING), ['light', 'dark'], 'שני מצבים');
assert.strictEqual(Object.keys(WIRING.light).join(), Object.keys(WIRING.dark).join(), 'סימטריית-תפקידים אור/חושך');
assert.ok(Object.keys(WIRING.light).length > 50, 'טבלת-התפקידים מלאה');
assert.strictEqual(WIRING.light['--c-ink'], 'p_33272a', 'עוגן-ערך light');
console.log('OK theme-wiring');
