/** בדיקת-קצה של קופסת-ayin — כל 30 החוטים דרך הקופסה בלבד (DoD: node ayin.test.mjs ⇒ exit 0).
 *  מייבאת אך-ורק את הקופסה-שלה (חוק-4). מוכיחה את דוגמאות-החוזה + קלטי-קצה (עברית/ריק/null/שבור). */
import * as B from './ayin.mjs';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

let f = 0;
const eq = (a, b, m) => { try { assert.deepStrictEqual(a, b); } catch { console.error('✗ ' + m + ' → ' + JSON.stringify(a)); f = 1; } };

// דוגמה 1 — תוויות דרך termOf המחווט
eq(B.stageLabel({}, 'lead'), 'בהכנה', 'stageLabel fallback');
eq(B.stageLabel({ terms: { 'ayin.stage.lead': 'טיוטה' } }, 'lead'), 'טיוטה', 'stageLabel override');
eq(B.stageLabel({ terms: { 'ayin.stage.lead': '   ' } }, 'lead'), 'בהכנה', 'stageLabel דריסה-ריקה=fallback');
eq(B.featLabel({}), 'מעקב טיפול', 'featLabel');
eq(B.itemLabel({}), 'שם לטיפול', 'itemLabel');
eq(B.unitLabel({}), 'כמות', 'unitLabel');

// דוגמה 2/3 — סדר-שלבים
eq(B.AYIN_STAGES, ['new', 'lead', 'eyes', 'answer', 'done'], 'AYIN_STAGES');
eq(B.nextStage('answer'), 'done', 'nextStage answer→done');
eq(B.nextStage('done'), null, 'nextStage done→null');
eq(B.stageIndex('zzz'), 0, 'stageIndex לא-מוכר→0');
eq(B.revertPatch('new'), { stage: 'new', answerPushed: false }, 'revertPatch new');
eq(B.revertPatch('done'), { stage: 'done' }, 'revertPatch done');

// דוגמה 4/5 — אגרגטים; קלט-קצה: eyes כמחרוזת/ריק/undefined, time/mat חסרים
eq(B.eyesTotal({ names: [{ eyes: 3 }, { eyes: '2' }, { eyes: '' }] }), 5, 'eyesTotal');
eq(B.boqTotal({ names: [{ eyes: 2, rate: 10 }, { eyes: 3, rate: 0 }] }), 20, 'boqTotal');
eq(B.boqLineAmount({ eyes: '', rate: 5 }), 0, 'boqLineAmount ריק');
eq(B.timeHoursTotal({}), 0, 'timeHoursTotal חסר-time');
eq(B.matCostTotal({ mat: [{ qty: 2, cost: 3 }] }), 6, 'matCostTotal');

// דוגמה 6 — פעילות; קלט-קצה: null
eq(B.ayinActive(null), false, 'ayinActive null');
eq(B.ayinActive({ stage: 'new', names: [], lastTouch: '', answers: [], log: [] }), false, 'ayinActive ריק');
eq(B.ayinActive({ stage: 'lead', names: [], lastTouch: '', answers: [], log: [] }), true, 'ayinActive שלב');

// דוגמה 7 — כפתור-חכם: עברית בכותרת-האירוע
const a1 = { stage: 'new', names: [{ id: '1', name: 'א', eyes: '' }], answers: [], log: [] };
const p1 = B.planAyinAdvance({}, 'כהן', a1);
eq(p1.patch, { stage: 'lead' }, 'planAyinAdvance patch');
if (!p1.event.title.includes('בהכנה — כהן (1 שם לטיפול)')) { console.error('✗ event.title: ' + p1.event.title); f = 1; }
if (p1.toast !== 'נרשמו 1 — נכנס ללוח: בהכנה') { console.error('✗ toast: ' + p1.toast); f = 1; }
// קלט-קצה: כפתור מוסתר בשלב done ⇒ null
eq(B.planAyinAdvance({}, 'x', { stage: 'done', names: [], answers: [], log: [] }), null, 'planAyinAdvance done→null');

// דוגמה 8/9 — הוספת-שם: ריק, כפול (dedup עברי דרך normName←normSearch), תקין+log
const iso = () => '2026-01-01';
eq(B.planAddName({ names: [], log: [] }, '   ', '', 'x', iso), { ok: false, error: 'הקלידו שם לפני ההוספה' }, 'planAddName ריק');
eq(B.planAddName({ names: [{ name: 'דוד' }], log: [] }, 'דוד', '', 'x', iso).ok, false, 'planAddName dedup');
const pa = B.planAddName({ names: [], log: [] }, ' לוי ', 4, 'id9', iso);
eq(pa.ok, true, 'planAddName ok');
eq(pa.names[0], { id: 'id9', name: 'לוי', eyes: 4, done: false }, 'planAddName trim');
eq(pa.log[0], { date: '2026-01-01', eyes: 4, name: 'לוי' }, 'planAddName log');

// תבניות-BOQ עם nextId מוזרק; ריקי-שם מדולגים
const tl = B.namesToTemplateLines([{ name: ' ריק? ', eyes: 2, rate: 3 }, { name: '  ', eyes: 9 }]);
eq(tl, [{ name: 'ריק?', qty: 2, rate: 3 }], 'namesToTemplateLines מדלג-ריק');
const nn = B.templateLinesToNames([{ name: 'x', qty: 2, rate: 5 }], (i) => 'n' + i);
eq(nn, [{ id: 'n0', name: 'x', eyes: 2, done: false, rate: 5 }], 'templateLinesToNames nextId');

// דוגמה 10/11 — גיליון-העיניים
eq([...B.AYIN_SHEET_HEADER][3], 'כמה עיניים', 'AYIN_SHEET_HEADER');
eq(B.parseAyinSheet([['שם למסירה'], ['דמה']], []), { upds: [], miss: 0, error: 'חסרות עמודות "שם למסירה" ו/או "כמה עיניים"' }, 'parseAyinSheet חסר-עמודה');
eq(B.parseAyinSheet([['a']], []).error, 'הקובץ ריק או לא בפורמט CSV', 'parseAyinSheet שורה-בודדת');

// round-trip: ייצוא ⇒ פענוח ⇒ החלה (emptyAyin מוזרק לדוחות)
const emptyAyin = () => ({ stage: 'new', note: '', answeredNote: '', answerPushed: false, nextTalk: '', nextTalkTime: '', lastTouch: '', names: [], answers: [], log: [], time: [], mat: [] });
const sup = [{ id: 's1', name: 'תומכת א', phone: '050', ayin: { ...emptyAyin(), stage: 'eyes', names: [{ id: 'nm1', name: 'שם ראשון', eyes: 7, done: false }] } }];
const sheet = B.ayinSheetRows(sup);
eq(sheet[0], [...B.AYIN_SHEET_HEADER], 'ayinSheetRows כותרת');
eq(sheet[1][7], 'כן', 'ayinSheetRows עופרת=כן (stage=eyes)');
// שינוי בגיליון: נמסר=כן ⇒ done + lastTouch
sheet[1][4] = 'כן';
const parsed = B.parseAyinSheet(sheet, sup);
eq(parsed.miss, 0, 'parseAyinSheet miss=0');
const applied = B.applyAyinSheet(sup, parsed.upds, '2026-02-02');
eq(applied.supporters[0].ayin.names[0].done, true, 'applyAyinSheet done');
eq(applied.supporters[0].ayin.lastTouch, '2026-02-02', 'applyAyinSheet lastTouch');

// דוחות + סינון-לוח (emptyAyin מוזרק; ayin חלקי מלגאסי — חסר log/answers)
const legacyPartial = [{ id: 's2', name: 'ב', phone: '', ayin: { stage: 'answer', names: [{ id: 'x', name: 'פלוני', eyes: 2, done: true }] } }];
const daily = B.ayinDailyRows({}, [{ ...legacyPartial[0], ayin: { ...legacyPartial[0].ayin, lastTouch: '2026-03-03' } }], '2026-03-03', emptyAyin);
eq(daily[0][3], 'שלב', 'ayinDailyRows כותרת');
if (daily.length !== 2) { console.error('✗ ayinDailyRows חלקי-לגאסי לא-נספר'); f = 1; }
const board = B.ayinBoardItems(legacyPartial, emptyAyin);
eq(board.length, 1, 'ayinBoardItems');
eq(B.filterAyinBoard(board, 'פלוני', null, null).length, 1, 'filterAyinBoard טקסט-עברי');
eq(B.filterAyinBoard(board, '', 'wait', null).length, 0, 'filterAyinBoard status=wait (done)');
eq(B.ayinAllRows({}, legacyPartial, emptyAyin).length, 2, 'ayinAllRows');

// עדשה-עוינת: נרמול אות-סופית (ם≡מ, ן≡נ) דרך normSearch המחווט ⇒ dedup תופס
eq(B.normName('בן'), B.normName('בנ'), 'normName אות-סופית ן≡נ');
eq(B.planAddName({ names: [{ name: 'שלום' }], log: [] }, 'שלומ', '', 'x', iso).ok, false, 'dedup אות-סופית ם≡מ');
// עדשה-עוינת: שורות-שבורות/משוננות בגיליון — עמודות חסרות לא מפילות
const ragged = [['תומכת', 'שם למסירה', 'כמה עיניים'], ['תומכת א'], ['תומכת א', 'שם ראשון', '5']];
const pr = B.parseAyinSheet(ragged, sup);
eq(Array.isArray(pr.upds), true, 'parseAyinSheet שורה-משוננת לא-קורסת');

/* 🛡 מגן-הכרעה (דפוס הגנת-מקור): הקופסה טהורה + השקעים מוזרקים + השכנים מיובאים-לא-ממומשים. */
const src = readFileSync(new URL('./ayin.mjs', import.meta.url), 'utf8');
for (const bad of ['new Date(', 'Date.now', 'localStorage', 'fetch(']) {
  if (src.includes(bad)) { console.error('✗ מגן: IO נסתר בקופסה — ' + bad); f = 1; }
}
if (!src.includes('שקעי-IO (החלטת-הקופסה): isoToday · emptyAyin · nextId מוזרקים')) { console.error('✗ מגן: הערת-ההכרעה נמחקה'); f = 1; }
if (!/from '\.\.\/atoms\/term-of\.mjs'/.test(src)) { console.error('✗ מגן: termOf לא מחווט מהאטום'); f = 1; }
if (!/from '\.\.\/atoms\/norm-search\.mjs'/.test(src)) { console.error('✗ מגן: normSearch לא מחווט מהאטום'); f = 1; }
if (/from '\.\.\/boxes\//.test(src) || /from '\.\.\/board/.test(src)) { console.error('✗ מגן: קופסה מייבאת קופסה/לוח (LAW §2)'); f = 1; }

if (f) process.exit(1);
console.log('✓ קופסת-ayin: 30 חוטים · דוגמאות-חוזה + קצה (עברית/ריק/null/לגאסי-חלקי/round-trip) + מגן-הכרעה — ירוק');
