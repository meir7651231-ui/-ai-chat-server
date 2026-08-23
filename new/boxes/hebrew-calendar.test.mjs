import { fullDate, parts, annualKey } from './hebrew-calendar.mjs';
let f=0;
if(fullDate('2026-08-24')!=='י״א אלול תשפ״ו'){console.error('✗ מלא: '+fullDate('2026-08-24'));f=1;}
if(fullDate('')!==''){console.error('✗ ריק');f=1;}
if(fullDate('שבור')!==''){console.error('✗ שבור');f=1;}
if(parts('2026-04-02').day!==15){console.error('✗ פסח');f=1;}
// דין-אדר: פורים באדר-ב (מעוברת 2024) ≡ פורים באדר (פשוטה 2025)
if(annualKey('2024-03-24')!==annualKey('2025-03-14')){console.error('✗ דין-אדר: '+annualKey('2024-03-24')+' ≠ '+annualKey('2025-03-14'));f=1;}
if(f)process.exit(1); console.log('✓ קופסת-הלוח: תאריך-מלא + דין-אדר-בחזרות — ירוק');
