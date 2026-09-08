#!/usr/bin/env node
// 🧭 balagan-one — שער האפליקציה-האחת (GENMAX · G33 · הכרעה-29): «בלגן» = כל המודולים בפנים, בלי רשימה סגורה, בלי יד.
//   (1) N = מודולי-הנייר עם «היום» (apps/*.json) ≡ פירוקים ב-peruk-index ≡ מודולים ב-balagan-index ≡ ייבוא-ה-Today ב«היום» המאוחד ≡ מקרי-הפתיחה ב«מה קרה?»
//   (2) מזהה-הרגע: כותרת+«הרגע» של כל מודול ⇒ עצמו ב-top-1 (דטרמיניסטי, מחושב מחדש כאן — לא מהקובץ)
//   (3) אפס-רשימה-סגורה: balagan.mjs אינו מכיל שם-מודול ליטרלי (perukNN) · (4) main רושם קשרים לכל מודול-עם-קשרים · (5) המפתח = הגדרה-במכשיר, לא ליטרל
//   (6) ratchet: N רק-עולה (balagan-one-baseline.json). --gate בלבד (ריצה = balagan.mjs).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadModules, buildIdentifier, selfTest, identify } from './balagan.mjs';
import * as R from '../root.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const rd = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');
const GEN = R.outDir();
const fails = [];
const mods = loadModules();
const index = JSON.parse(rd(path.join(HERE, 'peruk-index.json')) || '[]');
const bi = JSON.parse(rd(path.join(HERE, 'balagan-index.json')) || '{"modules":[]}');
const paperIdx = index.filter((n) => fs.existsSync(path.join(HERE, 'apps', `${n.ns}.json`)));
const nPeruk = mods.filter((m) => m.layer !== 'base').length;
if (nPeruk !== paperIdx.length) fails.push(`מודולי-פירוק ${nPeruk} ≠ פירוקים-עם-מניפסט ${paperIdx.length}`);
if (bi.modules.length !== mods.length) fails.push(`balagan-index ${bi.modules.length} ≠ ${mods.length} (הרץ node machtzev/generator/balagan.mjs)`);
const home = rd(path.join(GEN, 'gen_balagan_home.dart')), ask = rd(path.join(GEN, 'gen_balagan_ask.dart')), main = rd(path.join(GEN, 'gen_balagan_main.dart')), shell = rd(path.join(GEN, 'gen_balagan_shell.dart')), keys = rd(path.join(GEN, 'gen_balagan_keys.dart')), topics = rd(path.join(GEN, 'gen_balagan_topics.dart'));
if (!home || !ask || !main || !shell || !keys || !topics) fails.push('חסר קובץ-בלגן (home/ask/main/shell/keys/topics)');
const todays = (home.match(/\w+HomeScreenToday\.module/g) || []).length;
if (todays !== mods.length) fails.push(`«היום» ממזג ${todays} מודולים ≠ ${mods.length}`);
const cases = (ask.match(/case \d+: return \w+\(initial: initial\)/g) || []).length;
if (cases !== mods.length) fails.push(`«מה קרה?» פותח ${cases} מודולים ≠ ${mods.length}`);
for (const m of mods) { if (!topics.includes(`const ${m.root.cls}()`)) fails.push(`«נושאים» בלי ${m.ns}`); }
const bad = selfTest(mods, buildIdentifier(mods));
if (bad.length) fails.push(`מזהה-הרגע: ${bad.join(' · ')}`);
const src = rd(path.join(HERE, 'balagan.mjs'));
if (/peruk\d{2}/.test(src)) fails.push('balagan.mjs מכיל שם-מודול ליטרלי (רשימה סגורה)');
for (const m of mods.filter((x) => x.relations)) if (!main.includes(`r_${m.ns}.registerAppRelations(appStore)`)) fails.push(`main בלי קשרי ${m.ns}`);
if (!/appStore\.setting\('ai\.key'\)/.test(keys) || /sk-ant-[A-Za-z0-9]{8,}/.test(keys + ask)) fails.push('מפתח-הבינה אינו הגדרה-במכשיר (או ליטרל בקוד)');
if (!/DsApproveCard\(/.test(ask) || !/balaganIdentify\(/.test(ask) || !/balaganFacts\(/.test(ask)) fails.push('«מה קרה?» בלי זיהוי/עובדות/«הבנתי כך?»');
if (!/cards\.take\(3\)/.test(home) || !/DsFold\(/.test(home)) fails.push('«היום» בלי 3-למעלה-והשאר-מקופל');
const confirm = rd(path.join(GEN, 'gen_balagan_confirm.dart'));
if (!/DsFold\(/.test(confirm) || !/appStore\.add\(widget\.module\.rootSlug/.test(confirm) || !/balaganRemember\(/.test(confirm)) fails.push('«הבנתי כך?» בלי טופס-מקוצר/שמירה/זיכרון');
if (!/GenBalaganConfirmScreen\(module:/.test(ask)) fails.push('«מה קרה?» אינו פותח את טופס-האישור');
const baseMods = mods.filter((m) => m.layer === 'base');
if (baseMods.length < 2 || !baseMods.every((m) => m.root.fields.some((f) => f.type === 'date'))) fails.push(`שכבת-הבסיס: ${baseMods.length} מודולים (נדרש ≥2 עם תאריך: משימות · יומן)`);
// גל ב׳-ב · «הגיע» (שקע-מייל בטוקן-הלקוח) · שרשרת חוצת-מודולים · «ליומן» (קישור, אפס-מפתח) · הצעד-הבא על רשומות-שנסגרו (לא רק open)
if (!/dsMailRecent\(/.test(home) || !/decision\('mail:/.test(home) || !/balaganIdentify\(m\.subject/.test(home)) fails.push('«היום» בלי שקע-מייל (הגיע ⇒ זיהוי ⇒ הצעה)');
if (!/_chain\(context\)/.test(home) || !/\.done\(\)/.test(home) || !/bm\.chain\.first/.test(home)) fails.push('«היום» בלי שרשרת חוצת-מודולים');
if (!/appStore\.setting\('mail\.token'\)/.test(keys)) fails.push('«חיבורים» בלי טוקן-מייל');
const mailSrc = rd(path.join(R.ROOT, 'new/dart-ui-bs/ds/ds_mail.dart')); if (/ya29\.[A-Za-z0-9_-]{20,}/.test(mailSrc + keys + home)) fails.push('טוקן ליטרלי בקוד');
for (const m of mods) { const h = rd(path.join(GEN, `gen_${m.home.slug}.dart`)); if (!/calendar\.google\.com\/calendar\/render/.test(h)) fails.push(`${m.ns}: בלי «ליומן»`); if (m.chain && m.chain.length && m.root.stages && m.root.stages.length && !/static List<Map<String, String>> done\(\) => appStore\.records/.test(h)) fails.push(`${m.ns}: הצעד-הבא לא על רשומות-שנסגרו`); }
// גל ב׳-ה · ×100: תאריכים-יחסיים בעברית + צורות-סכום ב-balaganFacts (היום מוזרק) · בדיקת-Dart מחוללת (רצה ב-ship) · «השבוע» = שמירת-זמן מהיומן · דקות-לפעולה עריכות
const moments = rd(path.join(GEN, 'gen_balagan_moments.dart'));
for (const w of ['מחרתיים', 'בעוד', 'ראשון|שני|שלישי', 'סוף\\s+החודש', 'לחודש', 'אלפיים', '₪']) if (!new RegExp(w).test(moments)) fails.push(`balaganFacts בלי «${w}»`);
if (!/DateTime\? today/.test(moments) || !/balaganDates\(/.test(moments) || !/balaganNums\(/.test(moments)) fails.push('balaganFacts: היום אינו מוזרק / אין balaganDates+balaganNums');
const factsTest = path.join(R.ROOT, '..', 'buildsmart', 'app_flutter', 'test', 'genesis_gen_balagan_facts_test.dart');
if (fs.existsSync(path.join(R.ROOT, '..', 'buildsmart', 'app_flutter', 'pubspec.yaml'))) { const ft = fs.existsSync(factsTest) ? rd(factsTest) : ''; const nExp = (ft.match(/expect\(/g) || []).length; if (nExp < 20 || !/today: today/.test(ft) || !/מחר/.test(ft)) fails.push(`בדיקת-העובדות המחוללת: ${nExp} expect (נדרש ≥20 עם היום-מוזרק ו«מחר»)`); }
if (!/weekStart/.test(home) || !/'minSend'/.test(home) || !/wSaved/.test(home)) fails.push('«היום» בלי «השבוע» (שמירת-זמן מהיומן)');
const behavior = rd(path.join(GEN, 'gen_balagan_behavior.dart'));
for (const key of ['minAdd', 'minSend', 'minAuto']) if (!behavior.includes(`appStore.setting('${key}'`)) fails.push(`«התנהגות» בלי ${key}`);
// רגע-כללי ⇒ שכבת-הבסיס: סף-חולשה נגזר מהנתונים (kBalaganWeak) · הבסיס-הכללי-ביותר ראשון · המודולים-החלשים חלופות; בדיקת-Dart מחוללת מוכיחה (זיהוי ×3)
if (!/const double kBalaganWeak = 0\.\d+;/.test(moments) || !/layer == 'base'/.test(moments) || !/a\.required\.compareTo\(b\.required\)/.test(moments)) fails.push('balaganIdentify בלי נפילה-לבסיס (kBalaganWeak · layer · required)');
{ const ident = buildIdentifier(mods); const selfS = mods.map((m) => (identify(ident, m.title + ' ' + m.moment, 1)[0] || { score: 1 }).score); const weak = +(moments.match(/kBalaganWeak = ([\d.]+)/) || [0, 1])[1]; const gen = identify(ident, 'לשלם ארנונה מחר', 1)[0]; if (gen && gen.score / selfS[gen.i] >= weak) fails.push(`שורה-כללית «לשלם ארנונה מחר» מזוהה בביטחון ${(gen.score / selfS[gen.i]).toFixed(3)} ≥ סף ${weak} — הסף אינו נגזר נכון`); for (const [i, m] of mods.entries()) { const h = identify(ident, m.title, 1)[0]; if (!h || h.ns !== m.ns || h.score / selfS[i] < weak) fails.push(`כותרת «${m.title}» מתחת לסף-החולשה`); } }
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/balaganIdentify\(/.test(ft) || !/layer, 'base'/.test(ft)) fails.push('בדיקת-הזיהוי המחוללת חסרה'); }
const BASE = path.join(HERE, 'balagan-one-baseline.json');
const base = fs.existsSync(BASE) ? JSON.parse(rd(BASE)) : { modules: 0 };
if (mods.length < base.modules) fails.push(`ratchet: מודולים ירדו ${base.modules}⇒${mods.length}`);
if (fails.length) { console.log(`🔴 balagan-one: ${fails.join(' · ')}`); process.exit(1); }
if (process.argv.includes('--write') || !fs.existsSync(BASE)) fs.writeFileSync(BASE, JSON.stringify({ modules: mods.length }));
console.log(`✓ balagan-one: אפליקציה אחת · ${mods.length} מודולים ב«היום»+«מה קרה?»+«נושאים» · מזהה-הרגע ${mods.length}/${mods.length} · אפס רשימה-סגורה (רצפה ${base.modules})`);
