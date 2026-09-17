// צעד 99: בדיקות אוטומטיות לדף הערוץ – רץ עם: NODE_PATH=$(npm root -g) node tests/page.test.js <path-to-liba-call.html>
const fs = require('fs'); const path = require('path');
const file = process.argv[2] || path.join(__dirname, '..', 'liba-call.html');
const html = fs.readFileSync(file, 'utf8');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
// 1. every <script> parses
(html.match(/<script>([\s\S]*?)<\/script>/g) || []).forEach((b, i) => { try { new Function(b.replace(/<\/?script>/g, '')); ok(true, 'script ' + i + ' parses'); } catch (e) { ok(false, 'script ' + i + ': ' + e.message); } });
// 2. protocol invariants
ok(/inbox/.test(html) && /spoken:true/.test(html), 'inbox ack (spoken:true) present');
ok(/channel\/owner/.test(html), 'owner protocol present');
ok(/channel\/quiet/.test(html), 'quiet protocol present');
const cmdLine = (html.split('\n').find(l => l.includes("if(d.kind==='cmd'){")) || '');
ok(cmdLine.indexOf("update({spoken:true") > -1 && cmdLine.indexOf("update({spoken:true") < cmdLine.indexOf("post('cmd'"), 'cmd is acknowledged before it is relayed');
ok(/prefixOf/.test(html) && /speakerOf/.test(html), 'speaker + topic prefix present');
ok(/lastRingAt/.test(html), 'one ring per batch');
ok(/outbox/.test(html) && /deliverWithRetry/.test(html), 'outbox + retry present');
ok(/memory\/notes'\)\.collection\('items'\)/.test(html), 'memory notes path is a valid collection');
ok(!/db\.doc\('(memory|decisions|chat)'\)\.collection/.test(html), 'no invalid 2-segment db paths');
ok(/apple-touch-icon/.test(html) && /manifest\.json/.test(html), 'PWA tags present');
// 3. voice command regexes accept the canonical phrases
const must = [['תזכור שהרואה חשבון הוא דני', /תזכור/], ['אל תפריע שעה', /אל תפריע/], ['ליבה תחזור', /ליבה/], ['מה בניתי השבוע', /מה בניתי השבוע/], ['מה את יודעת', /מה את יודעת/]];
must.forEach(([p, r]) => ok(r.test(html), 'command wired: ' + p));
console.log(fails ? `\n${fails} failing` : '\nall green'); process.exit(fails ? 1 : 0);
