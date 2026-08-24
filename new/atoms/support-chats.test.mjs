import * as m from './support-chats.mjs';
const SNAP = {"SUPPORT_CHATS":"\"supportChats\""};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ support-chats: צילום-ערך תואם — ירוק');
