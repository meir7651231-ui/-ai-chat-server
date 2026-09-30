// step shabbat-engine: the page's zmanim and holy windows (liba/src/26-shabbat.js, the pure part) against a year of
// published times (tests/zman.fixture.json, hebcal 2027, Jerusalem 40 minutes and Tel Aviv 20): every candle lighting
// before sunset and every havdalah within 60 seconds, and every window opens at a published candle lighting and closes
// at a published havdalah. Run: node tests/zman.test.js
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'liba/src/26-shabbat.js'), 'utf8');
const pure = src.slice(src.indexOf('/*<pure>*/'), src.indexOf('/*</pure>*/'));
const { ZMAN, holyWindows } = new Function(pure + '\nreturn {ZMAN, holyWindows};')();
const MOADIM = new Function(fs.readFileSync(path.join(__dirname, '..', 'liba/src/00-moadim.js'), 'utf8') + '\nreturn MOADIM;')();
const fx = JSON.parse(fs.readFileSync(path.join(__dirname, 'zman.fixture.json'), 'utf8'));
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
for (const [name, c] of Object.entries(fx.cities)) {
  const p = { lat: c.lat, lon: c.lon, b: c.b }; const d3 = s => s.slice(0, 10).split('-').map(Number);
  // a candle lighting that is not before sunset (the second night of a two-day yom tov, lit after nightfall) is not ours to compute
  const cand = c.candles.map(s => ({ s, t: Date.parse(s), mine: ZMAN.sunset(...d3(s), p) - c.b * 60000 })).filter(x => x.t < x.mine + c.b * 60000);
  const hav = c.havdalah.map(s => ({ s, t: Date.parse(s), mine: ZMAN.tzeit(...d3(s), p) }));
  const off = [...cand, ...hav].filter(x => Math.abs(x.mine - x.t) > 60000);
  ok(off.length === 0 && cand.length + hav.length >= 110, `${name}: ${cand.length + hav.length - off.length}/${cand.length + hav.length} candle lightings and havdalot within 60 seconds` + (off.length ? ' - ' + off.slice(0, 3).map(x => x.s).join(', ') : ''));
  const w = holyWindows(Date.UTC(2027, 0, 2), Date.UTC(2027, 11, 30), p, MOADIM);
  const near = (t, arr) => Math.min(...arr.map(a => Math.abs(a - t)));
  const bad = w.filter(x => near(x.from, c.candles.map(Date.parse)) > 60000 || near(x.until, c.havdalah.map(Date.parse)) > 60000);
  ok(w.length >= 55 && bad.length === 0, `${name}: ${w.length} windows in 2027 (Shabbatot and yom tov, merged when adjacent), each opens and closes at a published time`);
  const yt = w.filter(x => x.what !== 'שבת');
  ok(yt.some(x => /ראש השנה/.test(x.what) && x.until - x.from > 40 * 3600e3) && yt.some(x => /שבועות ושבת/.test(x.what)), `${name}: two-day Rosh Hashana is one window; Shavuot running into Shabbat is one window`);
}
const n = Object.keys(MOADIM).length; ok(n === 168 && MOADIM['2027-10-11'] === 'יום כיפור' && MOADIM['2027-04-22'] === 'פסח', 'moadim: 168 yom tov days 2026-2046, Yom Kippur 5788 and Pesach 5787 where they belong');
console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
