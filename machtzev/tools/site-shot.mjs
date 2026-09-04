// site-shot.mjs <name> <expectedTitle> <port> — serve buildsmart/build/web-<name>, boot the generated app in headless Chromium, wait for MaterialApp to set document.title, screenshot
// 🌐 site-shot — ראיית-אתר (GENMAX·G11b): מגיש את build/web-<name> של buildsmart, מאתחל את האפליקציה-המחוללת ב-Chromium headless, מחכה ש-MaterialApp יקבע document.title, ומצלם.
//   שימוש: node machtzev/tools/site-shot.mjs <name> <Title> [port]  (אחרי flutter build web --release --no-web-resources-cdn -t lib/genesis/dart-gen-bs/gen_main_<name>.dart -o build/web-<name>)
//   דורש playwright-core (PW_CORE=<dir> · או node_modules של maor-system) + כרום ב-/opt/pw-browsers. L69: --no-web-resources-cdn + גופן-מצורף — אחרת האתר-המנותק נראה ריק/חסר-טקסט.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pwDir = process.env.PW_CORE || ['/home/user/maor-system/node_modules/playwright-core', '/opt/node22/lib/node_modules/playwright/node_modules/playwright-core'].find((d) => { try { require.resolve(d); return true; } catch { return false; } });
const { chromium } = require(pwDir || 'playwright-core');
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const [name, title, port = '8765'] = process.argv.slice(2);
const dir = `/home/user/buildsmart/app_flutter/build/web-${name}`;
const out = `/home/user/-ai-chat-server/machtzev/audit/goals/gen_app_${name}_web.png`;
const srv = spawn('python3', ['-m', 'http.server', port, '--bind', '127.0.0.1'], { cwd: dir, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const exe = fs.readdirSync('/opt/pw-browsers').filter((d) => /^chromium-\d+$/.test(d)).map((d) => `/opt/pw-browsers/${d}/chrome-linux/chrome`).find(fs.existsSync);
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox', '--disable-gpu'] });
const page = await browser.newPage({ viewport: { width: 800, height: 1400 } });
const errors = []; page.on('requestfailed', (r) => errors.push('req: ' + r.url().slice(0, 120) + ' ' + (r.failure()?.errorText || ''))); page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 160))); page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 160)); });
const t0 = Date.now();
await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load', timeout: 60000 });
let booted = false;
try { await page.waitForFunction((t) => document.title === t, title, { timeout: 45000 }); booted = true; } catch {}
await page.waitForTimeout(+(process.env.SHOT_WAIT || 2500));
const glass = await page.locator('flt-glass-pane, flutter-view').count();
await page.screenshot({ path: out, fullPage: false });
await browser.close(); srv.kill();
console.log(JSON.stringify({ name, booted, title: await Promise.resolve(title), glass, ms: Date.now() - t0, bytes: fs.statSync(out).size, errors: errors.slice(0, 3) }));
