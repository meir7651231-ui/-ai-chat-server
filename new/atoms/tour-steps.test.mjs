import { tourSteps as __pure_tourSteps } from './tour-steps.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_tourSteps_TOUR_STEPS_T = {
  k1: "מאתר המשפחות",
  k2: "מאתר ה",
  k3: "nav.families",
  k4: "משפחות",
  k5: "מאתר החוגים",
  k6: "nav.courses",
  k7: "חוגים",
  k8: "חיזוי חוגים",
  k9: "חיזוי ",
  k10: "מצא חוג",
  k11: "מצא ",
  k12: "entity.course",
  k13: "חוג",
};
const tourSteps = (...a) => __pure_tourSteps(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_tourSteps_TOUR_STEPS_T);
const STEPS = [
  { view: 'home', caption: '👋 פתיחה' },
  { view: 'families', module: 'families', caption: '🎡 מאתר המשפחות — גלגל', anchorText: 'סינון מורחב' },
  { view: 'courses', module: 'courses', caption: '🎡 מאתר החוגים', anchorText: 'מצא חוג' },
  { view: 'courses', module: 'courses', caption: 'חיזוי חוגים: רק תואמים' },
];
const allOn = () => true;
const termOf = (cfg, k, fb) => (cfg.terms && cfg.terms[k]) || fb;
let f = 0;
const ck = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

// 1. בלי config — 4 צעדים, זהות-אובייקט נשמרת (אפס-העתקה)
const r1 = tourSteps(STEPS, allOn, termOf);
ck('בלי-config: 4 צעדים', r1.length === 4);
ck('בלי-config: זהות-אובייקט', r1.every((s, i) => s === STEPS[i]));

// 2. courses כבוי — נשארים בית+משפחות
const r2 = tourSteps(STEPS, (m) => m !== 'courses', termOf);
ck('סינון-מודול: 2 צעדים', r2.length === 2 && r2[0].view === 'home' && r2[1].view === 'families');

// 3. מיתוג דרך termOf
const cfg = { terms: { 'nav.courses': 'סדנאות', 'entity.course': 'סדנה' } };
const r3 = tourSteps(STEPS, allOn, termOf, cfg);
ck('מיתוג caption', r3[2].caption === '🎡 מאתר הסדנאות');
ck('מיתוג anchorText', r3[2].anchorText === 'מצא סדנה');
ck('מיתוג חיזוי', r3[3].caption === 'חיזוי סדנאות: רק תואמים');

// 4. מונח חסר — נפילה ל-fallback, הנוסח המקורי
ck('fallback משפחות', r3[1].caption === '🎡 מאתר המשפחות — גלגל');

if (f) process.exit(1); console.log('✓ tour-steps: 4 דוגמאות-חוזה (סינון · מיתוג · זהות · fallback) — ירוק');
