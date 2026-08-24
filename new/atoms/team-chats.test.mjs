import * as m from './team-chats.mjs';
const SNAP = {"TEAM_CHATS":"\"teamChats\""};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ team-chats: צילום-ערך תואם — ירוק');
