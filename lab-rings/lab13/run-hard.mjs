import { work } from './tzoref.mjs';
const HARD=['מרחק מ-8','חיסור רווי','הגדול כפול 2','סכום רווי','ממוצע','שלושה שווים?','הגבל לתחום','חציון של שלושה'];
await work({names:HARD,baseMs:+process.env.MS||60000,minutes:2}); process.exit(0);
