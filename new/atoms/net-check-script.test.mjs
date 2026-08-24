import { netCheckScript } from './net-check-script.mjs';
const CASES = [[["[{\"amount\":100}]"],"\"שלום, אני משתמש/ת במערכת ניהול לעמותה לצורכי עבודה,\\nואבקש לפתוח את הכתובות הבאות (כלי-עבודה, ללא תוכן גולשים):\\n• undefined\\nתודה רבה!\""],[["[\"2026-08-24\"]"],"\"שלום, אני משתמש/ת במערכת ניהול לעמותה לצורכי עבודה,\\nואבקש לפתוח את הכתובות הבאות (כלי-עבודה, ללא תוכן גולשים):\\n• undefined\\nתודה רבה!\""],[["[]"],"\"\""],[["[\"א\",\"ב\"]"],"\"שלום, אני משתמש/ת במערכת ניהול לעמותה לצורכי עבודה,\\nואבקש לפתוח את הכתובות הבאות (כלי-עבודה, ללא תוכן גולשים):\\n• undefined\\n• undefined\\nתודה רבה!\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(netCheckScript(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ net-check-script: ' + CASES.length + ' הקלטות-Golden — ירוק');
