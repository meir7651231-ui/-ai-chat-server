import { writeOrgCloudConfig } from './write-org-cloud-config.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const calls = [];
const wodMock = async (...args) => { calls.push(args); };

// 1) השכן נקרא פעם אחת עם slug + מעטפת {config} בלבד
const cfg = { features: { shop: false }, terms: { member: 'חניך' } };
const out = await writeOrgCloudConfig('kehila', cfg, wodMock);
chk('1 שכן נקרא פעם אחת: (kehila, {config:deep-equal})',
  calls.length === 1 && calls[0][0] === 'kehila' &&
  JSON.stringify(Object.keys(calls[0][1])) === JSON.stringify(['config']) &&
  JSON.stringify(calls[0][1].config) === JSON.stringify(cfg));

// 2) ניתוק-הפניה: deep-equal אך !==
chk('2 העותק במעטפת !== מהקונפיג המקורי', calls[0][1].config !== cfg);

// 3) עיקור-undefined
await writeOrgCloudConfig('s', { theme: 'tsohar', accent: undefined }, wodMock);
chk('3 undefined מעוקר — {config:{theme}} בלבד',
  JSON.stringify(calls[1][1]) === JSON.stringify({ config: { theme: 'tsohar' } }) &&
  !('accent' in calls[1][1].config));

// 4) מחזיר undefined
chk('4 מחזיר undefined', out === undefined);

// 5) reject מבעבע
let bubbled = '';
try {
  await writeOrgCloudConfig('s', {}, async () => { throw new Error('offline'); });
} catch (e) { bubbled = e.message; }
chk('5 שגיאה מבעבעת', bubbled === 'offline');

if (f) process.exit(1);
console.log('✓ write-org-cloud-config: 5 דוגמאות-חוזה (מעטפת {config} + שקע-שכן) — ירוק');
