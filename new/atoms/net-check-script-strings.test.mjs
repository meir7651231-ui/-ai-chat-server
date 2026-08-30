// בדיקת-צילום · net-check-script-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { NET_CHECK_SCRIPT_T } from './net-check-script-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(NET_CHECK_SCRIPT_T), "{\"k1\":\"שלום, אני משתמש/ת במערכת ניהול לעמותה לצורכי עבודה,\",\"k2\":\"ואבקש לפתוח את הכתובות הבאות (כלי-עבודה, ללא תוכן גולשים):\",\"k3\":\"תודה רבה!\"}");
console.log('OK net-check-script-strings');
