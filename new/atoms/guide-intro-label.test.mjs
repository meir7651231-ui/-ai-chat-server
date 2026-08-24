import { GUIDE_INTRO_LABEL } from './guide-intro-label.mjs';
let f=0; const ck=(n,g,w)=>{ if(g!==w){console.error(`✗ ${n}: ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`);f=1;} };
ck('value', GUIDE_INTRO_LABEL, 'לפני הכל:');
ck('length', GUIDE_INTRO_LABEL.length, 9);
ck('endsWith :', GUIDE_INTRO_LABEL.endsWith(':'), true);
ck('startsWith לפני', GUIDE_INTRO_LABEL.startsWith('לפני'), true);
if(f)process.exit(1); console.log('✓ guide-intro-label: 4 דוגמאות-חוזה — ירוק (נוסח-לגאסי שמור)');
