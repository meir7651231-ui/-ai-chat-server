/** בדיקת-קצה: מנוע-החייגן המלא דרך הקופסה בלבד — כל 10 דוגמאות-החוזה. */
import {
  startCampaign, currentId, applyOutcome, progress, isDone, undoLast,
  appendCall, popCall, callStats, campaignCsvRows,
  REQUEUE_OUTCOMES, TERMINAL_OUTCOMES, OUTCOME_LABELS, CALL_LOG_CAP,
} from './dialer.mjs';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

let f = 0;
const check = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const ISO = '2026-01-01';

// 1) דדופ + סינון-falsy, סדר נשמר
const c1 = startCampaign('קיץ', ['a', '', 'a', 'b'], ISO);
check(JSON.stringify(c1.queue) === '["a","b"]' && c1.total === 2 && c1.startedAt === ISO && c1.log.length === 0, '1 startCampaign דדופ');
check(currentId(c1) === 'a', '1b currentId חזית');

// 2) לא-סופי ⇒ requeue לסוף, בלי note
const c2 = applyOutcome(c1, 'noanswer', '', ISO);
check(JSON.stringify(c2.queue) === '["b","a"]', '2 noanswer לסוף');
check(c2.log[0].id === 'a' && c2.log[0].outcome === 'noanswer' && c2.log[0].at === ISO && !('note' in c2.log[0]), '2b log בלי note');

// 3) סופי ⇒ הסרה, עם note (trim)
const c3 = applyOutcome(c1, 'donated', '  תרם 100  ', ISO);
check(JSON.stringify(c3.queue) === '["b"]', '3 donated הסרה');
check(c3.log[0].note === 'תרם 100', '3b note trim');

// 4) queue ריק ⇒ no-op (אותו object)
const empty = { name: 'x', startedAt: ISO, queue: [], total: 0, log: [] };
check(applyOutcome(empty, 'donated', 'z', ISO) === empty, '4 no-op זהות');
check(currentId(empty) === null, '4b currentId null');

// 5) progress — לא-ענה פר-אדם (ייחודי), לא פר-ניסיון
const camp5 = {
  name: 'p', startedAt: ISO, total: 2, queue: ['a'],
  log: [{ id: 'a', outcome: 'noanswer', at: ISO }, { id: 'a', outcome: 'noanswer', at: ISO }, { id: 'b', outcome: 'refused', at: ISO }],
};
const p5 = progress(camp5);
check(p5.remaining === 1 && p5.finalized === 1, '5 remaining/finalized');
check(p5.counts.noanswer === 1, '5b noanswer פר-אדם=1 (לא 2)');
check(p5.counts.refused === 1, '5c refused=1');
check(p5.total === 2, '5d total');

// 6) undoLast אחרי noanswer ⇒ חזרה לחזית, מוסר מסוף-התור
const u = undoLast(c2); // c2.queue=['b','a'], log=[na(a)]
check(JSON.stringify(u.queue) === '["a","b"]' && u.log.length === 0, '6 undo noanswer חזית+הסרה-מהסוף');
// undo של תוצאה-סופית ⇒ פשוט חוזר לחזית
const u3 = undoLast(c3); // queue=['b'], log=[donated(a)]
check(JSON.stringify(u3.queue) === '["a","b"]' && u3.log.length === 0, '6b undo סופי חזית');
check(undoLast(empty) === empty, '6c undo בלי-יומן no-op');

// 7) appendCall — טבעת, skip לא-נרשם
const a7 = appendCall(undefined, 'donated', ISO);
check(JSON.stringify(a7) === JSON.stringify([{ at: ISO, outcome: 'donated' }]), '7 appendCall ראשון');
check(appendCall(a7, 'skip', ISO) === a7, '7b skip לא-נרשם (אותו מערך)');

// 8) 201 שיחות ⇒ 200 (טבעת), הראשונה נשמטת
let ring = undefined;
for (let i = 0; i < 201; i++) ring = appendCall(ring, 'noanswer', 'd' + i);
check(ring.length === CALL_LOG_CAP && ring.length === 200, '8 טבעת 200');
check(ring[0].at === 'd1', '8b הראשונה (d0) נשמטה');
check(JSON.stringify(popCall(ring.slice(0, 1))) === '[]', '8c popCall');
check(popCall(undefined) === undefined, '8d popCall undefined');

// 9) callStats
const s9 = callStats([{ at: ISO, outcome: 'noanswer' }, { at: '2026-02-02', outcome: 'donated' }]);
check(s9.total === 2 && s9.last === '2026-02-02' && s9.noanswer === 1, '9 callStats');
const s9e = callStats(undefined);
check(s9e.total === 0 && s9e.last === '' && s9e.noanswer === 0, '9b callStats undefined');

// 10) campaignCsvRows — כותרת + תוויות מ-OUTCOME_LABELS
const rows = campaignCsvRows(camp5, (id) => 'שם-' + id);
check(JSON.stringify(rows[0]) === JSON.stringify(['שם', 'תוצאה', 'הערה', 'מתי']), '10 כותרת');
check(rows[3][0] === 'שם-b' && rows[3][1] === 'סירב/ה', '10b תווית refused=סירב/ה');
check(rows[1][1] === 'לא ענה' && rows[1][2] === '', '10c תווית+הערה-ריקה');

// קבועים חשופים
check(JSON.stringify(REQUEUE_OUTCOMES) === '["noanswer","skip"]', 'const REQUEUE');
check(JSON.stringify(TERMINAL_OUTCOMES) === '["donated","refused","callback","done"]', 'const TERMINAL');
check(OUTCOME_LABELS.donated === 'תרם/ה' && OUTCOME_LABELS.skip === 'דילוג', 'const LABELS');

// עדשה-עוינת: קלט-קצה שהמקור מטפל בו
check(currentId({ queue: [], log: [] }) === null, 'edge queue-ריק currentId');
check(applyOutcome({ queue: ['a'], total: 1, log: [], name: 'e', startedAt: ISO }, 'noanswer', '   ', ISO).log[0].note === undefined, 'edge note רק-רווחים ⇒ אין note');
check(isDone({ queue: [] }) === true && isDone({ queue: ['x'] }) === false, 'edge isDone');

/* 🛡 מגן-הכרעה: החיווט (קבוע-שכן→פונקציה) חתום verbatim מול המקור. */
const src = readFileSync(new URL('./dialer.mjs', import.meta.url), 'utf8');
check(src.includes('applyOutcomeAtom(c, outcome, note, iso, currentIdAtom, REQUEUE_OUTCOMES)'), 'מגן: apply-outcome ← current-id+requeue');
check(src.includes('progressAtom(c, REQUEUE_OUTCOMES)'), 'מגן: progress ← requeue');
check(src.includes('undoLastAtom(c, REQUEUE_OUTCOMES)'), 'מגן: undo-last ← requeue');
check(src.includes('appendCallAtom(calls, outcome, iso, CALL_LOG_CAP)'), 'מגן: append-call ← call-log-cap');
check(src.includes('campaignCsvRowsAtom(c, nameOf, OUTCOME_LABELS)'), 'מגן: csv ← outcome-labels');

if (f) process.exit(1);
console.log('✓ קופסת-החייגן: 10 דוגמאות-חוזה + קצוות + מגן-חיווט — ירוק');
