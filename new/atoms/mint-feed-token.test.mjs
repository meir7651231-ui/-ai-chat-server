import { mintFeedToken } from './mint-feed-token.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const tokens = Array.from({ length: 200 }, () => mintFeedToken());

// 1) אורך 32 בדיוק
chk('1 אורך 32', tokens[0].length === 32);

// 2) hex קטן בלבד
chk('2 תואם ^[0-9a-f]{32}$', /^[0-9a-f]{32}$/.test(tokens[0]));

// 3) ריפוד — כל 200 הטביעות באורך 32 ותואמות hex (בלי padStart היו מתקצרות)
chk('3 ריפוד: 200/200 באורך 32 ו-hex',
  tokens.every((t) => t.length === 32 && /^[0-9a-f]{32}$/.test(t)));

// 4) אקראיות — 200 ערכים שונים
chk('4 200 טביעות שונות', new Set(tokens).size === 200);

if (f) process.exit(1);
console.log('✓ mint-feed-token: 4 דוגמאות-חוזה — ירוק');
