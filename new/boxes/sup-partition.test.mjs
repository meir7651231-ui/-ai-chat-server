/** בדיקת-קצה · קופסת-פירוק-התומכים — כל דוגמאות-החוזה דרך הקופסה בלבד.
 *  DoD (לפני-הקוד): node sup-partition.test.mjs ⇒ exit 0. */
import {
  SHARED_SUP_KEY, SUP_KEYED_COLS,
  supKeyOf, docSkey, supKeyMapOf, supAllowedKeys, stripSupKey, stripAuditMeta,
} from './sup-partition.mjs';
let f = 0;
const eq = (got, want, msg) => { if (JSON.stringify(got) !== JSON.stringify(want)) { console.error(`✗ ${msg}: ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`); f = 1; } };

// ── SHARED_SUP_KEY + SUP_KEYED_COLS ──
eq(SHARED_SUP_KEY, '_shared_', 'SHARED_SUP_KEY');
eq(SUP_KEYED_COLS, ['supporters', 'events'], 'SUP_KEYED_COLS');

// ── supKeyOf ──
eq(supKeyOf({ forWho: 'רפואה' }), 'רפואה', 'supKeyOf ייעוד');
eq(supKeyOf({ forWho: '  חינוך  ' }), 'חינוך', 'supKeyOf trim');
eq(supKeyOf({ forWho: '   ' }), '_shared_', 'supKeyOf רווחים');
eq(supKeyOf({}), '_shared_', 'supKeyOf חסר');
eq(supKeyOf({ forWho: null }), '_shared_', 'supKeyOf null');

// ── docSkey ──
eq(docSkey('supporters', { forWho: 'חינוך' }, new Map()), 'חינוך', 'docSkey supporters');
eq(docSkey('events', { spId: 's1' }, new Map([['s1', 'רפואה']])), 'רפואה', 'docSkey events מקושר');
eq(docSkey('events', { spId: 'sX' }, new Map()), '_shared_', 'docSkey events spId-לא-במפה');
eq(docSkey('events', {}, new Map()), '_shared_', 'docSkey events בלי-spId');
eq(docSkey('events', { spId: 123 }, new Map()), '_shared_', 'docSkey events spId-לא-מחרוזת');
eq(docSkey('families', { forWho: 'x' }, new Map()), '', 'docSkey לא-נאכף');

// ── supKeyMapOf ──
const m = supKeyMapOf([{ id: 's1', forWho: 'רפואה' }, { id: 's2', forWho: '' }]);
eq([...m], [['s1', 'רפואה'], ['s2', '_shared_']], 'supKeyMapOf');

// ── supAllowedKeys ──
eq(supAllowedKeys(['רפואה', 'חינוך', 'רפואה', '  ']), ['רפואה', 'חינוך', '_shared_'], 'supAllowedKeys dedup/trim/empty');
eq(supAllowedKeys([]), ['_shared_'], 'supAllowedKeys ריק');
const big = supAllowedKeys(Array.from({ length: 40 }, (_, i) => `k${i}`));
if (big.length !== 30) { console.error(`✗ supAllowedKeys cap: אורך ${big.length} ≠ 30`); f = 1; }
if (big[29] !== '_shared_') { console.error('✗ supAllowedKeys: המשותף לא בזנב אחרי החיתוך'); f = 1; }

// ── stripSupKey ──
eq(stripSupKey({ a: 1, skey: 'x' }), { a: 1 }, 'stripSupKey מקלף');
const noKey = { a: 1 };
if (stripSupKey(noKey) !== noKey) { console.error('✗ stripSupKey: בלי-skey החזיר עותק ולא הפניה'); f = 1; }

// ── stripAuditMeta ──
eq(stripAuditMeta({ m: 1, audit: [1, 2] }), { m: 1 }, 'stripAuditMeta מקלף');
const noAudit = { m: 1 };
if (stripAuditMeta(noAudit) !== noAudit) { console.error('✗ stripAuditMeta: בלי-audit החזיר עותק ולא הפניה'); f = 1; }

/* 🛡 מגן-הכרעה: החיווט חתום — supKeyOf מוזרק-SHARED, ו-docSkey/supKeyMapOf מזריקים
   את supKeyOf המחווט (לא את האטום-הגולמי). קורא את מקור-הקופסה verbatim. */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./sup-partition.mjs', import.meta.url), 'utf8');
if (!src.includes('supKeyOfAtom(sp, SHARED)')) { console.error('✗ מגן: supKeyOf לא מזריק את SHARED'); f = 1; }
if (!src.includes('docSkeyAtom(col, data, supKeyBySpId, supKeyOf, SHARED)')) { console.error('✗ מגן: docSkey לא מזריק supKeyOf+SHARED'); f = 1; }
if (!src.includes('supKeyMapOfAtom(supporters, supKeyOf)')) { console.error('✗ מגן: supKeyMapOf לא מזריק supKeyOf'); f = 1; }
if (!src.includes('supAllowedKeysAtom(allowed, SHARED)')) { console.error('✗ מגן: supAllowedKeys לא מזריק SHARED'); f = 1; }
if (!src.includes("const SHARED = SHARED_SUP_KEY")) { console.error('✗ מגן: המפתח-המשותף אינו SHARED_SUP_KEY'); f = 1; }

if (f) process.exit(1);
console.log('✓ קופסת-פירוק-התומכים: 8 חוטים · כל דוגמאות-החוזה + מגן-חיווט ירוקים');
