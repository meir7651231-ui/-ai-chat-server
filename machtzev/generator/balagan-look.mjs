#!/usr/bin/env node
// 🎯 balagan-look — שער-המראה של «בלגן» (GENMAX·G28 · הכרעה-28): 36 כללי-היעד (15 עיצוב · 15 פרואקטיביות · 6 יעד)
//   כמרשם balagan-score.json; כל כלל = בדיקה מכנית על **הפלט-המחולל** של אפליקציות-הנייר (`עיצוב: נייר` בספק) — או
//   `wave:Gxx` כשהיכולת עוד לא נבנתה (מוצהר, לא מוסתר). הציון = ירוקים/36; ratchet רק-עולה (balagan-score-baseline.json).
//   שימוש: node machtzev/generator/balagan-look.mjs [--gate] [--write]   — 100% = 36/36 על שכירות + 4 הפירוקים, אפס-יד.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HARD_COLOR } from './look.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const GEN = path.join(ROOT, 'new/dart-gen-bs'), DATA = path.join(ROOT, 'new/dart-data-bs/auto'), SPECS = path.join(HERE, 'specs-ds');
const SL = JSON.parse(fs.readFileSync(path.join(HERE, 'spec-lang.data.json'), 'utf8'));
const REG = path.join(HERE, 'balagan-score.json'), BASE = path.join(HERE, 'balagan-score-baseline.json');
const GATE = process.argv.includes('--gate'), WRITE = process.argv.includes('--write');
const rd = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');

// אפליקציות-הנייר = ספקים עם `עיצוב: נייר`
const LOOK_RE = new RegExp('^\\s*' + SL.lookWord + '\\s*:\\s*(.+)$', 'm');
const apps = fs.readdirSync(SPECS).filter((f) => f.endsWith('.txt')).map((f) => ({ ns: f.replace(/\.txt$/, ''), spec: rd(path.join(SPECS, f)) }))
  .filter((a) => { const m = a.spec.match(LOOK_RE); return m && SL.looks[m[1].trim()] === 'paper'; });
apps.push({ ns: 'balagan', spec: '' });   // G53 · המוצר עצמו, לא רק חומרי-הגלם
// G53 · «בלגן» עצמו נכנס לשער-המראה. עד כאן נסרקו רק מודולי-הנייר (`gen_app_<ns>_*`) —
//   36 הכללים מעולם לא נמדדו על האפליקציה שהבעלים באמת פותח (`gen_balagan_*`), והציון «35/36»
//   תיאר את החומר, לא את המוצר. ns וירטואלי, אותה קבוצת-כללים, בלי ספק-txt.
const BAL = 'balagan';
const pref = (ns) => (ns === BAL ? 'gen_balagan_' : `gen_app_${ns}_`);
const files = (ns) => fs.readdirSync(GEN).filter((f) => f.startsWith(pref(ns)) && f.endsWith('.dart')).map((f) => ({ f, s: rd(path.join(GEN, f)) }));
const contents = (ns) => fs.readdirSync(DATA).filter((f) => f.startsWith(pref(ns)) && f.endsWith('_content.dart')).map((f) => ({ f, s: rd(path.join(DATA, f)) }));
const ds = rd(path.join(ROOT, 'new/dart-ui-bs/ds/ds.dart'));
// G53 · «בלגן» מרכיב את «היום» שלו מספקי-Today של המודולים. כלל שמנגנונו יושב אצל המודול
//   (מיון · הזזת-soft · דחייה ביום-ההכרעה · קטע-מקור) נבדק אצל «בלגן» כ**כיסוי-מלא של הממוזגים**:
//   כל מודול שהוא ממזג חייב להיות ירוק. זו דרישה חזקה יותר מפטור — מודול חדש בלי המנגנון צובע אדום.
const mergedMods = () => [...new Set([...rd(path.join(GEN, 'gen_balagan_home.dart')).matchAll(/GenApp(\w+?)HomeScreenToday\./g)].map((m) => m[1].toLowerCase()))].filter((ns) => fs.existsSync(path.join(GEN, `gen_app_${ns}_home.dart`)));
// G53 · מד-צפיפות: כמה פריטים ברמה-הראשונה של «היום». §7 של מסמך-המוצר מבקש מסך שאפשר לקלוט
//   במבט אחד; המספר נמדד ולא מוערך, ננעל ratchet **יורד-בלבד**, ומשמש כראיה לגל-הצפיפות (G54).
function homeSlots(ns) {
  const h = files(ns).find((x) => /_home\.dart$/.test(x.f)); if (!h) return 0;
  const i = h.s.indexOf('DsScaffold('); if (i < 0) return 0;
  const j = h.s.indexOf('children: [', i); if (j < 0) return 0;
  let k = j + 'children: ['.length, d = 0, start = k; const parts = [];
  while (k < h.s.length) { const c = h.s[k]; if ('([{'.includes(c)) d++; else if (')]}'.includes(c)) { if (d === 0) break; d--; } else if (c === ',' && d === 0) { parts.push(h.s.slice(start, k)); start = k + 1; } k++; }
  parts.push(h.s.slice(start, k));
  return parts.filter((x) => x.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '').trim().length > 0).length;
}
const viaMods = (fn) => { const bad = mergedMods().filter((ns) => fn(ns)); return bad.length ? `${bad.length} מודולים ממוזגים בלי המנגנון: ${bad.slice(0, 3).join(', ')}` : null; };

const EMOJI = /[\p{Extended_Pictographic}☀-➿⬀-⯿]/u;

// ── הבדיקות (כל אחת: (ns) ⇒ null=ירוק · string=כשל) ──
const CHECKS = {
  paperRoot: (ns) => { const m = files(ns).find((x) => x.f.endsWith('_main.dart')); if (!m) return 'אין main'; for (const need of ["PureScope(", "DsPure.skins['paper']", "DsPure.fontSets['heebo']", "DsPure.themes['t-balagan']", 'Brightness.light']) if (!m.s.includes(need)) return `main בלי ${need}`; return null; },
  noDsTokens: (ns) => { const bad = files(ns).filter((x) => /\bDsTokens\./.test(x.s)).map((x) => x.f); return bad.length ? `DsTokens קשיח ב-${bad.join(', ')}` : null; },
  noHardColor: (ns) => { const bad = files(ns).filter((x) => /Color\(0x(?!00000000)[0-9A-Fa-f]{8}\)/.test(x.s)).map((x) => x.f); return bad.length ? `צבע-קשיח ב-${bad.join(', ')}` : null; },
  noEmoji: (ns) => { const bad = contents(ns).flatMap((x) => [...x.s.matchAll(/const String (\w+) = '([^']*)';/g)].filter((m) => EMOJI.test(m[2])).map((m) => `${x.f}:${m[1]}`)); return bad.length ? `אמוג׳י בקבוע: ${bad.slice(0, 3).join(', ')}${bad.length > 3 ? ' …' : ''}` : null; },
  navMax: (ns) => { const sh = files(ns).find((x) => x.f.endsWith('_shell.dart')); if (!sh) return 'אין שלד'; const m = sh.s.match(/IndexedStack\(index: _t\.clamp\(0, (\d+)\)/); const n = m ? +m[1] + 1 : 99; return n <= 5 ? null : `${n} יעדי-ניווט`; },
  onePrimary: (ns) => { const sh = files(ns).find((x) => x.f.endsWith('_shell.dart')); if (!sh) return 'אין שלד'; const tab = sh.s.slice(sh.s.indexOf('class _RootTab')); const n = (tab.match(/Forge\w*Btn|DsPrimaryButton|ForgeFab/g) || []).length; return n <= 1 ? null : `${n} פעולות-ראשיות במסך-הרשימה`; },
  threeOnTop: (ns) => { const bad = []; for (const x of files(ns).filter((x) => /_rp\d+\.dart$/.test(x.f))) { const secs = (x.s.match(/^\/\/   [^⚪\n]+ = /gm) || []).length; const fold = x.s.includes('DsFold('); if (secs > 3 && !fold) bad.push(x.f); } return bad.length ? `דוח בלי קיפול: ${bad.join(', ')}` : null; },
  screenQuestion: (ns) => { const rp = files(ns).find((x) => /_rp1\.dart$/.test(x.f)); const sh = files(ns).find((x) => x.f.endsWith('_shell.dart')); if (!rp || !sh) return null; const c = contents(ns); const first = (f, i) => { const cf = c.find((x) => x.f === f.replace('.dart', '_content.dart')); if (!cf) return ''; const m = cf.s.match(new RegExp(`const String \\w+_c${i} = '([^']*)'`)); return m ? m[1] : ''; }; const qRp = rp.s.match(/DsScaffold\(title: (\w+_c(\d+))/); const t = qRp ? first(rp.f, qRp[2]) : ''; return /\?$/.test(t) ? null : `כותרת-הדוח אינה שאלה: «${t}»`; },
  noHardAtoms: (ns) => { const bad = new Set(); for (const x of files(ns)) for (const m of x.s.matchAll(/^import '\.\.\/(dart-[^']+)';/gm)) { const f = m[1]; if (/^dart-ui-bs\/ds\/|^dart-data-bs\/|^dart-gen-bs\/|^dart-maor\//.test(f)) continue; const src = rd(path.join(ROOT, 'new', f)); if (HARD_COLOR.test(src)) bad.add(f); } return bad.size ? `אטום עם צבע-קשיח: ${[...bad].slice(0, 3).join(', ')}` : null; },
  diffMoney: (ns) => { const rp = files(ns).filter((x) => /_(rp|px)\d+\.dart$/.test(x.f)); const withDiff = rp.filter((x) => x.s.includes('DsDiffRow(')); for (const x of withDiff) { if (!/delta:/.test(x.s) || !/!= 0\)/.test(x.s)) return `${x.f}: דיף בלי Δ/סינון-מה-שהשתנה`; } return null; },
  diffExists: () => { const any = apps.some((a) => files(a.ns).some((x) => x.s.includes('DsDiffRow('))); return any ? null : 'אף אפליקציית-נייר בלי דיף (אין זוגות ישן/חדש?)'; },
  calmEmpty: (ns) => { if (ns === BAL) { const h = CHECKS._home(ns); if (!h || !/\bempty\b/.test(h.s)) return '«היום» בלי מצב-ריק'; const c = contents(ns).find((x) => x.f === 'gen_balagan_home_content.dart'); return c && /תנוח\.|וזהו\./.test(c.s) ? null : 'מצב-ריק בלי משפט מרגיע'; }
    const sh = files(ns).find((x) => x.f.endsWith('_shell.dart')); if (!sh) return 'אין שלד'; const tab = sh.s.slice(sh.s.indexOf('class _RootTab')); if (!/if \(rs\.isEmpty\)/.test(tab)) return 'רשימה בלי מצב-ריק'; const c = contents(ns).find((x) => x.f === sh.f.replace('.dart', '_content.dart')); if (!c || !/וזהו\./.test(c.s)) return 'מצב-ריק בלי משפט מרגיע'; return null; },
  homeTwoTaps: (ns) => { const h = files(ns).find((x) => x.f.endsWith('_home.dart')); if (!h) return 'אין מסך «היום»'; const rp = files(ns).find((x) => /_rp1\.dart$/.test(x.f)); if (rp && /appStore\.update\(/.test(rp.s) && !/appStore\.update\(/.test(h.s)) return '«היום» בלי בורר-נוסחים (הקשה 1)'; if (rp && !/\b_?send\(context/.test(h.s)) return '«היום» בלי שליחה (הקשה 2)'; const sh = files(ns).find((x) => x.f.endsWith('_shell.dart')); if (!sh || !/children: \[const \w+HomeScreen\(\)/.test(sh.s)) return '«היום» אינו הלשונית הראשונה'; return null; },
  // G53 · «אפס-הקלדה» = אפס **מילוי-טופס**, לא אפס-הדבקה: G30 הכניס את השורה-המהירה במכוון
  //   כמסלול-שתי-ההקשות, ו-balagan-run מודד את ההקשות בפועל בדפדפן. שדה-טופס גולמי — עדיין אסור.
  noTypingHome: (ns) => { const h = files(ns).find((x) => x.f.endsWith('_home.dart')); if (!h) return 'אין מסך «היום»'; if (/TextField\(|DsField\(/.test(h.s)) return '«היום» דורש מילוי-טופס'; return ns === BAL || !/DsQuickAdd\(/.test(h.s) ? null : '«היום» דורש הקלדה'; },
  quickAdd: (ns) => { const surf = files(ns).filter((x) => /_(shell|home)\.dart$/.test(x.f)); return surf.some((x) => x.s.includes('DsQuickAdd(')) ? null : 'רשימה בלי הוספה-מהירה בטקסט'; },   // G53 · המשטח = שלד או «היום» (בבלגן היא ב«היום»)
  keys: (ns) => { const sh = files(ns).find((x) => x.f.endsWith('_shell.dart')); if (!sh) return 'אין שלד'; for (const need of ['LogicalKeyboardKey.keyA', 'LogicalKeyboardKey.keyT', 'LogicalKeyboardKey.keyK, control: true', 'DsPalette.show(']) if (!sh.s.includes(need)) return `שלד בלי ${need}`; return null; },
  zeroSettings: (ns) => { const m = files(ns).find((x) => x.f.endsWith('_main.dart')); if (!m) return 'אין main'; return /home: const \w+ShellScreen\(\)/.test(m.s) ? null : 'main לא פותח בשלד (הגדרות/מסך-ביניים קודם)'; },
  // ── G32 · טריגרים: בדיקות מבניות על «היום» (home) · החנות · השלד ──
  _home: (ns) => files(ns).find((x) => x.f.endsWith('_home.dart')),
  inboxNotToday: (ns) => { const h = CHECKS._home(ns); if (!h) return 'אין «היום»'; return h.s.includes('DsApproveCard(') && h.s.includes('DsActionRow(') && /homePending|ממתין/.test(h.s + contents(ns).map((c) => c.s).join('')) ? null : '«היום» בלי הפרדה תיבה/היום'; },
  overdueFirst: (ns) => { const h = CHECKS._home(ns); if (!h) return 'אין «היום»'; const o = h.s.indexOf('if (overdue.isNotEmpty) DsSection('), td = h.s.indexOf('if (todayItems.isNotEmpty) DsSection('); if (!(o > 0 && td > 0 && o < td)) return 'באיחור אינו ראשון'; return ns === BAL ? viaMods((m) => CHECKS.overdueFirst(m)) : null; },   // G53 · סדר-הרינדור עצמו (סמן-טקסט נכשל כשהמילה מופיעה קודם בלוגיקה) + כיסוי-הממוזגים
  loadMeter: (ns) => { const h = CHECKS._home(ns); return h && h.s.includes('DsLoadMeter(') ? null : 'אין מונה-עומס'; },
  daySingle: (ns) => { const h = CHECKS._home(ns); if (!h) return 'אין «היום»'; const src = h.s.replace(/\bbh\w+/g, '');
    if (ns === BAL) { if (!/DsFold\([^;]{0,200}tomorrow\.length/.test(h.s)) return 'מחר לא מקופל'; const inline = [...src.matchAll(/\b\w*Week\w*\b/g)].map((m) => m[0]).filter((w) => !/^(_wd|weekStart|balaganWeekOf|balaganWeekName)$/.test(w)).filter((w) => !new RegExp(`MaterialPageRoute<void>\\(builder: \\(_\\) => ${w}\\(`).test(src)); return inline.length ? `תצוגת-שבוע בתוך «היום»: ${[...new Set(inline)].slice(0, 2).join(', ')}` : null; }
    return /DsFold\(title: \w+ \+ ' \(' \+ tomorrow/.test(src) && !/\bweek\b|Week/.test(src) ? null : 'מחר לא מקופל / תצוגת-שבוע'; },   // G34 · חלקיק תחילת-השבוע (מהתוכנית) אינו תצוגת-שבוע
  offsets: (ns) => { const h = CHECKS._home(ns); return h && h.s.includes("setting('offsets', '3,1,0')") ? null : 'אין offsets עריך'; },
  sortDue: (ns) => { const h = CHECKS._home(ns); if (!h) return 'אין «היום»'; if (!/\.sort\(\([\s\S]{0,400}?a\.due\.compareTo\(b\.due\)/.test(h.s)) return 'אין מיון לפי מועד'; return ns === BAL ? viaMods((m) => CHECKS.sortDue(m)) : null; },   // G53 · המועד = המפתח האחרון גם כשקודמים לו קשיח/₪
  derived: (ns) => { const h = CHECKS._home(ns); return h && /\b_?items\(today, dayDelta: 0\)/.test(h.s) && !/persist|reminders\s*=/.test(h.s) ? null : 'תזכורות לא נגזרות ברינדור'; },
  noSnoozeToday: (ns) => { const h = CHECKS._home(ns); if (!h) return 'אין «היום»'; if (ns === BAL) { const sn = h.s.slice(h.s.indexOf('void _snoozeAll('), h.s.indexOf('void _snoozeAll(') + 1400); return /bhDaysSince\(_isoD\(it\.due\), _isoD\(today\)\) < 0\) continue/.test(sn) ? viaMods((m) => CHECKS.noSnoozeToday(m)) : 'דחייה-מרוכזת מזיזה מועד שעוד לפנינו'; } return /== today \? \[/.test(h.s) ? null : 'דחייה מותרת ביום-ההכרעה'; },
  manualLock: (ns) => { const h = CHECKS._home(ns); if (!h) return 'אין «היום»'; const ap = h.s.slice(h.s.search(/void _?autopilot\(\)/), h.s.indexOf('Future<void> _digest')); return /update\(|\b_?send\(/.test(ap) ? 'הטייס-האוטומטי נוגע בתאריך/שולח' : null; },
  softShift: (ns) => { const h = CHECKS._home(ns); if (!h) return 'אין «היום»'; if (ns === BAL) return /bhSoftShift\(/.test(h.s) ? viaMods((m) => CHECKS.softShift(m)) : 'הזזת-שבת ביד במקום bhSoftShift'; return /bhSoftShift\(/.test(h.s) && /_shift\(/.test(h.s) ? null : 'אין הזזת-soft'; },   // G34ב · שבת דרך שכבת-ההרכבה (bhSoftShift), לא DateTime.saturday
  digest: (ns) => { const h = CHECKS._home(ns); const b = files(ns).find((x) => x.f.endsWith('_behavior.dart')); return h && h.s.includes('_digest(') && h.s.includes("setting('digestHour'") && b && b.s.includes("'digestHour'") ? null : 'אין תקציר-בוקר עריך'; },
  onlyByRule: (ns) => { const h = CHECKS._home(ns); if (!h) return 'אין «היום»'; const n = (h.s.match(/\.show\(/g) || []).length; return n <= 2 ? null : `${n} סוגי-התראה (מותר 2)`; },
  approveCard: (ns) => { const h = CHECKS._home(ns); return h && /DsApproveCard\([^;]*alwaysLabel:/.test(h.s) && /onAlways:/.test(h.s) ? null : 'אין כרטיס אשר/דחה/תמיד'; },
  followDraft: (ns) => { const h = CHECKS._home(ns); const rp = files(ns).find((x) => /_rp1\.dart$/.test(x.f)); if (!rp || !/_send\(context/.test(rp.s)) return null; return h && /lastLog\('send'/.test(h.s) && /n >= 3/.test(h.s) ? null : 'אין טיוטת-תזכורת אחרי שליחה'; },
  proposalSource: (ns) => { const h = CHECKS._home(ns); if (!h) return 'אין «היום»'; if (ns === BAL) return viaMods((m) => CHECKS.proposalSource(m));   // ההצעות מגיעות מספקי-המודולים; «בלגן» מרנדר אותן
    const pb = h.s.slice(h.s.search(/\b_?proposals\(/), h.s.search(/void _?autopilot\(\)/)); const cards = pb.split('DsApproveCard(').slice(1); return cards.length && cards.every((c) => /source: /.test(c)) ? null : 'הצעה בלי קטע-מקור'; },
  nextStep: (ns) => { const h = CHECKS._home(ns); const sh = files(ns).find((x) => x.f.endsWith('_shell.dart')); if (!h) return 'אין «היום»'; const spec = rd(path.join(SPECS, ns + '.txt')); const hasChain = new RegExp('^\\s*' + SL.chainWord + '\\s*:', 'm').test(spec); if (!hasChain) return null; return /decision\('next:/.test(h.s) ? null : 'שרשרת בספק בלי הצעת-צעד-הבא'; },
  firstPerson: (ns) => { const h = CHECKS._home(ns); const c = contents(ns).find((x) => h && x.f === h.f.replace('.dart', '_content.dart')); return c && /ממך היום|תנוח/.test(c.s) ? null : 'אין משפט-פתיחה בגוף-ראשון'; },
  didUndo: (ns) => { const h = CHECKS._home(ns); const st = rd(path.join(ROOT, 'new/dart-ui-bs/ds/ds_store.dart')); return h && h.s.includes('DsLogRow(') && /appStore\.undo\(/.test(h.s) && /bool undo\(String logId\)/.test(st) ? null : 'אין «עשיתי לבד» עם החזר'; },
  sendOnlyTap: (ns) => { for (const x of files(ns)) { const ap = x.s.search(/void _?autopilot\(\)/); if (ap >= 0) { const body = x.s.slice(ap, x.s.indexOf('Future<void> _digest', ap)); if (/\b_?send\(/.test(body)) return `${x.f}: שליחה אוטומטית`; } } return null; },
  widthCap: () => (ds.includes('maxWidth: 720') ? null : 'DsScaffold בלי רוחב-תוכן 720'),
  flatRows: () => (/class DsNavTile[\s\S]*?if \(lk\.paper\)[\s\S]*?minHeight: 52/.test(ds) ? null : 'DsNavTile בלי שורה-52 בנייר'),
  tokensOnly: () => (/class DsLook[\s\S]*?static DsLook of\(BuildContext context\)/.test(ds) ? null : 'אין DsLook'),
};
const run = (id) => { const c = CHECKS[id]; if (!c || id.startsWith('_')) return `בדיקה חסרה: ${id}`; const fails = []; if (c.length === 0) { const r = c(); if (r) fails.push(r); } else for (const a of apps) { const r = c(a.ns); if (r) fails.push(`${a.ns}: ${r}`); } return fails.length ? fails.join(' · ') : null; };

const reg = JSON.parse(rd(REG));
let green = 0; const rows = [];
for (const r of reg.rules) {
  let status, why = '';
  if (r.check) { const bad = r.check.map(run).filter(Boolean); status = bad.length ? 'red' : 'green'; why = bad.join(' · '); }
  else status = r.wave;
  if (status === 'green') green++;
  rows.push({ ...r, status, why });
}
const total = reg.rules.length;
const base = fs.existsSync(BASE) ? JSON.parse(rd(BASE)) : { green: 0 };
const md = `# ציון «בלגן» · ${green}/${total} (הכרעה-28 · ratchet רצפה ${base.green})\n\n| # | קבוצה | כלל | מצב |\n|---|---|---|---|\n` + rows.map((r) => `| ${r.id} | ${r.group} | ${r.text} | ${r.status === 'green' ? '✅' : r.status === 'red' ? '❌ ' + r.why : '⏳ ' + r.status} |`).join('\n') + `\n\nאפליקציות-נייר: ${apps.map((a) => a.ns).join(' · ')}\n`;
if (!GATE) fs.writeFileSync(path.join(HERE, 'balagan-score.md'), md);   // --gate = עץ-נח (L14): לא כותב
const reds = rows.filter((r) => r.status === 'red');
console.log(`🎯 balagan-look: ${green}/${total} ירוקים · ${reds.length} אדומים · ${rows.filter((r) => /^wave/.test(r.status)).length} ממתינים-לגל · ${apps.length} אפליקציות-נייר (${apps.map((a) => a.ns).join(' · ')})`);
for (const r of reds) console.log(`  ❌ ${r.id} ${r.text}: ${r.why}`);
const slots = homeSlots(BAL);
console.log(`   חריצי-«היום» של בלגן: ${slots}${base.slots ? ` (תקרה ${base.slots}, יורד-בלבד)` : ''}`);
if (WRITE) { fs.writeFileSync(BASE, JSON.stringify({ green, total, at: 'G53', slots }, null, 1) + '\n'); console.log(`✍️ baseline ⇒ ${green}/${total} · חריצים ${slots}`); }
if (GATE) {
  if (reds.length) { console.error(`🚨 balagan-look: ${reds.length} כללים אדומים על פלט-המנוע`); process.exit(1); }
  if (green < base.green) { console.error(`🚨 balagan-look: ratchet ירד ${base.green} ⇒ ${green}`); process.exit(1); }
  if (!apps.length) { console.error('🚨 balagan-look: אין אפליקציית-נייר'); process.exit(1); }
  if (base.slots && slots > base.slots) { console.error(`🚨 balagan-look: «היום» התעבה ${base.slots} ⇒ ${slots} חריצים (ratchet יורד-בלבד)`); process.exit(1); }
  if (!apps.some((a) => a.ns === BAL)) { console.error('🚨 balagan-look: «בלגן» עצמו אינו נסרק'); process.exit(1); }
  console.log(`✓ balagan-look: ${green}/${total} ≥ רצפה ${base.green} · אפס-אדומים על ${apps.length} אפליקציות-נייר`);
}
