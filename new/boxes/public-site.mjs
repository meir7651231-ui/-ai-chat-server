/** קופסת-חיבורים · האתר-הציבורי (lib-publicSite) — מחווטת את חוטי-מנוע-האתר.
 *  חוזה: public-site.contract.md · זה המקום היחיד שבו החוטים נפגשים (LAW.md).
 *  מקור-האמת: maor/src/lib/publicSite.ts (11 חוטים).
 *
 *  שקעי-IO אמיתיים (מוזרקים ע"י הקורא, לא ממומשים כאן):
 *   · nowMs (מס' — Date.now של הקורא) ⇒ ספירת-הימים של campaign(); טהור/בדיק. */
import { isRtlLang } from '../atoms/is-rtl-lang.mjs';
import { CORAL_PALETTE } from '../atoms/coral-palette.mjs';
import { sitePalette } from '../atoms/site-palette.mjs';
import { siteVocab } from '../atoms/site-vocab.mjs';
import { resolveLocalized, SITE_LANGS } from '../atoms/resolve-localized.mjs';
import { siteLangs } from '../atoms/site-langs.mjs';
import { siteUi } from '../atoms/site-ui.mjs';
import { SITE_UI_LABELS } from '../atoms/site-ui-labels.mjs';
import { campaignProgress } from '../atoms/site-campaign-progress.mjs';
import { hasPublicSite } from '../atoms/has-public-site.mjs';
import { siteDonateUrl } from '../atoms/site-donate-url.mjs';

// ── שקעי-נתונים (הכרעות-הקופסה — חיות כאן, לא בחוטים) ──
// פלטת-הנפילה כשאין accent = הקורל המקורי (chesed ביט-זהה) — הכרעת-החיווט.
const FALLBACK_PALETTE = CORAL_PALETTE;
// מילון-השפות-המוכר + מילון-התוויות פר-שפה — אותם קבועים שהמקור מזין לחוטים.
const KNOWN_LANGS = SITE_LANGS;
const UI = SITE_UI_LABELS;

// ── החיווט ──
export const isRtl = (lang) => isRtlLang(lang);
export const palette = (accent) => sitePalette(accent, FALLBACK_PALETTE);
export const vocab = (commercial, lang) => siteVocab(commercial, lang);
export const localize = (t, lang) => resolveLocalized(t, lang);
export const langs = (site) => siteLangs(site, KNOWN_LANGS);
export const ui = (lang, key) => siteUi(lang, key, UI);
// nowMs = שקע-IO (מוזרק ע"י הקורא) — לא Date.now פנימי.
export const campaign = (c, nowMs) => campaignProgress(c, nowMs);
export const hasSite = (config) => hasPublicSite(config);
export const donateUrl = (config) => siteDonateUrl(config);

// ── חשיפת-קבועים לקריאה (הרכיב PublicSite.tsx צורך גם אותם ישירות) ──
export const LANGS = SITE_LANGS;
export const UI_LABELS = SITE_UI_LABELS;
export const CORAL = CORAL_PALETTE;
