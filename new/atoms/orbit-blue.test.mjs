import { ORBIT_BLUE } from './orbit-blue.mjs';

let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

ok(ORBIT_BLUE.scene === 'Aurora', "scene==='Aurora': " + ORBIT_BLUE.scene);
ok(Object.keys(ORBIT_BLUE.vars).length === 15, '15 מפתחות ב-vars: ' + Object.keys(ORBIT_BLUE.vars).length);
ok(ORBIT_BLUE.vars['--o-accent'] === '#6ea8fe', '--o-accent: ' + ORBIT_BLUE.vars['--o-accent']);
ok(ORBIT_BLUE.vars['--accent'] === '#6ea8fe', '--accent: ' + ORBIT_BLUE.vars['--accent']);
ok(ORBIT_BLUE.vars['--o-accent-rgb'] === '110,168,254', '--o-accent-rgb: ' + ORBIT_BLUE.vars['--o-accent-rgb']);
ok(ORBIT_BLUE.vars['--o-g1'] === '#1a2340', '--o-g1: ' + ORBIT_BLUE.vars['--o-g1']);
ok(ORBIT_BLUE.vars['--o-btn-text'] === '#ffffff', '--o-btn-text: ' + ORBIT_BLUE.vars['--o-btn-text']);
ok(ORBIT_BLUE.vars['--o-glow'] === 'rgba(120,150,255,0.30)', '--o-glow: ' + ORBIT_BLUE.vars['--o-glow']);

if (f) process.exit(1);
console.log('✓ orbit-blue: 8 דוגמאות-חוזה — ירוק');
