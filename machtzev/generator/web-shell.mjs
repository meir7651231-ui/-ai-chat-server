#!/usr/bin/env node
// 🌐 web-shell — קליפת-הרשת פר-אפליקציה, נגזרת מהקוד-המחולל (G52).
//   הרקע (נחיל-הביקורת 10.9): כל 7 האתרים נבנו עם `web/index.html` של «בנייה חכמה» —
//   אותו שם, אותו כתום, אותו og:image, אותו manifest. אפליקציה שמתקינים למסך-הבית
//   הציגה שם של מוצר אחר. וגם: ה-service worker נוצר בבנייה אך מעולם לא נרשם ⇒ אפס-אופליין.
//   כאן: שם · צבע · רקע · סמל — כולם **נקראים מהקוד המחולל** (MaterialApp.title · DsPure theme/skin),
//   אפס-ליטרל פר-אפליקציה. השימוש: web-shell --site <name> --entry <gen_x.dart> לפני כל build.
//   ואחרי הבנייה: --prune <buildDir> מסיר משפחות-גופן שאינן מוזכרות ב-main.dart.js של אותה אפליקציה.
import fs from 'fs'; import path from 'path'; import vm from 'node:vm'; import { fileURLToPath } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const APP = process.env.BUILDSMART || '/home/user/buildsmart/app_flutter';
const GEN = path.join(ROOT, 'new/dart-gen-bs'), DATA = path.join(ROOT, 'new/dart-data-bs/auto'), DS = path.join(ROOT, 'new/dart-ui-bs/ds');
const argv = process.argv.slice(2);
const opt = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
const rd = (p) => fs.readFileSync(p, 'utf8');

// ── קריאת-הזהות מהקוד-המחולל ──────────────────────────────────────────────────
const hex = (c) => '#' + (c || '0xFF000000').replace(/^0x/i, '').slice(2).toUpperCase();   // Color(0xAARRGGBB) ⇒ #RRGGBB
function identity(entry) {
  // נקודת-הכניסה עשויה להיות `main()` דק שמריץ מסך שיושב בקובץ-מחולל אחר —
  // עוקבים אחרי הייבואים המקומיים (רמה אחת) עד שנמצאת ה-MaterialApp עם ה-title.
  const readGen = (f) => (fs.existsSync(path.join(GEN, f)) ? rd(path.join(GEN, f)) : '');
  const e0 = readGen(entry);
  const chain = [e0, ...[...e0.matchAll(/^import '(gen_[^']+\.dart)'/gm)].map((m) => readGen(m[1]))];
  const src = chain.find((c) => /MaterialApp\(/.test(c) && /title:/.test(c)) || e0;
  // שם: title: '…' או title: <const> שיושב בקובץ-תוכן
  let title = (src.match(/title:\s*'([^']*)'/) || [])[1] || null;
  if (!title) {
    const id = (src.match(/title:\s*([A-Za-z_]\w*)/) || [])[1];
    if (id) for (const f of fs.readdirSync(DATA)) { const m = rd(path.join(DATA, f)).match(new RegExp(`const String ${id} = '([^']*)'`)); if (m) { title = m[1]; break; } }
  }
  const ds = rd(path.join(DS, 'ds_pure.dart'));
  // צבע-מותג: DsPure.themes['t-x']!.a ⇒ הערך של a באותה ערכה; אחרת accent הכללי
  const tid = (src.match(/themes\['([^']+)'\]/) || [])[1];
  const tname = tid ? (ds.match(new RegExp(`'${tid}':\\s*(\\w+)`)) || [])[1] : null;
  const trow = tname ? (ds.match(new RegExp(`static const ${tname} = DsPureTheme\\(([^;]*)\\)`)) || [])[1] : null;
  const accent = hex(trow ? (trow.match(/\ba:\s*Color\((0x[0-9A-Fa-f]{8})\)/) || [])[1] : (ds.match(/static const accent = Color\((0x[0-9A-Fa-f]{8})\)/) || [])[1]);
  // רקע: DsPure.skins['x']!.canvas ⇒ canvas של אותו עור; אחרת canvas הכללי
  const sid = (src.match(/skins\['([^']+)'\]/) || [])[1];
  const srow = sid ? (ds.match(new RegExp(`'${sid}':\\s*DsPureSkin\\(([^)]*canvas[^;]*?)\\)\\}`)) || ds.match(new RegExp(`'${sid}':\\s*DsPureSkin\\(([^;]*)\\)`)) || [])[1] : null;
  const canvas = hex(srow ? (srow.match(/canvas:\s*Color\((0x[0-9A-Fa-f]{8})\)/) || [])[1] : (ds.match(/static const canvas = Color\((0x[0-9A-Fa-f]{8})\)/) || [])[1]);
  // סמל: האימוג׳י הראשון שמופיע **בטקסט-ממשק** של השלד (מחרוזת, לא הערה); אין ⇒ האות הראשונה של השם.
  //   (בלגן = עור-הנייר, אפס-אימוג׳י במכוון ⇒ נופל לאות — וזה נכון, לא כשל.)
  const shellP = path.join(GEN, entry.replace(/_main\.dart$/, '_shell.dart'));
  const body = (fs.existsSync(shellP) ? rd(shellP) : src).split('\n').filter((l) => !l.trim().startsWith('//')).join('\n');
  const EMO = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
  const emoji = ([...body.matchAll(/'([^']*)'/g)].map((m) => (m[1].match(EMO) || [])[0]).find(Boolean)) || (title || '?')[0];
  return { title: title || 'app', accent, canvas, emoji };
}

// ── כתיבת הקליפה ──────────────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const svgIcon = (emoji, accent) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="${accent}"/><text x="256" y="256" font-size="280" text-anchor="middle" dominant-baseline="central">${esc(emoji)}</text></svg>`;

// הקליפה של «בנייה חכמה» עצמה היא קובץ-ריפו מקובע — הבנייה-פר-אפליקציה דורסת אותו זמנית,
// ולכן צילום-מקור נשמר פעם-אחת ב-.dart_tool (מחוץ ל-git) ומוחזר ב---restore בסוף המסלול.
const SHELL_FILES = ['index.html', 'manifest.json', 'flutter_bootstrap.js', 'firebase-messaging-sw.js'];
const ORIG = path.join(APP, '.dart_tool/web-shell-orig');
function snapshot() {
  if (fs.existsSync(ORIG)) return; fs.mkdirSync(ORIG, { recursive: true });
  for (const f of SHELL_FILES) { const p = path.join(APP, 'web', f); if (fs.existsSync(p)) fs.copyFileSync(p, path.join(ORIG, f)); }
}
function restore() {
  if (!fs.existsSync(ORIG)) return false;
  for (const f of SHELL_FILES) { const p = path.join(ORIG, f); if (fs.existsSync(p)) fs.copyFileSync(p, path.join(APP, 'web', f)); }
  const ic = path.join(APP, 'web/icon.svg'); if (fs.existsSync(ic)) fs.unlinkSync(ic);
  fs.rmSync(ORIG, { recursive: true, force: true });   // הצילום הבא נלקח ממצב-ריפו נקי, לא מקליפה-דרוסה
  return true;
}

function writeShell(id) {
  snapshot();
  const web = path.join(APP, 'web');
  fs.writeFileSync(path.join(web, 'icon.svg'), svgIcon(id.emoji, id.accent));
  fs.writeFileSync(path.join(web, 'manifest.json'), JSON.stringify({
    name: id.title, short_name: id.title, lang: 'he', dir: 'rtl', start_url: '.', display: 'standalone',
    background_color: id.canvas, theme_color: id.accent, orientation: 'portrait-primary', prefer_related_applications: false,
    icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }, { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' }],
  }, null, 2));
  fs.writeFileSync(path.join(web, 'index.html'), `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <base href="$FLUTTER_BASE_HREF">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="theme-color" content="${id.accent}">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-title" content="${esc(id.title)}">
  <link rel="apple-touch-icon" href="icon.svg">
  <link rel="icon" type="image/svg+xml" href="icon.svg">
  <title>${esc(id.title)}</title>
  <link rel="manifest" href="manifest.json">
  <style>
    html, body { background: ${id.canvas}; }
    #splash { position: fixed; inset: 0; z-index: 2147483647; display: flex; align-items: center; justify-content: center; background: ${id.canvas}; transition: opacity .3s ease; }
    #splash.hidden { opacity: 0; pointer-events: none; }
    #splash .in { display: flex; flex-direction: column; align-items: center; gap: 16px; }
    #splash .mark { width: 76px; height: 76px; border-radius: 20px; background: ${id.accent}; display: flex; align-items: center; justify-content: center; font-size: 40px; }
    #splash .nm { font-family: system-ui, -apple-system, "Segoe UI", Arial, sans-serif; font-size: 20px; font-weight: 700; color: ${id.accent}; }
  </style>
</head>
<body>
  <div id="splash"><div class="in"><div class="mark">${esc(id.emoji)}</div><div class="nm">${esc(id.title)}</div></div></div>
  <script>
    (function () {
      var s = document.getElementById('splash');
      function hide() { if (!s) return; s.classList.add('hidden'); var e = s; s = null; setTimeout(function () { if (e && e.parentNode) e.parentNode.removeChild(e); }, 400); }
      window.addEventListener('flutter-first-frame', hide);
      setTimeout(hide, 12000);
    })();
  </script>
  <script src="flutter_bootstrap.js" async></script>
</body>
</html>
`);
  // G59 · מקלט-הדחיפה: service worker נפרד שרץ **כשהאפליקציה סגורה**. הקונפיג אינו ידוע
  //   בזמן-בנייה (הבעלים מדביק אותו בזמן-ריצה), ולכן הוא מגיע ב-query של הרישום —
  //   ולא מוטבע בקוד כמו באפליקציה שיש לה פרויקט אחד קבוע. בלי query ⇒ ה-SW לא מאתחל כלום.
  const swSrc = `// ☁️ חולל ע"י web-shell (G59 · הכרעה-31) — מקלט-דחיפה. אל תערוך ידנית.
//   גרסאות מקובעות בכוונה: CDN לא-מקובע משנה את המקלט מתחת לפריסה שלא נגעה בו.
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const q = new URLSearchParams(self.location.search);
const cfg = { apiKey: q.get('apiKey'), projectId: q.get('projectId'), appId: q.get('appId'), messagingSenderId: q.get('messagingSenderId') || '', authDomain: q.get('authDomain') || '' };
if (cfg.apiKey && cfg.projectId && cfg.appId) {
  firebase.initializeApp(cfg);
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    const n = payload.notification || {};
    const d = payload.data || {};
    self.registration.showNotification(n.title || ${JSON.stringify(id.title)}, {
      body: n.body || '',
      icon: 'icon.svg',
      dir: 'rtl',
      lang: 'he',
      tag: d.rid ? 'due-' + d.rid : undefined,   // תזכורת אחת לתיק, לא ערימה
      data: d,
    });
  });
  self.addEventListener('notificationclick', (e) => {
    e.notification.close();
    e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((ws) => {
      for (const w of ws) { if ('focus' in w) return w.focus(); }
      return self.clients.openWindow(new URL('.', self.registration.scope).href);   // הורה-ה-scope = שורש-האפליקציה (בלי רגקס — נמלט-לרעה בתבנית)
    }));
  });
}
`;
  // G59 · אימות-בזמן-פליטה: ה-SW הזה רץ **מחוץ** לאפליקציה, ואם הוא לא נפרס אין דחיפה בכלל
  //   ואף אחד לא רואה שגיאה. תפסתי כך בייצור-הזה רגקס שאיבד לוכסן-נמלט בתבנית ⇒ קובץ שבור.
  //   שתי בדיקות: הוא נפרס, ובלי query הוא **לא** מאתחל כלום (דורמנטיות).
  new vm.Script(swSrc, { filename: 'firebase-messaging-sw.js' });
  {
    let inited = 0;
    const ctx = { self: { location: { search: '' }, registration: {}, addEventListener() {}, clients: {} }, importScripts: () => {}, URL, URLSearchParams,
      firebase: { initializeApp: () => { inited++; }, messaging: () => ({ onBackgroundMessage() {} }) } };
    vm.createContext(ctx);
    vm.runInContext(swSrc, ctx);
    if (inited !== 0) throw new Error('✗ web-shell: מקלט-הדחיפה מאתחל בלי קונפיג — לא דורמנטי');
    const ctx2 = { ...ctx, self: { location: { search: '?apiKey=a&projectId=p&appId=x' }, registration: {}, addEventListener() {}, clients: {} } };
    vm.createContext(ctx2);
    vm.runInContext(swSrc, ctx2);
    if (inited !== 1) throw new Error('✗ web-shell: מקלט-הדחיפה לא מאתחל גם עם קונפיג');
  }
  fs.writeFileSync(path.join(web, 'firebase-messaging-sw.js'), swSrc);

  // G52 · רישום ה-service worker: הקובץ נוצר בכל בנייה אך לא נרשם ⇒ אפס-אופליין, אפס-PWA אמיתי.
  fs.writeFileSync(path.join(web, 'flutter_bootstrap.js'), `{{flutter_js}}
{{flutter_build_config}}

_flutter.loader.load({
  serviceWorkerSettings: { serviceWorkerVersion: {{flutter_service_worker_version}} },
  onEntrypointLoaded: async function (engineInitializer) {
    let appRunner = await engineInitializer.initializeEngine({ useColorEmoji: true });
    await appRunner.runApp();
  }
});
`);
}

// ── גיזום-גופנים אחרי הבנייה ─────────────────────────────────────────────────
//   כל האפליקציות חולקות pubspec אחד ⇒ כל בנייה נשאה את כל משפחות-הגופן של כולן
//   (בבלגן: JetBrains Mono + Fraunces = 876KB שאיש לא מבקש). המבחן אינו רשימה-ביד
//   אלא הפלט עצמו: משפחה ששמה אינו מופיע ב-main.dart.js של האפליקציה — יוצאת.
function prune(dir) {
  const fm = path.join(dir, 'assets/FontManifest.json'); if (!fs.existsSync(fm)) return null;
  const js = rd(path.join(dir, 'main.dart.js'));
  const fams = JSON.parse(rd(fm));
  const keep = fams.filter((f) => /^(MaterialIcons|packages\/)/.test(f.family) || js.includes(`"${f.family}"`));
  const kept = new Set(keep.flatMap((f) => f.fonts.map((x) => x.asset)));
  let freed = 0, dropped = [];
  for (const f of fams) if (!keep.includes(f)) { dropped.push(f.family); for (const a of f.fonts.map((x) => x.asset)) { if (kept.has(a)) continue; const p = path.join(dir, 'assets', a); if (fs.existsSync(p)) { freed += fs.statSync(p).size; fs.unlinkSync(p); } } }
  fs.writeFileSync(fm, JSON.stringify(keep));
  return { dropped, freed, kept: keep.map((f) => f.family) };
}

// ── CLI ───────────────────────────────────────────────────────────────────────
const pdir = opt('--prune');
if (argv.includes('--restore')) {
  console.log(restore() ? '🌐 קליפה · הוחזרה קליפת-הריפו (בנייה-חכמה)' : '🌐 קליפה · אין צילום להחזרה');
} else if (pdir) {
  const r = prune(pdir);
  console.log(r ? `✂️  גופנים · הושארו ${r.kept.length} · הוסרו ${r.dropped.length}${r.dropped.length ? ' (' + r.dropped.join(' · ') + ')' : ''} · ${(r.freed / 1024).toFixed(0)}KB` : '✂️  אין FontManifest');
} else {
  const entry = opt('--entry'); if (!entry) { console.error('שימוש: web-shell --entry gen_x_main.dart | --prune <dir>'); process.exit(1); }
  const id = identity(entry);
  writeShell(id);
  console.log(`🌐 קליפה · «${id.title}» · ${id.accent} על ${id.canvas} · ${id.emoji} · SW רשום`);
}
