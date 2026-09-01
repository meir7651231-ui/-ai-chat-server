/** קופסת-חיבורים · תמחור (lib-pricing) — מחווטת את חוטי-התמחור. חוזה: pricing.contract.md
 *  זה המקום היחיד שבו חוטי-התמחור נפגשים (חוקי-החשמלאי, LAW.md).
 *  מוצא: maor/src/lib/pricing.ts (גרף-הקריאות המלא). */
import { defaultPrices as __pure_defaultPrices } from '../atoms/default-prices.mjs';
import { DEFAULT_PRICES_T as __d_default_prices_T } from '../atoms/default-prices-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const defaultPrices = (...a) => __pure_defaultPrices(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_default_prices_T);
import { SIZE_LABELS } from '../atoms/size-labels.mjs';
import { normalizePrices as __pure_normalizePrices } from '../atoms/normalize-prices.mjs';
import { NORMALIZE_PRICES_T as __d_normalizePrices_NORMALIZE_PRICES_T } from '../atoms/normalize-prices-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const normalizePrices = (...a) => __pure_normalizePrices(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_normalizePrices_NORMALIZE_PRICES_T);
import { computeQuote as __pure_computeQuote } from '../atoms/compute-quote.mjs';
import { COMPUTE_QUOTE_T as __d_computeQuote_COMPUTE_QUOTE_T } from '../atoms/compute-quote-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const computeQuote = (...a) => __pure_computeQuote(...a, ...Array(Math.max(0, 7 - a.length)).fill(undefined), __d_computeQuote_COMPUTE_QUOTE_T);
import { shekel as __pure_shekel } from '../atoms/shekel.mjs';
import { SHEKEL_T as __d_shekel_SHEKEL_T } from '../atoms/shekel-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const shekel = (...a) => __pure_shekel(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_shekel_SHEKEL_T);
import { ALL_MODULES } from '../atoms/all-modules.mjs';
import { DEFAULT_INTEGRATION_PRICES } from '../atoms/integration-prices.mjs';
import { DEFAULT_QUOTE_MODE } from '../atoms/pricing-default-mode.mjs';

// ── שקעי-הכרעה (מילון-הקופסה — נתון-בעלים עריך, חי כאן ולא באטומים) ──
// מחירי-ברירת-המחדל להרחבות (maor/src/lib/pricing.ts:36-49) — placeholder עריך
// שהבעלים דורס באשף. המפתחות = INTEGRATION_LABELS.

// חוק-6: מפתח-אחסון-מקומי (namespace-זהות, לא נתון-דומיין) — maor/src/lib/pricing.ts:192
const PRICES_LS_KEY = 'maor_prices';

// ── החיווט ──
// טבלת-ברירת-המחדל המלאה: החוט defaultPrices מקבל את מילון-ההרחבות כשקע.
// (זה ה-DEFAULT_PRICES של המקור — pricing.ts:57-74.)
export const DEFAULT_PRICES = defaultPrices(DEFAULT_INTEGRATION_PRICES);

// תוויות-הגודל — מוגשות כמו-שהן מהאטום (pricing.ts:76-80).
export const sizeLabels = SIZE_LABELS;

// עיצוב-שקל — מוגש כמו-שהוא מהאטום (pricing.ts:188-190).
export { shekel };

// נירמול טבלת-מחירים לא-אמינה: החוט normalizePrices מקבל את שלוש טבלאות-הידע
// כשקעים (pricing.ts:122-146). ALL_MODULES מהאטום; DEFAULT_PRICES/מילון-ההרחבות
// מהחיווט לעיל.
export const normalize = (raw) =>
  normalizePrices(raw, ALL_MODULES, DEFAULT_PRICES, DEFAULT_INTEGRATION_PRICES);

// חישוב הצעת-מחיר: החוט computeQuote מקבל את ALL_MODULES כשקע (pricing.ts:152-185).
// nameOf היה כבר פרמטר במקור (מכבד termOf של הלקוח).
export const quote = (cfg, size, prices, nameOf, addons = [], mode = DEFAULT_QUOTE_MODE) =>
  computeQuote(cfg, size, prices, nameOf, ALL_MODULES, addons, mode);

// ── שקעי-IO (localStorage — פרמטרים-מוזרקים, לא מימוש) ──
// קריאת טבלת-המחירים השמורה (מכשיר-המטמיע), או ברירת-המחדל (pricing.ts:194-202).
// getItem(key)⇒string|null — שקע-הקריאה המוזרק (במקור: localStorage.getItem).
export function readPrices(getItem) {
  try {
    const raw = getItem(PRICES_LS_KEY);
    return raw ? normalize(JSON.parse(raw)) : { ...DEFAULT_PRICES };
  } catch {
    return { ...DEFAULT_PRICES };
  }
}

// שמירת טבלת-המחירים (מקומית — לא בקונפיג-הלקוח, לא בענן) (pricing.ts:205-211).
// setItem(key,value)⇒void — שקע-הכתיבה המוזרק (במקור: localStorage.setItem).
export function writePrices(setItem, p) {
  try {
    setItem(PRICES_LS_KEY, JSON.stringify(p));
  } catch {
    /* localStorage חסום — המחירים יחזיקו עד רענון */
  }
}
