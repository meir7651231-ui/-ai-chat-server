import '../dart-data-maor/site-vocab-terms.dart';
// 📦 קופסת-חיבורים · public-site (lib-publicSite) · ליבה-טהורה (Dart) —
// מקבילה זהה-ביט ל-new/boxes/public-site.mjs. חוזה משותף: public-site.contract.md.
// מקור-האמת: maor/src/lib/publicSite.ts (11 חוטים).
// זו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
//
// ⚠️ שקעי-IO (חוק-6): החוט היחיד עם שקע הוא campaign(c, nowMs) — nowMs (מס' Date.now
//   של הקורא) מוזרק ע"י הקורא, לא נקרא פנימית. אין DOM/IO אחר בקופסה זו — כולה גזרים
//   טהורים חוצי-שפות. (מגן-מקור-ה-JS + בדיקת-Date.now של בדיקת-ה-JS = תלויי-JS ⇒ מדולגים.)
import '../dart-maor/is-rtl-lang.dart' as irl;
import '../dart-maor/coral-palette.dart' as cp;
import '../dart-maor/site-palette.dart' as sp;
import '../dart-maor/site-vocab.dart' as sv;
import '../dart-maor/resolve-localized.dart' as rl; // resolveLocalized + siteLangs(=SITE_LANGS)
import '../dart-maor/site-langs.dart' as sl; // siteLangs(site, knownLangs)
import '../dart-maor/site-ui.dart' as su;
import '../dart-maor/site-ui-labels.dart' as sul; // siteUiLabels(=SITE_UI_LABELS)
import '../dart-maor/site-campaign-progress.dart' as scp;
import '../dart-maor/has-public-site.dart' as hps;
import '../dart-maor/site-donate-url.dart' as sdu;

// ── שקעי-נתונים (הכרעות-הקופסה — חיות כאן, לא בחוטים; verbatim מהמקור) ──────────
// פלטת-הנפילה כשאין accent = הקורל המקורי (chesed ביט-זהה) — הכרעת-החיווט.
final FALLBACK_PALETTE = cp.coralPalette; // ignore: non_constant_identifier_names
// מילון-השפות-המוכר + מילון-התוויות פר-שפה — אותם קבועים שהמקור מזין לחוטים.
final KNOWN_LANGS = rl.siteLangs; // ignore: non_constant_identifier_names  (=SITE_LANGS)
final UI = sul.siteUiLabels; // ignore: non_constant_identifier_names

// ── החיווט ─────────────────────────────────────────────────────────────────────
bool isRtl(String lang) => irl.isRtlLang(lang);
dynamic palette([dynamic accent]) => sp.sitePalette(accent, FALLBACK_PALETTE);
dynamic vocab(dynamic commercial, dynamic lang) => sv.siteVocab(commercial, lang, term: (k)=>kTerms[k]!);
String localize(dynamic t, dynamic lang) => rl.resolveLocalized(t, lang);
dynamic langs(dynamic site) => sl.siteLangs(site, KNOWN_LANGS);
dynamic ui(dynamic lang, dynamic key) => su.siteUi(lang, key, UI);
// nowMs = שקע-IO (מוזרק ע"י הקורא) — לא Date.now פנימי.
Map<String, dynamic> campaign(dynamic c, dynamic nowMs) => scp.campaignProgress(c, nowMs);
bool hasSite(Map config) => hps.hasPublicSite(config);
dynamic donateUrl(dynamic config) => sdu.siteDonateUrl(config);

// ── חשיפת-קבועים לקריאה (הרכיב PublicSite.tsx צורך גם אותם ישירות) ──────────────
final LANGS = rl.siteLangs; // ignore: non_constant_identifier_names  (=SITE_LANGS)
final UI_LABELS = sul.siteUiLabels; // ignore: non_constant_identifier_names
final CORAL = cp.coralPalette; // ignore: non_constant_identifier_names
