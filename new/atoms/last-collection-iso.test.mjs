import { lastCollectionIso } from './last-collection-iso.mjs';
let f = 0;
const eq = (a, b, msg) => { if (a !== b) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; } };
const box = (...dates) => ({ collections: dates.map((date) => ({ date })) });

// 1) לא-ממוין — המאוחר מנצח
eq(lastCollectionIso(box('2026-01-15', '2026-08-03', '2026-03-20')), '2026-08-03', '1: לא-ממוין');

// 2) בלי ריקונים ⇒ ''
eq(lastCollectionIso(box()), '', '2: ריק');

// 3) ריקון יחיד
eq(lastCollectionIso(box('2025-12-31')), '2025-12-31', '3: יחיד');

// 4) חציית-שנה — לקסיקוגרפיה של ISO נכונה
eq(lastCollectionIso(box('2025-12-31', '2026-01-01')), '2026-01-01', '4: חציית-שנה');

// 5) תאריך כפול
eq(lastCollectionIso(box('2026-05-05', '2026-05-05')), '2026-05-05', '5: כפול');

if (f) process.exit(1);
console.log('✓ last-collection-iso: 5 דוגמאות-חוזה — ירוק');
