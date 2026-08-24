/** בדיקת-קצה: קופסת lib-pwa — כל 6 החשיפות דרך הקופסה בלבד (מותר לייבא רק אותה).
 *  DoD: `node lib-pwa.test.mjs` ⇒ exit 0. */
import { installAvailable, promptInstall, isIos, isStandalone, registerPwa, applyOrgManifest, buildManifest } from './lib-pwa.mjs';
import { readFileSync } from 'node:fs';
let f = 0;
const eq = (a, b, msg) => { if (a !== b) { console.error(`✗ ${msg} ⇒ got ${JSON.stringify(a)} want ${JSON.stringify(b)}`); f = 1; } };

// ── 1) installAvailable ──
eq(installAvailable(null), false, 'installAvailable(null)');
eq(installAvailable({}), true, 'installAvailable({})');
eq(installAvailable({ prompt() {}, userChoice: Promise.resolve({}) }), true, 'installAvailable(event)');

// ── 2) promptInstall ──
{
  eq(await promptInstall(null), false, 'promptInstall(null)');
  let called = 0;
  const acc = { prompt() { called++; }, userChoice: Promise.resolve({ outcome: 'accepted' }) };
  eq(await promptInstall(acc), true, 'promptInstall accepted');
  eq(called, 1, 'promptInstall קרא prompt פעם-אחת');
  eq(await promptInstall({ prompt() {}, userChoice: Promise.resolve({ outcome: 'dismissed' }) }), false, 'promptInstall dismissed');
  eq(await promptInstall({ prompt() {}, userChoice: Promise.resolve({ outcome: 'unknown' }) }), false, 'promptInstall outcome-זר');
}

// ── 3) isIos (קורא navigator גלובלי — נאמן-למקור) ──
const savedNav = globalThis.navigator;
try {
  delete globalThis.navigator;
  eq(isIos(), false, 'isIos בלי navigator');
  globalThis.navigator = { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)' };
  eq(isIos(), true, 'isIos על iPhone');
  globalThis.navigator = { userAgent: 'Mozilla/5.0 (Windows NT 10.0) Firefox/120' };
  eq(isIos(), false, 'isIos על דסקטופ');
} finally { if (savedNav === undefined) delete globalThis.navigator; else globalThis.navigator = savedNav; }

// ── 4) isStandalone (שקעים מוזרקים) ──
eq(isStandalone({}), false, 'isStandalone בלי window');
eq(isStandalone({ window: { matchMedia: () => ({ matches: true }) } }), true, 'isStandalone matchMedia');
eq(isStandalone({ window: { matchMedia: () => ({ matches: false }) }, navigator: { standalone: true } }), true, 'isStandalone iOS-standalone');
eq(isStandalone({ window: { matchMedia: () => ({ matches: false }) }, navigator: { standalone: false } }), false, 'isStandalone לא-מותקן');
eq(isStandalone({ window: {} }), false, 'isStandalone בלי matchMedia (?.)');

// ── 5) registerPwa (navigator-מזויף מרגל) ──
function spyNav({ hasSW = true, webdriver = false, existing = [] } = {}) {
  const log = [];
  const nav = { webdriver };
  if (hasSW) nav.serviceWorker = {
    register: (u) => { log.push(['register', u]); return { catch: () => {} }; },
    getRegistrations: () => Promise.resolve(existing.map((url) => ({ active: { scriptURL: url }, unregister: () => log.push(['unregister', url]) }))),
  };
  return { nav, log };
}
const cfg = { features: {} };
{
  const { nav, log } = spyNav({ hasSW: false });
  registerPwa(cfg, { navigator: nav, isProd: true, baseUrl: '/', href: 'https://s.co/' });
  eq(log.length, 0, 'registerPwa בלי serviceWorker — אפס');
}
{
  const { nav, log } = spyNav({ webdriver: true });
  registerPwa(cfg, { navigator: nav, isProd: true, baseUrl: '/', href: 'https://s.co/' });
  eq(log.length, 0, 'registerPwa webdriver — אפס');
}
{
  const { nav, log } = spyNav();
  registerPwa(cfg, { navigator: nav, isProd: false, baseUrl: '/', href: 'https://s.co/' });
  eq(log.length, 0, 'registerPwa !isProd — אפס');
}
{
  const { nav, log } = spyNav();
  registerPwa(cfg, { navigator: nav, isProd: true, baseUrl: '/app/', href: 'https://s.co/x' });
  eq(JSON.stringify(log), JSON.stringify([['register', 'https://s.co/app/sw.js']]), 'registerPwa דגל-דלוק ⇒ register(swUrl)');
}
{
  const off = { features: { 'shell.pwa': false } };
  const { nav, log } = spyNav({ existing: ['https://s.co/sw.js', 'https://s.co/other.js'] });
  registerPwa(off, { navigator: nav, isProd: true, baseUrl: '/', href: 'https://s.co/' });
  await Promise.resolve(); await Promise.resolve();
  eq(JSON.stringify(log), JSON.stringify([['unregister', 'https://s.co/sw.js']]), 'registerPwa מתג-חירום ⇒ unregister רק-שלנו');
}

// ── 6) buildManifest + applyOrgManifest ──
{
  const m = buildManifest('מאור', 'maor', '/x/');
  eq(JSON.stringify(Object.keys(m)), JSON.stringify(['name', 'short_name', 'lang', 'dir', 'start_url', 'scope', 'display', 'orientation', 'theme_color', 'background_color', 'icons']), 'buildManifest סדר-מפתחות');
  eq(m.start_url, '/x/?org=maor', 'buildManifest start_url');
  eq(m.short_name, 'מאור', 'buildManifest short_name קצר');
  eq(buildManifest('אבגדהוזחטיכלמנ', 'x', '/').short_name, 'אבגדהוזחטיכל', 'buildManifest short_name ארוך⇒12');
  eq(m.theme_color, '#211d17', 'buildManifest theme_color');
  eq(m.icons.length, 3, 'buildManifest 3 אייקונים');
  eq(m.icons[2].purpose, 'maskable', 'buildManifest maskable');
}
// applyOrgManifest — שקעי-DOM מזויפים
function fakeIo(state) {
  const link = { href: null, setAttribute(k, v) { if (k === 'href') this.href = v; } };
  const blobs = [];
  return {
    link,
    blobs,
    io: {
      document: { querySelector: () => link },
      baseUrl: '/', href: 'https://s.co/',
      makeBlob: (s) => ({ s }),
      createObjectURL: (b) => { blobs.push(b.s); return 'blob:' + blobs.length; },
      revokeObjectURL: () => {},
      state,
    },
  };
}
{
  const st = { orgManifestUrl: null };
  const { link, blobs, io } = fakeIo(st);
  applyOrgManifest({ slug: 'maor', orgName: 'מאור החסד' }, io);
  eq(link.href, 'blob:1', 'applyOrgManifest הציב href-blob');
  eq(JSON.parse(blobs[0]).name, 'מאור החסד', 'applyOrgManifest שם-הארגון במניפסט');
  // אתר-שורש (default) — אין החלפה
  const st2 = { orgManifestUrl: null };
  const b2 = fakeIo(st2);
  applyOrgManifest({ slug: 'default', orgName: 'x' }, b2.io);
  eq(b2.link.href, null, 'applyOrgManifest default — אפס-החלפה');
  // בלי שם — אין החלפה
  const b3 = fakeIo({ orgManifestUrl: null });
  applyOrgManifest({ slug: 'maor', orgName: '   ' }, b3.io);
  eq(b3.link.href, null, 'applyOrgManifest שם-ריק — אפס-החלפה');
  // משחרר בלוב-קודם
  let revoked = null;
  const st4 = { orgManifestUrl: 'blob:old' };
  const b4 = fakeIo(st4);
  b4.io.revokeObjectURL = (u) => { revoked = u; };
  applyOrgManifest({ slug: 'maor', orgName: 'שני' }, b4.io);
  eq(revoked, 'blob:old', 'applyOrgManifest שחרר בלוב-קודם');
}

/* 🛡 מגן-הכרעה: ההכרעות verbatim במקור-הקופסה (סדר-מפתחות/צבעים/אייקונים/סדר-שערים). */
const src = readFileSync(new URL('./lib-pwa.mjs', import.meta.url), 'utf8');
for (const needle of ["'#211d17'", "'#faf7f2'", "'shell.pwa'", "'sw.js'", 'portrait-primary', "'standalone'", 'icon-maskable-512.png', "'he'", "'rtl'", "'?org='"]) {
  if (!src.includes(needle)) { console.error(`✗ מגן: ההכרעה ${needle} נעדרה מהמקור`); f = 1; }
}
// סדר-שער-רישום: navigator/webdriver/isProd נבדקים לפני register
if (src.indexOf("'serviceWorker' in") > src.indexOf('.register(')) { console.error('✗ מגן: register לפני שער-serviceWorker'); f = 1; }
if (src.indexOf('webdriver') > src.indexOf('.register(')) { console.error('✗ מגן: register לפני שער-webdriver'); f = 1; }
// שער-הדגל לפני register; מתג-חירום (unregister) לפני register בקוד
if (src.indexOf('featureOn(') > src.indexOf('.register(')) { console.error('✗ מגן: register לפני שער-הדגל'); f = 1; }
// buildManifest: short_name > 12 ⇒ חיתוך (הסף חי כקבוע-הכרעה)
if (!/SHORT_NAME_MAX\s*=\s*12/.test(src)) { console.error('✗ מגן: סף-12 ל-short_name נעדר'); f = 1; }
if (!/length\s*>\s*SHORT_NAME_MAX/.test(src)) { console.error('✗ מגן: חיתוך short_name לא-מחווט לסף'); f = 1; }

if (f) process.exit(1);
console.log('✓ lib-pwa: 6 חשיפות (install/prompt/ios/standalone/register/manifest) + מגן-הכרעה — ירוק');
