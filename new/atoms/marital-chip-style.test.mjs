import { maritalChipStyle } from './marital-chip-style.mjs';
const probe = (bg, c) => [bg, c]; // שקע-בוחן — מחזיר את הזוג שנבחר
const C = [
  ['נשואים', ['#e6f4ea', '#1e7a3a']],
  ['אלמן/ה', ['#eef1f5', '#4a5568']],
  ['גרושים', ['#fdecec', '#b4433a']],
  ['פרודים', ['#fff4e5', '#a15c00']],
  ['רווק', ['#eef1f5', '#4a5568']],
  ['', ['#eef1f5', '#4a5568']],
];
let f = 0;
for (const [status, w] of C) {
  const g = maritalChipStyle(status, probe);
  if (g[0] !== w[0] || g[1] !== w[1]) {
    console.error(`✗ maritalChipStyle(${JSON.stringify(status)}) = ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`);
    f = 1;
  }
}
if (f) process.exit(1);
console.log('✓ marital-chip-style: 6 דוגמאות-חוזה (שקע-chipStyle) — ירוק');
