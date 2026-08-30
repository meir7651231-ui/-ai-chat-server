import { netCheckScript as __pure_netCheckScript } from './net-check-script.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_netCheckScript_NET_CHECK_SCRIPT_T = {
  k1: "שלום, אני משתמש/ת במערכת ניהול לעמותה לצורכי עבודה,",
  k2: "ואבקש לפתוח את הכתובות הבאות (כלי-עבודה, ללא תוכן גולשים):",
  k3: "תודה רבה!",
};
const netCheckScript = (...a) => __pure_netCheckScript(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_netCheckScript_NET_CHECK_SCRIPT_T);
const CASES = [[["[{\"amount\":100}]"],"\"שלום, אני משתמש/ת במערכת ניהול לעמותה לצורכי עבודה,\\nואבקש לפתוח את הכתובות הבאות (כלי-עבודה, ללא תוכן גולשים):\\n• undefined\\nתודה רבה!\""],[["[\"2026-08-24\"]"],"\"שלום, אני משתמש/ת במערכת ניהול לעמותה לצורכי עבודה,\\nואבקש לפתוח את הכתובות הבאות (כלי-עבודה, ללא תוכן גולשים):\\n• undefined\\nתודה רבה!\""],[["[]"],"\"\""],[["[\"א\",\"ב\"]"],"\"שלום, אני משתמש/ת במערכת ניהול לעמותה לצורכי עבודה,\\nואבקש לפתוח את הכתובות הבאות (כלי-עבודה, ללא תוכן גולשים):\\n• undefined\\n• undefined\\nתודה רבה!\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(netCheckScript(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ net-check-script: ' + CASES.length + ' הקלטות-Golden — ירוק');
