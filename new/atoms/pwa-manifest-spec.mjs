/** אטום-דאטה · pwa-manifest-spec — הכרעות ה-PWA/מניפסט (הכרעה 19: קונפיג-מניפסט = דאטה).
 *  ערכי W3C-manifest + מפתחות-הרישום; מוזרקים כשקע לקופסת lib-pwa. מקור: maor pwa.ts:57-108.
 *  חוזה: pwa-manifest-spec.contract.md */
export const PWA_FLAG = 'shell.pwa';                   // הדגל השולט על הרישום (pwa.ts:62)
export const SW_FILE = 'sw.js';                        // שם קובץ ה-service-worker (pwa.ts:61)
export const SHORT_NAME_MAX = 12;                      // סף short_name (W3C, pwa.ts:90)
export const MANIFEST_TYPE = 'application/manifest+json'; // MIME של מניפסט (pwa.ts:106)
export const MANIFEST_LANG = 'he';
export const MANIFEST_DIR = 'rtl';
export const MANIFEST_DISPLAY = 'standalone';
export const MANIFEST_ORIENTATION = 'portrait-primary';
export const MANIFEST_THEME = '#211d17';
export const MANIFEST_BG = '#faf7f2';
export const ICON_TYPE = 'image/png';
export const MANIFEST_ICONS = [                        // נתיבי-אייקון יחסיים ל-base (pwa.ts:96-103)
  { src: 'icons/icon-192.png', sizes: '192x192' },
  { src: 'icons/icon-512.png', sizes: '512x512' },
  { src: 'icons/icon-maskable-512.png', sizes: '512x512', purpose: 'maskable' },
];
