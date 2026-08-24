import * as m from './cred-help-text.mjs';
const SNAP = {"CRED_HELP_TEXT":"\"נוכחות +5 · דיוק +2 · פעולה קהילתית +15 · ביטול מוקדם 0 · ביטול מאוחר (‎<48ש׳) ‎-10 · No-Show ‎-20 · אי-פעילות ‎-2/יום · מוכפל ב-TrendFactor (0.8–1.2) לפי 3 הפעולות האחרונות\""};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ cred-help-text: צילום-ערך תואם — ירוק');
