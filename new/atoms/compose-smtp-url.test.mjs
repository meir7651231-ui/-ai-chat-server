import { composeSmtpUrl } from './compose-smtp-url.mjs';
const C = [
  [['a@b.com', 'pw', 'smtp.gmail.com:465'], 'smtps://a%40b.com:pw@smtp.gmail.com:465'],
  [['a@b.com', 'pw', 'smtp-mail.outlook.com:587'], 'smtp://a%40b.com:pw@smtp-mail.outlook.com:587'],
  [['a@b.com', 'p@ss:1/2', 'h.co:465'], 'smtps://a%40b.com:p%40ss%3A1%2F2@h.co:465'],
  [[' a@b.com ', ' pw ', ' smtp.gmail.com:465 '], 'smtps://a%40b.com:pw@smtp.gmail.com:465'],
  [['', 'pw', 'h:465'], null],
  [['a@b.com', '', 'h:465'], null],
  [['a@b.com', 'pw', ''], null],
  [['abc', 'pw', 'h:465'], null],
  [['@b.com', 'pw', 'h:465'], null],
  [['a@b.com', 'pw', 'mail.example.com:2525'], 'smtp://a%40b.com:pw@mail.example.com:2525'],
];
let f = 0;
C.forEach(([args, w], i) => { const g = composeSmtpUrl(...args); if (g !== w) { console.error(`✗ מקרה ${i + 1}: ${g} ≠ ${w}`); f = 1; } });
if (f) process.exit(1);
console.log('✓ compose-smtp-url: 7 דוגמאות-חוזה (10 מקרים) — ירוק');
