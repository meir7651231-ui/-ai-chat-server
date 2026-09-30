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
// the relay is written through the contract (protocol-contract): PROTO.toApp.cmd, never the literal 'cmd'
const RELAY_CMD = 'post(PROTO.toApp.cmd';
const cmdAt = html.indexOf("if(d.kind==='cmd'){if(!appMode){log("), cmdLine = cmdAt < 0 ? '' : html.slice(cmdAt, html.indexOf(RELAY_CMD, cmdAt) + RELAY_CMD.length); /* the path from a cmd to its relay (signed-commands spans lines) */
ok(cmdLine.indexOf("update({spoken:true") > -1 && cmdLine.lastIndexOf("update({spoken:true") < cmdLine.indexOf(RELAY_CMD), 'cmd is acknowledged before it is relayed');
ok(cmdLine.indexOf("sigOk('cmd',d)") > -1 && cmdLine.indexOf("sigOk('cmd',d)") < cmdLine.indexOf(RELAY_CMD), 'a cmd from the channel is verified before it is relayed');
ok(!/post\('[a-zA-Z]+'/.test(html) && !/d\.liba==='[a-zA-Z]+'/.test(html), 'no message name typed by hand - every one comes from the contract');
ok(/prefixOf/.test(html) && /speakerOf/.test(html), 'speaker + topic prefix present');
ok(/lastRingAt/.test(html), 'one ring per batch');
ok(/outbox/.test(html) && /deliverWithRetry/.test(html), 'outbox + retry present');
ok(/memory\/notes'\)\.collection\('items'\)/.test(html), 'memory notes path is a valid collection');
ok(!/db\.doc\('(memory|decisions|chat)'\)\.collection/.test(html), 'no invalid 2-segment db paths');
ok(/apple-touch-icon/.test(html) && /manifest\.json/.test(html), 'PWA tags present');
// windowed-reads: no live read and no one-shot read of a whole collection. Every collection in the path table
// is read through a window (orderBy/where + limit) or coldGet(..., n). Was 8 of 8 unbounded before the step.
const COLS = ['inbox', 'tasks', 'sessions', 'gallery', 'notes', 'prefs', 'turns', 'decisions', 'telemetry', 'reqs'];
const unbounded = html.match(new RegExp('P\\.(' + COLS.join('|') + ')\\(\\)\\.(onSnapshot|get)\\(', 'g')) || [];
unbounded.push(...(html.match(/trCol\(\)\.(onSnapshot|get)\(/g) || []));
ok(unbounded.length === 0, 'no unbounded collection read (windowed-reads): ' + (unbounded.join(' ') || '0'));
const windows = (html.match(/watch\('[a-z-]+',k=>P\.[a-z]+\(\)(\.where\([^)]*\))?\.orderBy\([^)]*\)\.limit\(k\)/g) || []).length;
ok(windows === 5, 'five live windows, each ordered and limited: ' + windows);
// 3. voice command regexes accept the canonical phrases
const must = [['תזכור שהרואה חשבון הוא דני', /תזכור/], ['אל תפריע שעה', /אל תפריע/], ['ליבה תחזור', /ליבה/], ['מה בניתי השבוע', /מה בניתי השבוע/], ['מה את יודעת', /מה את יודעת/]];
must.forEach(([p, r]) => ok(r.test(html), 'command wired: ' + p));
console.log(fails ? `\n${fails} failing` : '\nall green'); process.exit(fails ? 1 : 0);
