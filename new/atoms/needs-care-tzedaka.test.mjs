import { needsCare as __pure_needsCare } from './needs-care-tzedaka.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_needsCare_NEEDS_CARE_TZEDAKA_T = {
  k1: "entity.tzBox",
  k2: "קופה",
  k3: "stale",
  k4: " לא רוקנה מזמן",
  k5: "ריקון אחרון: ",
  k6: "מעולם לא רוקנה (מאז ",
  k7: "lost",
  k8: " מסומנת כאבודה",
  k9: "לברר או להוציא משימוש",
  k10: "home",
  k11: "inactiveCoord",
  k12: " אינו פעיל אך עדיין עם ",
  k13: " קופות בבתים",
  k14: "להעביר לרכז אחר או להחזיר למשרד",
  k15: "campaignEnding",
  k16: "המבצע \"",
  k17: "\" מסתיים ב-",
  k18: "לסכם ולסגור",
  k19: 14,
};
const needsCare = (...a) => __pure_needsCare(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_needsCare_NEEDS_CARE_TZEDAKA_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const TODAY = '2026-08-24';
// שקעי-בדיקה דטרמיניסטיים
const isoOf = (d) => {
  const p = (n) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
};
const base = {
  termOf: (cfg, key, fb) => fb,
  staleBoxes: () => [],
  lastCollectionIso: () => '',
  coordinatorBoxes: (boxes, cid) => boxes.filter((b) => b.coordId === cid),
  isoOf,
};
const emptyDb = { tzBoxes: [], tzCoordinators: [], tzCampaigns: [] };

// 1) קופה מוזנחת עם ריקון-אחרון
{
  const b = { id: 'b1', num: 3 };
  const db = { ...emptyDb, tzBoxes: [b] };
  const out = needsCare(db, TODAY, undefined, { ...base, staleBoxes: () => [b], lastCollectionIso: () => '2026-01-01' });
  ok(out.length === 1 && out[0].kind === 'stale' && out[0].id === 'b1'
    && out[0].label === 'קופה 3 לא רוקנה מזמן' && out[0].hint === 'ריקון אחרון: 2026-01-01',
    'דוגמה 1 (stale): ' + JSON.stringify(out));
}
// 2) מעולם-לא-רוקנה — עם since ובלי
{
  const b = { id: 'b2', num: 5, since: '2025-05-01' };
  const out = needsCare({ ...emptyDb, tzBoxes: [b] }, TODAY, undefined, { ...base, staleBoxes: () => [b] });
  ok(out[0].hint === 'מעולם לא רוקנה (מאז 2025-05-01)', 'דוגמה 2א: ' + out[0].hint);
  const b2 = { id: 'b3', num: 6 };
  const out2 = needsCare({ ...emptyDb, tzBoxes: [b2] }, TODAY, undefined, { ...base, staleBoxes: () => [b2] });
  ok(out2[0].hint === 'מעולם לא רוקנה (מאז —)', 'דוגמה 2ב: ' + out2[0].hint);
}
// 3) קופה אבודה
{
  const db = { ...emptyDb, tzBoxes: [{ id: 'b7', num: 7, status: 'lost' }] };
  const out = needsCare(db, TODAY, undefined, base);
  ok(out.length === 1 && out[0].kind === 'lost' && out[0].label === 'קופה 7 מסומנת כאבודה'
    && out[0].hint === 'לברר או להוציא משימוש', 'דוגמה 3 (lost): ' + JSON.stringify(out));
}
// 4) רכז לא-פעיל עם 2 קופות-בבתים; עם 0 ⇒ כלום
{
  const db = {
    ...emptyDb,
    tzBoxes: [
      { id: 'x1', num: 1, coordId: 'c1', status: 'home' },
      { id: 'x2', num: 2, coordId: 'c1', status: 'home' },
      { id: 'x3', num: 3, coordId: 'c1', status: 'office' },
    ],
    tzCoordinators: [{ id: 'c1', name: 'ראובן', active: false }],
  };
  const out = needsCare(db, TODAY, undefined, base);
  ok(out.length === 1 && out[0].kind === 'inactiveCoord' && out[0].id === 'c1'
    && out[0].label === 'ראובן אינו פעיל אך עדיין עם 2 קופות בבתים'
    && out[0].hint === 'להעביר לרכז אחר או להחזיר למשרד', 'דוגמה 4א (inactiveCoord): ' + JSON.stringify(out));
  const dbNone = { ...db, tzBoxes: [] };
  ok(needsCare(dbNone, TODAY, undefined, base).length === 0, 'דוגמה 4ב: רכז בלי קופות-בבתים פלט התרעה');
}
// 5) מבצע מסתיים בתוך 14 יום; מעבר-לחלון או לא-פעיל ⇒ כלום
{
  const mk = (end, active = true) => ({ ...emptyDb, tzCampaigns: [{ id: 'p1', name: 'אלול', active, end }] });
  const out = needsCare(mk('2026-09-01'), TODAY, undefined, base);
  ok(out.length === 1 && out[0].kind === 'campaignEnding'
    && out[0].label === 'המבצע "אלול" מסתיים ב-2026-09-01' && out[0].hint === 'לסכם ולסגור',
    'דוגמה 5א (campaignEnding): ' + JSON.stringify(out));
  ok(needsCare(mk('2026-09-20'), TODAY, undefined, base).length === 0, 'דוגמה 5ב: מעבר-לחלון נפלט');
  ok(needsCare(mk('2026-09-01', false), TODAY, undefined, base).length === 0, 'דוגמה 5ג: לא-פעיל נפלט');
}
// 6) המונח מוזרם דרך termOf כשיש config
{
  const b = { id: 'b1', num: 3 };
  const out = needsCare({ ...emptyDb, tzBoxes: [b] }, TODAY, { terms: {} },
    { ...base, staleBoxes: () => [b], termOf: () => 'קופסה' });
  ok(out[0].label === 'קופסה 3 לא רוקנה מזמן', 'דוגמה 6 (termOf): ' + out[0].label);
}
if (f) process.exit(1);
console.log('✓ needs-care-tzedaka: 6 דוגמאות-חוזה — ירוק');
