import { hebParts } from './heb-parts.mjs';
let f=0;
const p1 = hebParts(new Date('2026-08-24T12:00:00'));
if (!(p1.day===11 && p1.month==='Elul' && p1.year===5786)) { console.error('✗ אלול: '+JSON.stringify(p1)); f=1; }
const p2 = hebParts(new Date('2026-04-02T12:00:00'));
if (!(p2.day===15 && p2.month==='Nisan')) { console.error('✗ פסח: '+JSON.stringify(p2)); f=1; }
const p3 = hebParts(new Date('2024-03-24T12:00:00'));
if (p3.month!=='Adar II') { console.error('✗ אדר-ב מעוברת: '+JSON.stringify(p3)); f=1; }
const p4=hebParts(new Date('שבור')); if(p4.day!==0||p4.month!==''){console.error('✗ מגן-שבור');f=1;}
if(f)process.exit(1); console.log('✓ heb-parts: 3 תאריכי-עוגן מאומתים מול הלוח — ירוק');
