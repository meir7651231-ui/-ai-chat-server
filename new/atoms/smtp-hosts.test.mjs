import * as m from './smtp-hosts.mjs';
const SNAP = {"SMTP_HOSTS":"{\"gmail.com\":\"smtp.gmail.com:465\",\"googlemail.com\":\"smtp.gmail.com:465\",\"outlook.com\":\"smtp-mail.outlook.com:587\",\"hotmail.com\":\"smtp-mail.outlook.com:587\",\"yahoo.com\":\"smtp.mail.yahoo.com:465\",\"walla.co.il\":\"out.walla.co.il:465\"}"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ smtp-hosts: צילום-ערך תואם — ירוק');
