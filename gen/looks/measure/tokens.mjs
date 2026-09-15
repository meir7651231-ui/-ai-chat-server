/* tokens.mjs — הופך את measured.json לטוקנים שהמסכים משתמשים בהם.
   כל ערך כאן מגיע מהמדידה החיה; ליד כל אחד רשום מאיפה (מפתח האתר + השדה).
   המדידה משתרעת על 18 עמודים ציבוריים (3–4 לכל אתר), ולא על עמוד-בית יחיד.
   שבע חריגות מכוונות בלבד — טקסט קטן שלא עבר סף-קריאות — מתועדות ב-SWAPS. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const M = JSON.parse(readFileSync(join(here, 'measured.json'), 'utf8'));
const S = M.sites;

/* עזר: שליפה בטוחה עם מקור */
const pick = (path, fallback) => {
  const [key, ...rest] = path.split('.');
  let v = S[key];
  for (const p of rest) v = v && v[isNaN(+p) ? p : +p];
  return v === undefined || v === null ? fallback : v;
};

/* התאמות-גופן: לפנים האמיתיות אין עברית. לכל אחת נבחרה מקבילה עברית בעלת אותו אופי. */
export const FACE = {
  raycast: { real: 'Inter', heb: 'Assistant', family: 'Assistant:wght@400;500;600;700', why: 'גרוטסק ניטרלי, אותה רוחב-אות' },
  spotify: { real: 'SpotifyMixUI (Circular)', heb: 'Secular One + Assistant', family: 'Secular+One', family2: 'Assistant:wght@400;600;700', why: 'גיאומטרי-עגול לכותרות' },
  duolingo: { real: 'feather (Din Round)', heb: 'Varela Round', family: 'Varela+Round', why: 'עגול וידידותי, אותו משקל אופטי' },
  wise: { real: 'Wise Sans', heb: 'Heebo', family: 'Heebo:wght@400;500;700;800;900', why: 'גרוטסק כבד עם סופים ישרים' },
  monzo: { real: 'MonzoSansText/Display', heb: 'Rubik', family: 'Rubik:wght@400;500;600;700;800', why: 'גרוטסק עם פינות רכות' },
};

/* חריגות-קריאוּת: טקסט קטן שהמדידה נתנה לו ניגודיות נמוכה מ-4.5.
   בכל מקרה נבחר גוון אחר **מהפלטה של אותו אתר עצמו**, לא צבע חדש. */
export const SWAPS = [
  { site: 'raycast', what: 'טקסט שלישוני', measured: '#6a6b6c', ratio: 3.75, used: '#9c9c9d', from: 'palette.ink[1] של אותו אתר' },
  { site: 'duolingo', what: 'טקסט אפור', measured: '#777777', ratio: 4.48, used: '#4b4b4b', from: 'palette.ink של אותו אתר' },
  { site: 'duolingo', what: 'הירוק כטקסט (גם הלוגו)', measured: '#58cc02 · #ffffff עליו', ratio: 2.09, used: '#58cc02 כמילוי · #0d2600 כדיו', from: 'הכהיית הירוק המדוד עצמו' },
  { site: 'duolingo', what: 'התכלת כטקסט', measured: '#1cb0f6', ratio: 2.44, used: '#0b3e71', from: 'palette של אותו אתר — כחול מדוד, לא הכהיה' },
  { site: 'spotify', what: 'הירוק כטקסט', measured: '#1ed760', ratio: 1.92, used: '#1ed760 כמילוי בלבד', from: 'נשאר מילוי, לא טקסט' },
  { site: 'monzo', what: 'הקורל כטקסט', measured: '#ff4f40', ratio: 3.26, used: '#ff4f40 כמילוי · #091723 כדיו', from: 'palette.ink[0] של אותו אתר' },
  { site: 'monzo', what: 'האפור הבהיר כטקסט', measured: '#75817e', ratio: 3.99, used: '#3b4c54', from: 'palette של אותו אתר' },
];

export const TOK = {
  /* ── Raycast ── מדוד ב-raycast·www.raycast.com ו-…-store ── */
  raycast: {
    name: 'Raycast', src: ['raycast·www.raycast.com', 'raycast·www.raycast.com-store'],
    bg: pick('raycast·www.raycast.com.body.bg', '#07080a'),            // #07080a
    card: '#0c0d0f',                                                    // palette.bg של דף-החנות
    row: '#1b1c1e',                                                     // palette.bg[4]
    raise: '#434345',                                                   // palette.bg[1]
    ink: '#ffffff',                                                     // body.color
    mut: '#9c9c9d',                                                     // palette.ink[1]
    dim: '#6a6b6c',                                                     // palette.ink[2] — קישוט בלבד (ראה SWAPS)
    hair: '#2f3031',                                                    // palette.ink[4] · גם border המדוד
    acc: '#e6e6e6', accInk: '#2f3031',                                  // הכפתור הראשי המדוד: bg #e6e6e6 / color #2f3031
    r: 8, rCard: 12, rSmall: 6,                                         // radii: 8×23 · 12×23 · 6×13
    gap: 8, gap2: 16,                                                   // gaps: 8×79 · 16×12
    btn: { h: 36, padY: 8, padX: 12, size: 14, weight: 500, radius: 8 },
    btnGhost: { h: 32, padY: 8, padX: 8, size: 14, weight: 500, radius: 8, shadow: 'rgba(255,255,255,.05) 0 1px 0 0 inset' },
    body: { size: 16, lh: 1.15 },                                       // body.size 16 · lh 18.4px
    h1: { size: 64, weight: 600, lh: 1.1, ls: '0' },                    // type.h1
  },

  /* ── Spotify ── מדוד ב-open.spotify.com ו-www.spotify.com ── */
  spotify: {
    name: 'Spotify', src: ['spotify·open.spotify.com', 'spotify·www.spotify.com'],
    bg: '#000000', card: '#121212', row: '#181818', raise: '#333333',   // palette.bg
    ink: '#ffffff', mut: '#b3b3b3', dim: '#535353',                     // body.color · palette.ink
    hair: '#333333',
    acc: '#1ed760', accInk: '#000000',                                  // palette.bg[5] — הירוק המדוד
    r: 8, rCard: 8, rArt: 6, rPill: 9999,                               // radii: 9999 · 6 · 8
    gap: 8, gap2: 24,
    btn: { h: 48, padY: 12, padX: 24, size: 16, weight: 700, radius: 9999 },
    card2: { bg: '#181818', radius: 8, padding: 16 },                   // cards[0] של www
    art: { bg: '#333333', radius: 6, shadow: 'rgba(0,0,0,.5) 0 8px 24px 0' },
    body: { size: 16, lh: 1.5 },
    h1: { size: 32, weight: 700, lh: 1.15, ls: '0' },
  },

  /* ── Duolingo ── מדוד ב-duolingo ── */
  duolingo: {
    name: 'Duolingo', src: ['duolingo·www.duolingo.com', 'duolingo·design.duolingo.com', 'duolingo·blog.duolingo.com', 'duolingo·www.duolingo.com-courses'],
    bg: '#ffffff', card: '#ffffff', row: '#f7f7f7', raise: '#e5e5e5',
    ink: '#3c3c3c',                                                     // body.color
    mut: '#4b4b4b', dim: '#777777',                                     // palette.ink[4] · [1] (ראה SWAPS)
    hair: '#e5e5e5',
    acc: '#58cc02', accInk: '#0d2600', accDark: '#46a302',              // palette.bg[0]
    accLight: '#a5ed6e', accPale: '#d7ffb8',                            // palette.ink[0] · [3]
    navy: '#100f3e', blue: '#1cb0f6', blueInk: '#0b3e71', deep: '#042c60',               // palette.bg[1] · כפתור-משנה
    r: 12, rCard: 12, rPill: 999,                                       // radii: 12×7 (הרדיוס היחיד שנמדד)
    gap: 10, gap2: 24,                                                  // gaps: 10×8 · 24×7
    btn: { h: 50, padY: 0, padX: 16, size: 15, weight: 700, radius: 12, transform: 'uppercase', border: 2 },
    body: { size: 17, lh: 20 / 17 },                                    // body.size 17 · lh 20px
    h1: { size: 64, weight: 700, lh: 1.05, ls: '-1.28px' },             // type.h1 · ls מדוד
  },

  /* ── Wise ── מדוד ב-wise ── */
  wise: {
    name: 'Wise', src: ['wise·wise.com', 'wise·wise.com-gb-pricing', 'wise·wise.com-help'],
    bg: '#ffffff', card: '#ffffff', row: '#f7f5f0', raise: '#e0f7f7',   // palette.bg[3]
    ink: '#163300',                                                     // palette.ink[0]
    mut: '#454745',                                                     // body.color
    dim: '#0e0f0c',                                                     // palette.ink[2]
    hair: '#dcdad0',
    acc: '#9fe870', accInk: '#163300',                                  // palette.bg[1] + הכפתור המדוד
    dark: '#163300', neg: '#cf2929',                                    // כרטיס-כהה מדוד · palette.ink[4]
    r: 19, rCard: 28, rPill: 9999,                                      // radii: 19×30 · 28×13 · 9999×122
    gap: 9, gap2: 28,                                                   // gaps: 9×43 · 28×10
    btn: { h: 48, padY: 11, padX: 24, size: 16, weight: 600, radius: 9999 },
    btnText: { h: 40, padY: 8, padX: 12, size: 18, weight: 600, radius: 19 },
    card2: { radius: 28, padding: 28 },                                 // cards[0]/[1]
    body: { size: 18, lh: 26 / 18 },                                    // body.size 18 · lh 26px
    h1: { size: 64, weight: 900, lh: 0.85, ls: '0' },                   // type.h1 89/900 — הוקטן לעברית, המשקל נשמר
  },

  /* ── Monzo ── מדוד ב-monzo ── */
  monzo: {
    name: 'Monzo', src: ['monzo·monzo.com', 'monzo·monzo.com-current-account', 'monzo·monzo.com-blog'],
    bg: '#ffffff', card: '#ffffff', row: '#f2f8f3', raise: '#efefef',   // palette.bg[1] — המנטה של מונזו
    ink: '#091723',                                                     // palette.ink[0]
    mut: '#3d4a57', dim: '#5f6875',
    hair: '#e6e4e1',
    acc: '#ff4f40', accInk: '#2b0c08',                                  // palette.bg[3] — הקורל המדוד
    navy: '#112231', dark: '#091723',                                   // palette.bg[2] · הכפתור המדוד
    mint: '#f2f8f3',
    r: 16, rCard: 32, rBig: 64, rPill: 128,                             // radii: 4 · 128 · 32 · 64 · 16
    gap: 8, gap2: 24,                                                   // gaps: 8×40 · 16×34 · 24×29
    btn: { h: 48, padY: 0, padX: 24, size: 16, weight: 400, radius: 128 },
    btnLine: { h: 36, padY: 0, padX: 16, size: 13, weight: 400, radius: 128, border: 2 },
    card2: { radius: 32, padding: 32, padX: 24, border: 2 },            // cards[0]
    body: { size: 16, lh: 22.4 / 16 },                                  // body.size 16 · lh 22.4px
    h1: { size: 49, weight: 800, lh: 1.2, ls: '0' },                    // type.h1
  },
};

/* בלוק-טוקנים ל-CSS — נכתב לכל מסך כדי שהערכים יהיו במקום אחד ובר-בדיקה */
export const rootCss = (k) => {
  const t = TOK[k], f = FACE[k];
  return `:root{
 --bg:${t.bg};--card:${t.card};--row:${t.row};--raise:${t.raise};
 --ink:${t.ink};--mut:${t.mut};--dim:${t.dim};--hair:${t.hair};
 --acc:${t.acc};--accInk:${t.accInk};
 --r:${t.r}px;--rCard:${t.rCard}px;${t.rPill ? `--rPill:${t.rPill}px;` : ''}
 --gap:${t.gap}px;--gap2:${t.gap2}px;
 --face:'${f.heb.split(' + ')[0]}';
 --btnH:${t.btn.h}px;--btnPadY:${t.btn.padY}px;--btnPadX:${t.btn.padX}px;
 --btnSize:${t.btn.size}px;--btnWeight:${t.btn.weight};--btnRadius:${t.btn.radius}px;
 --bodySize:${t.body.size}px;--bodyLh:${t.body.lh};
 --h1Size:${t.h1.size}px;--h1Weight:${t.h1.weight};--h1Lh:${t.h1.lh};--h1Ls:${t.h1.ls}}`;
};
