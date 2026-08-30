import { orbitTheme as __pure_orbitTheme } from './orbit-theme.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_orbitTheme_ORBIT_THEME_T = {
  k1: "#ffffff",
  k2: "Ice",
  k3: "Ember",
  k4: "Aurora",
  k5: "rgba(",
};
const orbitTheme = (...a) => __pure_orbitTheme(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_orbitTheme_ORBIT_THEME_T);

// מימוש-שקע לבדיקה: ערכת-נפילה מדומה — מוכיחה שהחוט מחזיר אותה כמות-שהיא (===).
const FB = { vars: { '--o-accent': '#000000' }, scene: 'Aurora' };

let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// accent חסר/לא-תקין ⇒ הנפילה באותה הפניה
ok(orbitTheme(undefined, FB) === FB, 'undefined ⇒ fallback (===)');
ok(orbitTheme('#12345', FB) === FB, "'#12345' (5 ספרות) ⇒ fallback (===)");

// '#e91e63' — ערכי-זהב מהקלטת קוד-המקור
const pink = orbitTheme('#e91e63', FB);
ok(pink.vars['--o-accent'] === '#e91e63', 'e91e63 --o-accent: ' + pink.vars['--o-accent']);
ok(pink.vars['--o-accent-rgb'] === '233,30,99', 'e91e63 --o-accent-rgb: ' + pink.vars['--o-accent-rgb']);
ok(pink.vars['--o-g1'] === '#31111c', 'e91e63 --o-g1: ' + pink.vars['--o-g1']);
ok(pink.vars['--o-a1'] === 'rgba(233,30,99,0.30)', 'e91e63 --o-a1: ' + pink.vars['--o-a1']);
ok(pink.vars['--o-btn-text'] === '#ffffff', 'e91e63 --o-btn-text: ' + pink.vars['--o-btn-text']);
ok(pink.scene === 'Aurora', 'e91e63 scene: ' + pink.scene);

// '#ff9800' — גוון חם: Ember + קרקע מוסטת + טקסט-כפתור כהה
const orange = orbitTheme('#ff9800', FB);
ok(orange.scene === 'Ember', 'ff9800 scene: ' + orange.scene);
ok(orange.vars['--o-g1'] === '#321e11', 'ff9800 --o-g1 (קרקע מוסטת): ' + orange.vars['--o-g1']);
ok(orange.vars['--o-btn-text'] === '#2a1710', 'ff9800 --o-btn-text (בהיר ⇒ כהה): ' + orange.vars['--o-btn-text']);

// '#ffffff' — בהיר-מאוד ⇒ Ice
const white = orbitTheme('#ffffff', FB);
ok(white.scene === 'Ice', 'ffffff scene: ' + white.scene);
ok(white.vars['--o-accent-rgb'] === '255,255,255', 'ffffff --o-accent-rgb: ' + white.vars['--o-accent-rgb']);

// בלי '#' — עדיין תקין
const noHash = orbitTheme('6ea8fe', FB);
ok(noHash.vars['--o-accent'] === '#6ea8fe', "'6ea8fe' בלי # תקין: " + noHash.vars['--o-accent']);
ok(noHash.scene === 'Aurora', "'6ea8fe' scene: " + noHash.scene);

// רווחים מסביב — trim
ok(orbitTheme(' #e91e63 ', FB).vars['--o-accent'] === '#e91e63', 'trim לרווחים');

if (f) process.exit(1);
console.log('✓ orbit-theme: 16 דוגמאות-חוזה — ירוק');
