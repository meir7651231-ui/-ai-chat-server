import { GUIDE_RECIPES_LABEL } from './guide-recipes-label.mjs';
let f=0; const ck=(n,g,w)=>{ if(g!==w){console.error(`✗ ${n}: ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`);f=1;} };
ck('value', GUIDE_RECIPES_LABEL, 'המתכונים המהירים:');
ck('length', GUIDE_RECIPES_LABEL.length, 17);
ck('endsWith :', GUIDE_RECIPES_LABEL.endsWith(':'), true);
ck('startsWith המתכונים', GUIDE_RECIPES_LABEL.startsWith('המתכונים'), true);
if(f)process.exit(1); console.log('✓ guide-recipes-label: 4 דוגמאות-חוזה — ירוק (נוסח-לגאסי שמור)');
