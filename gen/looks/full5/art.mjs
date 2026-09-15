/* art.mjs — שכבת-האמנות.
   הפער האמיתי בין המסכים שלנו לאתרים המקוריים לא היה בטוקנים אלא בציור:
   ספוטיפיי מלא בעטיפות-אלבום, דואולינגו באיורים, מונזו בצילום ובכרטיס, רייקאסט
   באייקוני-אפליקציה צבעוniים. באתרים האלה הציור מגיע כתמונה — ולכן הוא ממילא אינו
   חלק מפלטת-הטוקנים שלהם. כאן הוא מצויר, דטרמיניסטית, מאותו זרע של הנתונים.
   כל אלמנט-אמנות נושא data-art, ומכשיר-המדידה מתעלם מצבעיו — בדיוק כפי שהוא
   מתעלם מפיקסלים של תמונה באתר האמיתי. */

const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const rnd = (seed) => { let t = seed >>> 0; return () => { t += 0x6D2B79F5; let x = Math.imul(t ^ t >>> 15, 1 | t); x ^= x + Math.imul(x ^ x >>> 7, 61 | x); return ((x ^ x >>> 14) >>> 0) / 4294967296; }; };
export const seedOf = (k) => rnd(hash(String(k)));

/* ── ספוטיפיי: עטיפת-אלבום. גרדיאנט דו-גוני רווי + הילה, כמו עטיפה אמיתית ── */
export const cover = (key) => {
  const r = seedOf(key);
  const h = Math.floor(r() * 360), h2 = (h + 25 + Math.floor(r() * 70)) % 360;
  const s1 = 62 + Math.floor(r() * 26), l1 = 34 + Math.floor(r() * 16);
  const ang = 120 + Math.floor(r() * 130);
  return `background:` +
    `radial-gradient(120% 90% at ${20 + Math.floor(r() * 60)}% ${10 + Math.floor(r() * 30)}%,hsl(${h2} ${s1}% ${l1 + 18}%) 0%,transparent 62%),` +
    `linear-gradient(${ang}deg,hsl(${h} ${s1}% ${l1}%) 0%,hsl(${h2} ${s1 - 12}% ${Math.max(12, l1 - 20)}%) 100%)`;
};

/* ── רייקאסט: אייקון-אפליקציה. ריבוע מעוגל עם גרדיאנט והדגשה פנימית ── */
export const appIcon = (key) => {
  const r = seedOf(key);
  const h = Math.floor(r() * 360);
  return `background:linear-gradient(160deg,hsl(${h} 72% 58%),hsl(${(h + 34) % 360} 70% 42%));` +
    `box-shadow:inset 0 1px 0 hsl(${h} 90% 78% / .65),0 1px 2px rgb(0 0 0 / .5)`;
};

/* ── מונזו: כרטיס-האשראי הקורלי, הדבר המצויר המזוהה ביותר של מונזו ── */
/* המסמך כולו RTL — טקסט בתוך ה-SVG חייב כיוון מפורש, אחרת הספרות מתהפכות */
export const monzoCard = (last4) => `<svg data-art class="cardart" viewBox="0 0 340 214" role="img" aria-label="כרטיס המוסד" style="direction:ltr">
 <defs><linearGradient id="mc" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#ff6a52"/><stop offset=".55" stop-color="#ff4f40"/><stop offset="1" stop-color="#e03a2e"/></linearGradient>
 <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe9a8"/><stop offset="1" stop-color="#d6a640"/></linearGradient></defs>
 <rect width="340" height="214" rx="16" fill="url(#mc)"/>
 <rect x="24" y="64" width="44" height="34" rx="6" fill="url(#mg)"/>
 <path d="M32 72h28M32 81h28M32 90h28" stroke="#c99a3c" stroke-width="1.5"/>
 <circle cx="300" cy="44" r="52" fill="#ffffff" opacity=".07"/>
 <circle cx="272" cy="150" r="34" fill="#ffffff" opacity=".05"/>
 <text x="24" y="150" fill="#ffffff" font-family="Rubik,Arial" font-size="19" letter-spacing="2.5">•••• •••• •••• ${last4}</text>
 <text x="24" y="182" fill="#ffffff" font-family="Rubik,Arial" font-size="13" opacity=".85">MOSAD · TZEDAKA</text>
 <text x="286" y="182" fill="#ffffff" font-family="Rubik,Arial" font-size="13" opacity=".85">12/29</text>
</svg>`;

/* ── דואולינגו: איור שטוח. דמות עגלגלה על רקע עלה — אותו אוצר-צורות של האיורים ── */
const FIG = [
  { skin: '#f6c89a', shirt: '#ff9f43', hair: '#4b3a2f' },
  { skin: '#e8b07d', shirt: '#4aa3f0', hair: '#2b2b2b' },
  { skin: '#f3d3b3', shirt: '#ef5da8', hair: '#8a4b2a' },
  { skin: '#d79a6a', shirt: '#7ad1c0', hair: '#1f1f1f' },
];
export const scene = (key, w = 300, h = 220) => {
  const r = seedOf(key), f = FIG[Math.floor(r() * FIG.length)];
  const tilt = (r() * 16 - 8).toFixed(1);
  return `<svg data-art class="scene" viewBox="0 0 ${w} ${h}" role="img" aria-label="איור">
 <ellipse cx="${w * .5}" cy="${h * .86}" rx="${w * .34}" ry="12" fill="#000" opacity=".07"/>
 <path d="M${w * .18} ${h * .74} q${w * .12} -${h * .5} ${w * .40} -${h * .44} q-${w * .06} ${h * .42} -${w * .40} ${h * .44} z" fill="#a5ed6e"/>
 <path d="M${w * .22} ${h * .70} q${w * .16} -${h * .34} ${w * .32} -${h * .34}" stroke="#58cc02" stroke-width="4" fill="none" stroke-linecap="round"/>
 <g transform="translate(${w * .54} ${h * .20}) rotate(${tilt})">
  <rect x="0" y="52" width="82" height="86" rx="30" fill="${f.shirt}"/>
  <rect x="-22" y="70" width="34" height="18" rx="9" fill="${f.skin}"/>
  <rect x="70" y="70" width="34" height="18" rx="9" fill="${f.skin}"/>
  <circle cx="41" cy="34" r="31" fill="${f.skin}"/>
  <path d="M10 26a31 31 0 0 1 62 0q-31 -16 -62 0z" fill="${f.hair}"/>
  <circle cx="31" cy="36" r="4" fill="#1f1f1f"/><circle cx="53" cy="36" r="4" fill="#1f1f1f"/>
  <path d="M33 48q8 7 16 0" stroke="#1f1f1f" stroke-width="3" fill="none" stroke-linecap="round"/>
 </g>
 <circle cx="${w * .86}" cy="${h * .22}" r="13" fill="#1cb0f6" opacity=".9"/>
 <circle cx="${w * .12}" cy="${h * .24}" r="9" fill="#ff9f43" opacity=".9"/>
</svg>`;
};

/* ── וייז: מטבע-דגל. עיגול עם טריז צבע — הצורה שוייז משתמשת בה לכל מטבע ── */
const FLAG = [['#0b3d91', '#ffffff'], ['#cf2929', '#ffffff'], ['#163300', '#9fe870'], ['#1b6b4a', '#ffffff'], ['#8a5a00', '#ffe9a8'], ['#3b2f8a', '#e0f7f7']];
export const coin = (key, label) => {
  const r = seedOf(key), [a, b] = FLAG[Math.floor(r() * FLAG.length)];
  return `<svg data-art class="coin" viewBox="0 0 40 40" role="img" aria-label="${label}">
 <circle cx="20" cy="20" r="20" fill="${a}"/><path d="M20 0a20 20 0 0 1 0 40z" fill="${b}" opacity=".9"/>
 <circle cx="20" cy="20" r="20" fill="none" stroke="#000" stroke-opacity=".08"/></svg>`;
};

/* ── רייקאסט: הילת-הגיבור. הזוהר שמאחורי חלון-הפקודות באתר ── */
export const glow = () => `<div data-art class="glow" aria-hidden="true"></div>`;
