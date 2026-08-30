import { rangeLabel as __pure_rangeLabel } from './range-label.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_rangeLabel_RANGE_LABEL_T = {
  k1: "כל התאריכים",
  k2: "מ-",
  k3: "עד ",
};
const rangeLabel = (...a) => __pure_rangeLabel(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_rangeLabel_RANGE_LABEL_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// שקע-fmtDate בהתנהגות-המקור (reports/lib fmtDate: ISO ⇒ dd/mm/yyyy) + תיעוד-קריאות
const mkFmt = () => {
  const calls = [];
  const fmtDate = (iso) => {
    calls.push(iso);
    const [y, m, d] = iso.slice(0, 10).split('-');
    return `${d}/${m}/${y}`;
  };
  return { fmtDate, calls };
};

// 1) שני הגבולות ריקים — fmtDate לא נקרא
{
  const { fmtDate, calls } = mkFmt();
  ok(rangeLabel({ from: '', to: '' }, fmtDate) === 'כל התאריכים', 'דוגמה 1: התווית שגויה');
  ok(calls.length === 0, 'דוגמה 1: fmtDate נקרא למרות טווח ריק');
}

// 2) שני גבולות + 5) עדות-שקע: שתי קריאות כסדרן
{
  const { fmtDate, calls } = mkFmt();
  const out = rangeLabel({ from: '2026-01-05', to: '2026-03-10' }, fmtDate);
  ok(out === '05/01/2026 – 10/03/2026', 'דוגמה 2: "' + out + '" ≠ "05/01/2026 – 10/03/2026"');
  ok(calls.length === 2 && calls[0] === '2026-01-05' && calls[1] === '2026-03-10',
    'דוגמה 5: סדר/מספר קריאות-fmtDate שגוי');
}

// 3) רק from
{
  const { fmtDate } = mkFmt();
  const out = rangeLabel({ from: '2026-01-05', to: '' }, fmtDate);
  ok(out === 'מ-05/01/2026', 'דוגמה 3: "' + out + '" ≠ "מ-05/01/2026"');
}

// 4) רק to
{
  const { fmtDate } = mkFmt();
  const out = rangeLabel({ from: '', to: '2026-03-10' }, fmtDate);
  ok(out === 'עד 10/03/2026', 'דוגמה 4: "' + out + '" ≠ "עד 10/03/2026"');
}

process.exit(f);
