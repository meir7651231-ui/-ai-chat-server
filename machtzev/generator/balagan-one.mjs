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
// גל ב׳-ו · שעה («ב-16:30» ⇒ שדה-שעה מדקדוק-האפיון typeTime) · הבסיס-עם-שעה כשיש שעה · כמה רגעים בשורה ⇒ טופס אחר טופס (queue)
if (!/balaganTimes\(/.test(moments) || !/balaganSplit\(/.test(moments) || !/timeFields/.test(moments) || !/hasTime/.test(moments)) fails.push('balaganFacts/Identify בלי שעה (balaganTimes · timeFields · hasTime) או בלי פיצול (balaganSplit)');
if (!/queue:/.test(confirm) || !/void _next\(\)/.test(confirm) || !/balaganSplit\(/.test(home) || !/balaganSplit\(/.test(ask)) fails.push('כמה-רגעים-בשורה: queue/_next בטופס-האישור או balaganSplit במסך-הראשון/«מה קרה?» חסרים');
if (!mods.some((m) => m.layer === 'base' && m.root.fields.some((f) => /שעה/.test(f.label)))) fails.push('אין מודול-בסיס עם שדה-שעה (יומן)');
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/'שעה'/.test(ft) || !/balaganSplit\(/.test(ft)) fails.push('בדיקת-השעה/הפיצול המחוללת חסרה'); }
// גל ב׳-ז · טלפון/מי/אחוז לפי דקדוק-האפיון · השעה על שורת-היום (DsTodayItem.time) · התוכנית מקבעת שעות
if (!/balaganPhones\(/.test(moments) || !/balaganPersons\(/.test(moments) || !/balaganPercents\(/.test(moments) || !/phoneFields/.test(moments)) fails.push('balaganFacts בלי טלפון/מי/אחוז');
{ const ds = rd(path.join(R.ROOT, 'new/dart-ui-bs/ds/ds.dart')); if (!/this\.time = ''/.test(ds)) fails.push('DsTodayItem בלי time'); }
if (!/fixed\.sort\(/.test(home) || !/DateTime free\(/.test(home) || !/a\.time\.isEmpty \? '99:99'/.test(home)) fails.push('התוכנית-להיום אינה מקבעת שעות / שורות-היום לא לפי שעה');
for (const m of mods.filter((x) => x.root.fields.some((f) => /שעה/.test(f.label)))) { const h = rd(path.join(GEN, `gen_${m.home.slug}.dart`)); if (!/static const List<String> _times = \[gen_/.test(h) || !/_timeOf\(r\)/.test(h)) fails.push(`${m.ns}: ספק-היום בלי שדה-השעה`); }
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/'טלפון'/.test(ft) || !/'לקוח'/.test(ft) || !/'ריבית'/.test(ft)) fails.push('בדיקת טלפון/מי/אחוז המחוללת חסרה'); }
// גל ב׳-ח · ↻ חזרה («כל חודש») — נשמרת ברשומה, «סיים» יוצר את הבא (nextRepeat, חודש-קצר ⇒ יום-אחרון) · שם לפני טלפון · עובדה-בלי-שדה ⇒ «הערה»
if (!/balaganRepeat\(/.test(moments) || !/__repeat/.test(moments) || !/balaganRepeatLabel\(/.test(moments) || !/phones = const \[\]/.test(moments)) fails.push('balaganFacts בלי חזרה / שם-לפני-טלפון');
for (const m of mods) { const h = rd(path.join(GEN, `gen_${m.home.slug}.dart`)); if (!/static DateTime nextRepeat\(/.test(h) || !/__repeat/.test(h) || !/repeatLog|↻/.test(h)) { fails.push(`${m.ns}: «סיים» אינו יוצר את הרגע-החוזר הבא`); break; } }
if (!/confirmRepeat|__repeat/.test(confirm)) fails.push('טופס-האישור אינו מציג חזרה');
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/'__repeat'/.test(ft) || !/nextRepeat\(/.test(ft) || !/'רות לוי'/.test(ft)) fails.push('בדיקת החזרה/השם-לפני-טלפון המחוללת חסרה'); }
if (!/balaganStripGrammar\(/.test(moments) || !/balaganTokens\(balaganStripGrammar\((?:balaganWaStrip\()?text\)?\)\)/.test(moments)) fails.push('הזיהוי אינו מסיר מילות-דקדוק (תאריך/חזרה/שעה/טלפון)');
// גל ב׳-ט · חיפוש בכל התיקים (מסך «נושאים») · גיבוי/שחזור/ביטול ב«חיבורים» (טקסט, אפס-שרת)
{ const topics2 = rd(path.join(GEN, 'gen_balagan_topics.dart')); if (!/appStore\.search\(_q\)/.test(topics2) || !/searchLabel|חיפוש/.test(topics2) || (topics2.match(/case 'app_[a-z0-9]+_ent\d+': return/g) || []).length !== mods.length) fails.push(`«נושאים» בלי חיפוש-בכל-התיקים לכל ${mods.length} המודולים`); }
if (!/appStore\.exportJson\(\)/.test(keys) || !/appStore\.importJson\(/.test(keys) || !/appStore\.undoImport\(\)/.test(keys) || !/Clipboard\.setData/.test(keys)) fails.push('«חיבורים» בלי גיבוי/שחזור/ביטול');
{ const st = rd(path.join(R.ROOT, 'new/dart-ui-bs/ds/ds_store.dart')); if (!/String exportJson\(\)/.test(st) || !/int importJson\(String raw\)/.test(st) || !/\.prev'/.test(st) || !/List<List<String>> search\(String q\)/.test(st)) fails.push('AppStore בלי exportJson/importJson/prev/search'); }
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/exportJson\(\)/.test(ft) || !/\.search\(/.test(ft)) fails.push('בדיקת הגיבוי/החיפוש המחוללת חסרה'); }
// גל ב׳-י · «סיים» = שורה-טופלה + שלב + החזר (kind done) · שמות-חודשים · סכום-במילים
if (!/balaganNumberWords\(/.test(moments) || !/ספטמבר/.test(moments) || !/'done'/.test(home)) fails.push('חסר: סכום-במילים / שמות-חודשים / done ב«עשיתי לבד»');
for (const m of mods) { const h = rd(path.join(GEN, `gen_${m.home.slug}.dart`)); if (!/logAction\('done'/.test(h) || !/prev: prevStage/.test(h)) { fails.push(`${m.ns}: «סיים» בלי החזר`); break; } }
{ const st = rd(path.join(R.ROOT, 'new/dart-ui-bs/ds/ds_store.dart')); if (!/== 'done'\) \{ _decided\.remove/.test(st)) fails.push('AppStore.undo בלי done'); }
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/'1500'/.test(ft) || !/בספטמבר/.test(ft) || !/logAction\('done'/.test(ft)) fails.push('בדיקת סכום-במילים/חודשים/החזר-סיים חסרה'); }
// גל ב׳-יא · תיק-כפול לפני «שמור» · «השבוע הקרוב» (ימים 2–7)
if (!/balaganDuplicates\(/.test(moments) || !/balaganDuplicates\(m, _v\)/.test(confirm) || (confirm.match(/case 'app_[a-z0-9]+_ent\d+': return/g) || []).length !== mods.length) fails.push('טופס-האישור בלי שומר-כפילויות לכל המודולים');
if (!/for \(var d = 2; d <= 7; d\+\+\)/.test(home) || !/soonFold|השבוע הקרוב/.test(home)) fails.push('«היום» בלי «השבוע הקרוב»');
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/balaganDuplicates\(/.test(ft)) fails.push('בדיקת תיק-כפול חסרה'); }
// גל ב׳-יב · «פתח את הקיים» = מיזוג עם החזר
if (!/int balaganMerge\(/.test(moments) || !/balaganMerge\(m, id/.test(confirm)) fails.push('טופס-האישור בלי מיזוג-לתיק-הקיים');
{ const st = rd(path.join(R.ROOT, 'new/dart-ui-bs/ds/ds_store.dart')); if (!/== 'merge'\)/.test(st)) fails.push('AppStore.undo בלי merge'); }
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/balaganMerge\(/.test(ft)) fails.push('בדיקת המיזוג חסרה'); }
// גל ב׳-יג · «ליומן» עם שעה · «לפני N ימים» · דוגמאות בהקשה-אחת ב«מה קרה?»
for (const m of mods) { const h = rd(path.join(GEN, `gen_${m.home.slug}.dart`)); if (!/final tm = r == null \? '' : _timeOf\(r\); final d = _iso\(due\)/.test(h) || !/agoDays|לפני/.test(h)) { fails.push(`${m.ns}: «ליומן» בלי שעה / באיחור בלי «לפני N ימים»`); break; } }
if (!/\.split\('\|'\)\) DsChipButton\(label: ex/.test(ask) || !/_c\.text = ex; _go\(\);/.test(ask)) fails.push('«מה קרה?» בלי דוגמאות-בהקשה-אחת');
// גל ב׳-יד · «התקשר»/«וואטסאפ» בתיק עם טלפון · כרטיסים לפי דחיפות
{ const withPhone = mods.filter((m) => m.root.fields.some((f) => /טלפון|נייד/.test(f.label))); for (const m of withPhone) { const rp = rd(path.join(GEN, `gen_${m.rootPage.slug}.dart`)); if (!/wa\.me\//.test(rp) || !/'tel:'/.test(rp)) { fails.push(`${m.ns}: תיק-עם-טלפון בלי התקשר/וואטסאפ`); break; } } if (!withPhone.length) fails.push('אין מודול עם טלפון (צפוי 28)'); }
if (!/final dueOf = <String, DateTime>\{\}/.test(home) || !/cardRows\.sort/.test(home)) fails.push('«היום»: הכרטיסים לא לפי דחיפות');
// גל ב׳-טו · סכום קריא (8,000) בתיק · שדה-תאריך יחיד ⇒ כותרת בלי תווית
{ const withNum = mods.filter((m) => m.root.fields.some((f) => f.type === 'num')); for (const m of withNum) { const rp = rd(path.join(GEN, `gen_${m.rootPage.slug}.dart`)); if (!/_fmtNum\(r0\[/.test(rp)) { fails.push(`${m.ns}: סכום בתיק בלי מפריד-אלפים`); break; } } }
for (const m of mods) { const h = rd(path.join(GEN, `gen_${m.home.slug}.dart`)); if (!/_mk\(_dates\.length == 1 \? who :/.test(h)) { fails.push(`${m.ns}: כותרת-שורה עם תווית גם כשיש תאריך יחיד`); break; } }
// גל ב׳-טז · שיתוף-מהמכשיר (share_target ⇒ ?text= ⇒ «מה קרה?» מזוהה) · «הדבק»
if (!/this\.initialText = ''/.test(ask) || !/Clipboard\.getData\('text\/plain'\)/.test(ask) || !/_paste/.test(ask)) fails.push('«מה קרה?» בלי initialText/הדבק');
{ const shell = rd(path.join(GEN, 'gen_balagan_shell.dart')); if (!/Uri\.base\.queryParameters/.test(shell) || !/initialText: _sharedText\(\)/.test(shell)) fails.push('השלד אינו פותח שיתוף ב«מה קרה?»'); }
{ const mf = path.join(R.ROOT, '..', 'buildsmart', 'app_flutter', 'web', 'manifest.json'); if (fs.existsSync(mf)) { try { const m = JSON.parse(rd(mf)); if (!m.share_target || !m.share_target.params || m.share_target.params.text !== 'text') fails.push('manifest.json בלי share_target'); } catch { fails.push('manifest.json לא נקרא'); } } }
// גל ב׳-יז · «שתף את היום» (טקסט ⇒ לוח+וואטסאפ) · «ניווט» בתיק-עם-מקום
if (!/^String balaganDayText\(/m.test(home) || !/wa\.me\/\?text=/.test(home) || !/Clipboard\.setData/.test(home)) fails.push('«היום» בלי «שתף את היום»');
{ const withLoc = mods.filter((m) => m.root.fields.some((f) => /מקום|כתובת|מיקום/.test(f.label))); for (const m of withLoc) { const rp = rd(path.join(GEN, `gen_${m.rootPage.slug}.dart`)); if (!/maps\.google\.com\/\?q=/.test(rp)) { fails.push(`${m.ns}: תיק-עם-מקום בלי «ניווט»`); break; } } if (!withLoc.length) fails.push('אין מודול עם מקום (צפוי ≥1: יומן)'); }
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/balaganDayText\(/.test(ft)) fails.push('בדיקת «שתף את היום» חסרה'); }
// גל ב׳-יח · דוגמאות במסך-ריק · «אחרונים» ב«נושאים» · שורת-היום בלי «היום»
if (!/if \(empty\) Padding\(padding: const EdgeInsets\.only\(top: 6\), child: Wrap/.test(home) || /it\.sub \+ ' · ' \+ it\.module/.test(home)) fails.push('«היום»: מסך-ריק בלי דוגמאות / שורה עם «·» מוביל');
{ const topics2 = rd(path.join(GEN, 'gen_balagan_topics.dart')); if (!/recentTitle|אחרונים/.test(topics2) && !/for \(final e in appStore\.log\)/.test(topics2)) fails.push('«נושאים» בלי «אחרונים»'); }
// גל ב׳-יט · ייצוא-וואטסאפ: כותרת נקלפת · השולח = אדם · תזכורת-התקנה
if (!/balaganWaStrip\(/.test(moments) || !/balaganWaSender\(/.test(moments) || !/balaganStripGrammar\(balaganWaStrip\(text\)\)/.test(moments)) fails.push('balaganFacts/Identify בלי קילוף כותרת-וואטסאפ');
{ const kc = rd(path.join(R.dataOutDir(), 'gen_balagan_keys_content.dart')); if (!/הוסף למסך הבית/.test(kc)) fails.push('«חיבורים» בלי תזכורת-התקנה'); }
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/balaganWaStrip\(/.test(ft)) fails.push('בדיקת ייצוא-וואטסאפ חסרה'); }
// גל ב׳-כ · מצב-ערב (מחר פתוח מהשעה שנקבעה) · «בוצע … · החזר» ליד העין
if (!/appStore\.setting\('eveningHour', '18'\)/.test(home) || !/DsFold\(open: evening/.test(home) || !/showUndo/.test(home)) fails.push('«היום» בלי מצב-ערב / החזר-מיידי');
if (!/appStore\.setting\('eveningHour'/.test(behavior)) fails.push('«התנהגות» בלי שעת-ערב');
// גל ב׳-כא · «דבר» (זיהוי-דיבור של הדפדפן, web-only, סטאב אחרת) · «דחה למחר» לא בשבת
if (!/voiceListen\('he-IL'\)/.test(ask) || !/voiceSupported/.test(ask)) fails.push('«מה קרה?» בלי «דבר»');
{ const v = rd(path.join(R.ROOT, 'new/dart-ui-bs/ds/ds_voice.dart')); const vw = rd(path.join(R.ROOT, 'new/dart-ui-bs/ds/ds_voice_web.dart')); if (!/if \(dart\.library\.js_interop\)/.test(v) || !/SpeechRecognition/.test(vw) || /https?:\/\//.test(vw)) fails.push('שקע-הדיבור: אין ייבוא-מותנה / אין SpeechRecognition / יש כתובת-שרת'); }
for (const m of mods) { const h = rd(path.join(GEN, `gen_${m.home.slug}.dart`)); if (!/_shift\(due\.add\(const Duration\(days: 1\)\), false\)/.test(h)) { fails.push(`${m.ns}: «דחה למחר» נוחת בשבת`); break; } }
// גל ב׳-כב · «דבר» גם במסך-הראשון
if (!/voiceListen\('he-IL'\)/.test(home)) fails.push('«היום» בלי «דבר» ליד השורה-המהירה');
// גל ב׳-כג · חלקי-יום (בבוקר/בערב ⇒ שעה) · «שתף» בתיק של מודול-בלי-דוח
if (!/בבוקר/.test(moments) || !/'בערב': '19:00'/.test(moments) || !/hasDate && hits\.first\.module\.dateFields\.isEmpty/.test(moments)) fails.push('balaganTimes בלי חלקי-יום / הזיהוי מתעלם מתאריך-בלי-שדה');
{ const noRep = mods.filter((m) => !m.report); for (const m of noRep) { const rp = rd(path.join(GEN, `gen_${m.rootPage.slug}.dart`)); if (!/wa\.me\/\?text=/.test(rp)) { fails.push(`${m.ns}: תיק-בלי-דוח בלי «שתף»`); break; } } if (!noRep.length) fails.push('אין מודול בלי דוח (צפוי: משימות/יומן)'); }
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/בבוקר/.test(ft)) fails.push('בדיקת חלקי-יום חסרה'); }
// גל ב׳-כד · «ערוך» מעמוד-התיק (editId במסך-הישות) · «בעוד שעה» ⇒ שעה
for (const m of mods) { const rp = rd(path.join(GEN, `gen_${m.rootPage.slug}.dart`)); const ent = rd(path.join(GEN, `gen_${m.root.slug}.dart`)); if (!/\(editId: id\)/.test(rp) || !/this\.editId/.test(ent)) { fails.push(`${m.ns}: תיק בלי «ערוך» / מסך-ישות בלי editId`); break; } }
if (!/בעוד\\s\+\(שעה\|שעתיים/.test(moments) && !/'שעתיים'/.test(moments)) fails.push('balaganTimes בלי «בעוד שעה»');
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/בעוד שעה/.test(ft)) fails.push('בדיקת «בעוד שעה» חסרה'); }
// גל ב׳-כה · «מחק» עם החזר · «מה קרה מאז?» (הערה מתוארכת) בתיק
for (const m of mods) { const rp = rd(path.join(GEN, `gen_${m.rootPage.slug}.dart`)); if (!/logAction\('del'/.test(rp) || !/'__note': \(prev\.isEmpty/.test(rp)) { fails.push(`${m.ns}: תיק בלי «מחק»-עם-החזר / הוספת-הערה`); break; } }
{ const st = rd(path.join(R.ROOT, 'new/dart-ui-bs/ds/ds_store.dart')); if (!/void restore\(String entity/.test(st) || !/== 'del'\)/.test(st)) fails.push('AppStore בלי restore / undo del'); }
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/logAction\('del'/.test(ft)) fails.push('בדיקת מחיקה-עם-החזר חסרה'); }
// גל ב׳-כו · «אנשים» ב«נושאים» · «סגור תיק» בתיק עם שלבים
{ const topics2 = rd(path.join(GEN, 'gen_balagan_topics.dart')); if (!/m\.personFields/.test(topics2) || !/peopleTitle|אנשים/.test(topics2 + rd(path.join(R.dataOutDir(), 'gen_balagan_topics_content.dart')))) fails.push('«נושאים» בלי «אנשים»'); }
for (const m of mods.filter((x) => x.root.stages && x.root.stages.length)) { const rp = rd(path.join(GEN, `gen_${m.rootPage.slug}.dart`)); if (!/AppStore\.stageKey: '\d+'/.test(rp) || !/field: AppStore\.stageKey, prev: prev/.test(rp)) { fails.push(`${m.ns}: תיק-עם-שלבים בלי «סגור תיק»-עם-החזר`); break; } }
// גל ב׳-כז · «דחה לשבוע» בבאיחור · שורות-מחר עם פעולות · DsActionRow: >3 פעולות בשורה שנייה
for (const m of mods) { const h = rd(path.join(GEN, `gen_${m.home.slug}.dart`)); if (!/Duration\(days: 7\)\), false\)/.test(h)) { fails.push(`${m.ns}: בלי «דחה לשבוע»`); break; } }
if (!/for \(final it in tomorrow\) DsActionRow\(title: it\.title, [^\n]*?actions: it\.actions, onAct: it\.act\)/.test(home)) fails.push('שורות-מחר בלי פעולות');
{ const ds = rd(path.join(R.ROOT, 'new/dart-ui-bs/ds/ds.dart')); if (!/if \(actions\.length > 3\) Padding/.test(ds)) fails.push('DsActionRow בלי שורה-שנייה ל->3 פעולות'); }
// גל ב׳-כח · «בלי תאריך»: ספק-undated בכל מודול · קיפול ב«היום» עם קבע-למחר/לשבוע/התעלם · בדיקה מחוללת
for (const m of mods) { const h = rd(path.join(GEN, `gen_${m.home.slug}.dart`)); if (!/static List<DsTodayItem> undated\(DateTime today\)/.test(h) || !/decide\('undated:\$rid', 'no'\)/.test(h)) { fails.push(`${m.ns}: בלי ספק-«בלי תאריך»`); break; } }
if (!/final undated = <DsTodayItem>\[for \(final m in _mods\) \.\.\.m\.undated\(today\)\]/.test(home) || !/for \(final it in undated\) DsActionRow\(title: it\.title, [^\n]*?actions: it\.actions, onAct: it\.act\)/.test(home)) fails.push('«היום» בלי קיפול «בלי תאריך»');
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/\.undated\(today\)/.test(ft)) fails.push('בדיקת «בלי תאריך» חסרה'); }
// גל ב׳-כט · כסף-במבט: balaganMoney נגזרת מהשורות · מוצג ב«היום» · בשיתוף · בבדיקה
if (!/double balaganMoney\(List<DsTodayItem> items\)/.test(home) || !/final money = balaganMoney\(\[\.\.\.overdue, \.\.\.todayItems\]\); final moneyTm = balaganMoney\(tomorrow\);/.test(home) || !/balaganDayText\(overdue, todayItems, _day\(DateTime\.now\(\)\), money: balaganMoney/.test(home)) fails.push('«היום» בלי כסף-במבט');
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/balaganMoney\(\[it\(a\), it\(a\)/.test(ft)) fails.push('בדיקת כסף-במבט חסרה'); }
// גל ב׳-ל · «נשכחים»: ספק-stale בכל מודול · קיפול ב«היום» · בדיקה מחוללת
for (const m of mods) { const h = rd(path.join(GEN, `gen_${m.home.slug}.dart`)); if (!/static List<DsTodayItem> stale\(DateTime today\)/.test(h) || !/decision\('stale:\$rid'\) == 'no'/.test(h)) { fails.push(`${m.ns}: בלי ספק-«נשכחים»`); break; } }
if (!/final stale = <DsTodayItem>\[for \(final m in _mods\) for \(final it in m\.stale\(today\)\) if \(!_standing\.contains\(it\.rid\)\) it\]/.test(home) || !/_standing\.add\(rid\)/.test(home) || !/for \(final it in stale\) DsActionRow\(title: it\.title, [^\n]*?actions: it\.actions, onAct: it\.act\)/.test(home)) fails.push('«היום» בלי קיפול «נשכחים»');
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/\.stale\(today\)/.test(ft)) fails.push('בדיקת «נשכחים» חסרה'); }
// גל ב׳-לא · צ׳יפי-מועד בטופס-האישור: תווית ⇒ תאריך דרך balaganDates · המועד תמיד בין השורות · בדיקה
{ const cf = rd(path.join(GEN, 'gen_balagan_confirm.dart')); if (!/List<List<String>> balaganDateChips\(DateTime today\)/.test(cf) || !/balaganDates\(c, today\)\.take\(1\)/.test(cf) || !/setState\(\(\) => _v\[dateF\] = c\[1\]\)/.test(cf) || !/shown\.add\(m\.fields\.firstWhere\(\(f\) => f\.label == dateF\)\)/.test(cf)) fails.push('טופס-האישור בלי צ׳יפי-מועד'); }
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/balaganDateChips\(today\)/.test(ft)) fails.push('בדיקת צ׳יפי-מועד חסרה'); }
// גל ב׳-לב · «התעלם» עם החזר: שלוש ההתעלמויות (שורה · בלי-תאריך · נשכחים) נרשמות ביומן עם מפתח-ההכרעה
for (const m of mods) { const h = rd(path.join(GEN, `gen_${m.home.slug}.dart`)); if (!/field: 'ign:\$rid:\$field'\)/.test(h) || !/field: 'undated:\$rid'\)/.test(h) || !/field: 'stale:\$rid'\)/.test(h)) { fails.push(`${m.ns}: «התעלם» בלי החזר`); break; } }
if (!/lastAct\['kind'\] == 'decide'\)/.test(home)) fails.push('«בוצע · החזר» בלי decide');
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/'ign:' \+ id \+ ':' \+ F/.test(ft)) fails.push('בדיקת «התעלם»-עם-החזר חסרה'); }
// גל ב׳-לג · צ׳יפי-שעה (balaganTimes) + צ׳יפי-אנשים (מי שכבר בתיקים) בטופס-האישור
{ const cf = rd(path.join(GEN, 'gen_balagan_confirm.dart')); if (!/balaganTimes\(c, now: now\)\.take\(1\)/.test(cf) || !/shown\.add\(m\.fields\.firstWhere\(\(f\) => f\.label == m\.timeFields\.first\)\)/.test(cf) || !/List<String> balaganPeople\(/.test(cf) || !/_v\[m\.timeFields\.first\] = c\[1\]/.test(cf) || !/_v\[m\.personFields\.first\] = p/.test(cf)) fails.push('טופס-האישור בלי צ׳יפי-שעה/אנשים'); }
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/balaganTimeChips\(/.test(ft) || !/balaganPeople\(\)/.test(ft)) fails.push('בדיקת צ׳יפי-שעה/אנשים חסרה'); }
// גל ב׳-לד · צ׳יפי-חזרה (balaganRepeat) בטופס-האישור · שורות-השבוע-הקרוב עם פעולות
{ const cf = rd(path.join(GEN, 'gen_balagan_confirm.dart')); if (!/balaganRepeat\(c\)\.take\(1\)/.test(cf) || !/_v\['__repeat'\] = c\[1\]/.test(cf) || !/balaganRepeatLabel\(_v\['__repeat'\]!\)/.test(cf)) fails.push('טופס-האישור בלי צ׳יפי-חזרה'); }
if (!/actions: \(x\[1\] as DsTodayItem\)\.actions, onAct: \(x\[1\] as DsTodayItem\)\.act\)/.test(home)) fails.push('שורות-השבוע בלי פעולות');
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/balaganRepeatChips\(\)/.test(ft)) fails.push('בדיקת צ׳יפי-חזרה חסרה'); }
// גל ב׳-לה · כרטיס-אדם ב«נושאים» (balaganPerson · התקשר/וואטסאפ) · כסף בכותרות מחר/השבוע
if (!/BalaganPerson\? balaganPerson\(String name\)/.test(topics) || !/wa\.me\/' \+ balaganIntl\(ph\)/.test(topics) || !/for \(final p in \[balaganPerson(?:For)?\(_q\)\]\) if \(p != null\) DsSection/.test(topics)) fails.push('«נושאים» בלי כרטיס-אדם');
if (!/final moneyWk = balaganMoney\(\[for \(final x in soon\) x\[1\] as DsTodayItem\]\)/.test(home) || !/balaganFmtMoney\(moneyTm\)\) : ''\), details:/.test(home)) fails.push('כותרות מחר/השבוע בלי כסף');
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/balaganPerson\('יעל ברק'\)/.test(ft)) fails.push('בדיקת כרטיס-אדם חסרה'); }
// גל ב׳-לו · שם-אדם בשורה-המהירה ⇒ הכרטיס · תזכורת-גיבוי (מעולם/30 יום, ≥10 תיקים) · חותמת-גיבוי ב«חיבורים»
if (!/bool balaganBackupDue\(int records, int age\)/.test(home) || !/balaganPerson\(s\) != null/.test(home) || !/initialQuery: s\.trim\(\)/.test(home) || !/setSetting\('backupAt', _iso\(today\)\)/.test(home)) fails.push('«היום» בלי קיצור-אדם / תזכורת-גיבוי');
if (!/setSetting\('backupAt'/.test(keys)) fails.push('«חיבורים» בלי חותמת-גיבוי');
if (!/late String _q = widget\.initialQuery/.test(topics)) fails.push('«נושאים» בלי initialQuery');
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/balaganBackupDue\(10, 30\)/.test(ft)) fails.push('בדיקת גיבוי חסרה'); }
// גל ב׳-לז · תזכורות-מרוכזות: remPending בכל מודול · rem=false · כרטיס-אחד ב«היום» · החזר-מרוכז ב-DS
for (const m of mods) { const h = rd(path.join(GEN, `gen_${m.home.slug}.dart`)); if (!/static List<DsTodayItem> remPending\(DateTime today\)/.test(h) || !/bool rem = true\}/.test(h) || !/if \(rem\) for \(final f in _dates\)/.test(h)) { fails.push(`${m.ns}: בלי remPending / rem`); break; } }
if (!/final groupRem = rems\.length > 3;/.test(home) || !/rem: !groupRem\)/.test(home) || !/prev: remKeys\.skip\(1\)\.join\(','\)/.test(home)) fails.push('«היום» בלי תזכורות-מרוכזות');
{ const st = rd(path.join(R.ROOT, 'new/dart-ui-bs/ds/ds_store.dart')); if (!/for \(final k in \(e\['prev'\] \?\? ''\)\.split\(','\)\) \{ if \(k\.isNotEmpty\) _decided\.remove\(k\); \}/.test(st)) fails.push('AppStore בלי החזר-מרוכז'); }
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/\.remPending\(today\)/.test(ft)) fails.push('בדיקת תזכורות-מרוכזות חסרה'); }
// גל ב׳-לח · «התקשר» על שורת-היום (תיק עם טלפון) · כרטיס-אדם מחיפוש-חלקי
for (const m of mods) { const h = rd(path.join(GEN, `gen_${m.home.slug}.dart`)); if (!/static const List<String> _phones = \[/.test(h) || !/if \(phone\.isNotEmpty\) /.test(h) || !/launchUrl\(Uri\.parse\('tel:' \+ ph\)/.test(h) || !/rep, ph\)\); continue; \}/.test(h)) { fails.push(`${m.ns}: בלי «התקשר» על שורת-היום`); break; } }
if (!/BalaganPerson\? balaganPersonFor\(String q\)/.test(topics) || !/for \(final p in \[balaganPersonFor\(_q\)\]\)/.test(topics)) fails.push('«נושאים» בלי כרטיס-אדם מחיפוש-חלקי');
if (fs.existsSync(factsTest)) { const ft = rd(factsTest); if (!/balaganPersonFor\('שגב'\)/.test(ft)) fails.push('בדיקת חיפוש-חלקי חסרה'); }
const BASE = path.join(HERE, 'balagan-one-baseline.json');
const base = fs.existsSync(BASE) ? JSON.parse(rd(BASE)) : { modules: 0 };
if (mods.length < base.modules) fails.push(`ratchet: מודולים ירדו ${base.modules}⇒${mods.length}`);
if (fails.length) { console.log(`🔴 balagan-one: ${fails.join(' · ')}`); process.exit(1); }
if (process.argv.includes('--write') || !fs.existsSync(BASE)) fs.writeFileSync(BASE, JSON.stringify({ modules: mods.length }));
console.log(`✓ balagan-one: אפליקציה אחת · ${mods.length} מודולים ב«היום»+«מה קרה?»+«נושאים» · מזהה-הרגע ${mods.length}/${mods.length} · אפס רשימה-סגורה (רצפה ${base.modules})`);
