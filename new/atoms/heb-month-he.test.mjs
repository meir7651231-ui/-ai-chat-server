import { hebMonthHe } from './heb-month-he.mjs';
let f=0;
if(hebMonthHe(new Date('2026-08-24T12:00:00'))!=='אלול'){console.error('✗ אלול');f=1;}
if(hebMonthHe(new Date('2026-04-02T12:00:00'))!=='ניסן'){console.error('✗ ניסן');f=1;}
if(!hebMonthHe(new Date('2024-03-24T12:00:00')).startsWith('אדר ב')){console.error('✗ אדר-ב');f=1;}
if(hebMonthHe(new Date('שבור'))!==''){console.error('✗ שבור');f=1;}
if(f)process.exit(1); console.log('✓ heb-month-he: 4 דוגמאות — ירוק');
