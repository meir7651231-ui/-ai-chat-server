/** קופסת-חיבורים · lib-pwa — רישום service-worker + מצב-התקנה + מניפסט פר-ארגון.
 *  חוזה: lib-pwa.contract.md · מוצא: maor/src/lib/pwa.ts (עוגני-שורה בחוזה).
 *  מחווטת חוטים טהורים (install-available/prompt-install/is-ios/feature-on);
 *  ההכרעות (סדר-שערים · ברירות-מניפסט · צבעים · אייקונים) חיות כאן; כל נגיעת-דפדפן
 *  (window/navigator/document/serviceWorker/Blob/import.meta.env) = שקע מוזרק (חוק-1/5/6). */
import { installAvailable as atomInstallAvailable } from '../atoms/install-available.mjs';
import { promptInstall as atomPromptInstall } from '../atoms/prompt-install.mjs';
import { isIos as __pure_isIos } from '../atoms/is-ios.mjs';
import { IS_IOS_T as __d_isIos_IS_IOS_T } from '../atoms/is-ios-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const atomIsIos = (...a) => __pure_isIos(...a, ...Array(Math.max(0, 0 - a.length)).fill(undefined), __d_isIos_IS_IOS_T);
import { featureOn } from '../atoms/feature-on.mjs';

// ── מילון-הקופסה: הכרעות (pwa.ts:57-108) — סדר/ברירות-מחדל/צבעים/אייקונים ──
const PWA_FLAG = 'shell.pwa';        // הדגל השולט על הרישום (pwa.ts:62)
const SW_FILE = 'sw.js';             // שם קובץ ה-service-worker (pwa.ts:61)
const SHORT_NAME_MAX = 12;           // סף short_name (pwa.ts:90)
const MANIFEST_TYPE = 'application/manifest+json'; // (pwa.ts:106)
const MANIFEST_LANG = 'he';
const MANIFEST_DIR = 'rtl';
const MANIFEST_DISPLAY = 'standalone';
const MANIFEST_ORIENTATION = 'portrait-primary';
const MANIFEST_THEME = '#211d17';
const MANIFEST_BG = '#faf7f2';
const ICON_TYPE = 'image/png';

// ── 1) installAvailable — חוט install-available, מצב-המודול (deferredInstall) מוזרק ──
export const installAvailable = atomInstallAvailable;

// ── 2) promptInstall — חוט prompt-install; האיפוס-אחרי-שימוש = חיווט-קופסה ──
export const promptInstall = atomPromptInstall;

// ── 3) isIos — חוט is-ios (קורא navigator הגלובלי, נאמן-למקור pwa.ts:53-55) ──
export const isIos = atomIsIos;

// ── 4) isStandalone — לא-טהור, שקעי window+navigator מוזרקים (pwa.ts:46-50) ──
export function isStandalone({ window: win, navigator: nav } = {}) {
  if (!win) return false;
  return win.matchMedia?.('(display-mode: standalone)').matches === true ||
    nav?.standalone === true;
}

// ── 5) registerPwa — לא-טהור, שקעי-IO מוזרקים (pwa.ts:57-72) ──
export function registerPwa(config, io = {}) {
  const { navigator: nav, isProd, baseUrl, href, navModuleKeys = [], moduleOn = () => true } = io;
  if (!nav || !('serviceWorker' in nav)) return;      // pwa.ts:58
  if (nav.webdriver) return;                          // pwa.ts:59 — סוויטת-דפדפן
  if (!isProd) return;                                // pwa.ts:60 — לא נלחמים ב-HMR
  const swUrl = new URL(baseUrl + SW_FILE, href).href; // pwa.ts:61
  if (!featureOn(config, PWA_FLAG, navModuleKeys, moduleOn)) {
    // מתג-חירום (pwa.ts:63-67): מסיר רק את הרישום שלנו (scriptURL===swUrl)
    void nav.serviceWorker.getRegistrations().then((regs) => {
      for (const r of regs) if (r.active?.scriptURL === swUrl) void r.unregister();
    });
    return;
  }
  void nav.serviceWorker.register(swUrl).catch(() => {
    /* רישום נכשל (דפדפן ישן/מצב-פרטי) — האתר ממשיך כרגיל (pwa.ts:69-71) */
  });
}

// ── מניפסט (טהור): סדר-המפתחות והערכים הם ההכרעה, חיים כאן (pwa.ts:88-104) ──
export function buildManifest(name, slug, base) {
  return {
    name,
    short_name: name.length > SHORT_NAME_MAX ? name.slice(0, SHORT_NAME_MAX) : name,
    lang: MANIFEST_LANG,
    dir: MANIFEST_DIR,
    start_url: base + '?org=' + encodeURIComponent(slug),
    scope: base,
    display: MANIFEST_DISPLAY,
    orientation: MANIFEST_ORIENTATION,
    theme_color: MANIFEST_THEME,
    background_color: MANIFEST_BG,
    icons: [
      { src: base + 'icons/icon-192.png', sizes: '192x192', type: ICON_TYPE },
      { src: base + 'icons/icon-512.png', sizes: '512x512', type: ICON_TYPE },
      { src: base + 'icons/icon-maskable-512.png', sizes: '512x512', type: ICON_TYPE, purpose: 'maskable' },
    ],
  };
}

// ── 6) applyOrgManifest — לא-טהור, שקעי-DOM+state מוזרקים (pwa.ts:80-108) ──
export function applyOrgManifest(config, io = {}) {
  const { document: doc, baseUrl, href, createObjectURL, revokeObjectURL, makeBlob, state } = io;
  if (!doc) return;                                    // pwa.ts:81
  const link = doc.querySelector('link[rel="manifest"]'); // pwa.ts:82
  if (!link) return;                                   // pwa.ts:83
  const slug = config.slug || 'default';               // pwa.ts:84
  const name = (config.orgName || '').trim();          // pwa.ts:85
  if (slug === 'default' || !name) return;             // pwa.ts:86 — אתר-השורש
  const base = new URL(baseUrl, href).href;            // pwa.ts:87
  const manifest = buildManifest(name, slug, base);
  if (state.orgManifestUrl) revokeObjectURL(state.orgManifestUrl); // pwa.ts:105
  state.orgManifestUrl = createObjectURL(makeBlob(JSON.stringify(manifest), MANIFEST_TYPE)); // pwa.ts:106
  link.setAttribute('href', state.orgManifestUrl);     // pwa.ts:107
}
