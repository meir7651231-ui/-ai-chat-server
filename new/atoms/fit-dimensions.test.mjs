import { fitDimensions } from './fit-dimensions.mjs';
const C = [
  [[1600, 800, 800], { w: 800, h: 400 }],
  [[400, 300, 800], { w: 400, h: 300 }],
  [[800, 800, 800], { w: 800, h: 800 }],
  [[0, 100, 800], { w: 0, h: 0 }],
  [[-5, 100, 800], { w: 0, h: 0 }],
  [[999, 333, 100], { w: 100, h: 33 }],
  [[3000, 1, 800], { w: 800, h: 1 }],
];
let f = 0;
for (const [args, want] of C) {
  const g = fitDimensions(...args);
  if (g.w !== want.w || g.h !== want.h) {
    console.error(`✗ (${args}) ⇒ ${JSON.stringify(g)} ≠ ${JSON.stringify(want)}`);
    f = 1;
  }
}
if (f) process.exit(1);
console.log('✓ fit-dimensions: 7 דוגמאות-חוזה — ירוק');
