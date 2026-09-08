// בדיקת-צילום · pure-look — מבנה + אינווריאנט-המורף + צילום-ערך-מלא (מוטציה: ריקון⇒אדום, L36).
// G28 (הכרעה-28): + on-a/hi/shade בנייטרל · ערכת t-balagan (אקצנט-יחיד) · skins.paper (עור-הנייר, מלוא נייטרל+סמנטי) · fontSets.heebo.
import { PURE_LOOK } from './pure-look.mjs';
import assert from 'node:assert';

// מבנה
assert.deepStrictEqual(Object.keys(PURE_LOOK), ["defaultTheme","neutral","semantic","themes","skins","fontSets","fonts"], 'מפתחות-על');
assert.deepStrictEqual(Object.keys(PURE_LOOK.fonts), ['serif', 'serifHe', 'grotesk', 'he'], 'ארבע משפחות-פונט');
assert.deepStrictEqual(Object.keys(PURE_LOOK.themes), ['t-indigo', 't-teal', 't-amber', 't-balagan'], 'ארבע ערכות (3 Pure + בלגן)');
assert.ok(PURE_LOOK.themes[PURE_LOOK.defaultTheme], 'defaultTheme קיים בערכות');

// סימטריית-שקעים: כל ערכה חושפת בדיוק אותו סט-אקצנט
const accentKeys = ['--a-hi', '--a', '--a-800', '--gl', '--c2', '--c3'];
for (const [id, t] of Object.entries(PURE_LOOK.themes)) assert.deepStrictEqual(Object.keys(t), accentKeys, 'סט-אקצנט מלא ב-' + id);

// G28 · עור = מלוא נייטרל+סמנטי (אותם מפתחות, אותו סדר) · חבילת-פונט = אותם 4 תפקידים
const skinKeys = [...Object.keys(PURE_LOOK.neutral), ...Object.keys(PURE_LOOK.semantic)];
for (const [id, s] of Object.entries(PURE_LOOK.skins)) assert.deepStrictEqual(Object.keys(s), skinKeys, 'עור מלא: ' + id);
for (const [id, f] of Object.entries(PURE_LOOK.fontSets)) assert.deepStrictEqual(Object.keys(f), Object.keys(PURE_LOOK.fonts), 'חבילת-פונט מלאה: ' + id);
assert.ok(PURE_LOOK.skins.paper && PURE_LOOK.fontSets.heebo && PURE_LOOK.themes['t-balagan'], 'זהות-בלגן קיימת');
assert.strictEqual(PURE_LOOK.skins.paper['--canvas'], '#FFFFFF', 'נייר = לבן');
assert.strictEqual(PURE_LOOK.skins.paper['--on-a'], '#FFFFFF', 'דיו-על-אקצנט בנייר = לבן (כפתור כחול, טקסט לבן)');
assert.strictEqual(PURE_LOOK.neutral['--on-a'], '#0B0B0D', 'דיו-על-אקצנט בכהה = הליטרל שהיה צרוב (ביט-זהה)');
const b = PURE_LOOK.themes['t-balagan']; assert.ok(b['--a'] === b['--a-hi'] && b['--a'] === b['--c2'] && b['--a'] === b['--c3'], 'בלגן = אקצנט-יחיד, בלי גרדיאנט');

// ליטרליות: כל ערך צבע, אפס חיווט var()
const allColors = [
  ...Object.values(PURE_LOOK.neutral), ...Object.values(PURE_LOOK.semantic),
  ...Object.values(PURE_LOOK.themes).flatMap(Object.values), ...Object.values(PURE_LOOK.skins).flatMap(Object.values),
];
for (const v of allColors) { assert.ok(/^#|^rgb|^hsl|^oklch/.test(v), 'ליטרלי: ' + v); assert.ok(!/var\(/.test(v), 'אפס-חיווט: ' + v); }

// אינווריאנט-המורף: אקצנט מתחלף בין ערכות · נייטרל+סמנטי קבועים (לא מאונדקסים-לערכה)
assert.notStrictEqual(PURE_LOOK.themes['t-indigo']['--a'], PURE_LOOK.themes['t-teal']['--a'], 'accent מורף');
assert.notStrictEqual(PURE_LOOK.themes['t-teal']['--a'], PURE_LOOK.themes['t-amber']['--a'], 'accent מורף');
assert.strictEqual(PURE_LOOK.semantic['--ok'], '#43D08C', 'ok קבוע — נשאר ירוק בכל ערכה');
assert.strictEqual(PURE_LOOK.semantic['--err'], '#E0574E', 'error קבוע — נשאר אדום בכל ערכה');
assert.strictEqual(PURE_LOOK.semantic['--gold'], '#E6C766', 'gold קבוע — נשאר זהב בכל ערכה');
assert.strictEqual(PURE_LOOK.neutral['--canvas'], '#0C0C0E', 'עוגן-נייטרל');

// צילום-ערך-מלא — ריקון-מוטציה ⇒ אי-התאמה ⇒ אדום
const SNAP = {
  defaultTheme: 't-indigo',
  neutral: {
    '--canvas': '#0C0C0E',
    '--sunken': '#0A0A0C',
    '--surface': '#151517',
    '--raised': '#1B1B1E',
    '--raised2': '#212126',
    '--ink': '#ECE9E2',
    '--mut': '#9B968C',
    '--faint': '#6E6A62',
    '--hair': 'rgba(236, 233, 226, 0.09)',
    '--hair2': 'rgba(236, 233, 226, 0.05)',
    '--on-a': '#0B0B0D',
    '--hi': '#FFFFFF',
    '--shade': '#000000'
  },
  semantic: {
    '--ok': '#43D08C',
    '--warn': '#E6B84F',
    '--err': '#E0574E',
    '--gold': '#E6C766'
  },
  themes: {
    't-indigo': {
      '--a-hi': '#B0A4FF',
      '--a': '#7A6BF0',
      '--a-800': '#4B3ECB',
      '--gl': 'rgba(122, 107, 240, 0.42)',
      '--c2': '#4CC6E6',
      '--c3': '#B57BE6'
    },
    't-teal': {
      '--a-hi': '#6FE6D5',
      '--a': '#1FB8A6',
      '--a-800': '#0C7E72',
      '--gl': 'rgba(31, 184, 166, 0.42)',
      '--c2': '#4FB6E6',
      '--c3': '#43D08C'
    },
    't-amber': {
      '--a-hi': '#F2C87E',
      '--a': '#D99A3C',
      '--a-800': '#9E6B1E',
      '--gl': 'rgba(217, 154, 60, 0.42)',
      '--c2': '#E8863C',
      '--c3': '#E67BA6'
    },
    't-balagan': {
      '--a-hi': '#2F6FED',
      '--a': '#2F6FED',
      '--a-800': '#1E4FB8',
      '--gl': 'rgba(47, 111, 237, 0)',
      '--c2': '#2F6FED',
      '--c3': '#2F6FED'
    }
  },
  skins: {
    paper: {
      '--canvas': '#FFFFFF',
      '--sunken': '#F7F6F3',
      '--surface': '#FFFFFF',
      '--raised': '#F7F6F3',
      '--raised2': '#EFEDE8',
      '--ink': '#37352F',
      '--mut': 'rgba(55, 53, 47, 0.6)',
      '--faint': 'rgba(55, 53, 47, 0.4)',
      '--hair': 'rgba(0, 0, 0, 0.08)',
      '--hair2': 'rgba(0, 0, 0, 0.05)',
      '--on-a': '#FFFFFF',
      '--hi': '#FFFFFF',
      '--shade': 'rgba(0, 0, 0, 0)',
      '--ok': '#1B8A4C',
      '--warn': '#C98A00',
      '--err': '#C8321E',
      '--gold': '#C98A00'
    }
  },
  fontSets: {
    heebo: {
      serif: 'Heebo',
      serifHe: 'Heebo',
      grotesk: 'Heebo',
      he: 'Heebo'
    }
  },
  fonts: {
    serif: 'Fraunces',
    serifHe: 'Frank Ruhl Libre',
    grotesk: 'Space Grotesk',
    he: 'Heebo'
  }
};
assert.deepStrictEqual(PURE_LOOK, SNAP, 'צילום-ערך-מלא');

console.log('OK pure-look — 4 ערכות · אקצנט-מורף · ok/warn/err/gold קבועים · עור-נייר + heebo · ' + allColors.length + ' פיגמנטים ליטרליים');
