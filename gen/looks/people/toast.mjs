/* toast.mjs — איך זה **נראה**: מדידת רכיב הטוסט/סנאקבר במערכות-העיצוב
   הציבוריות של המוצרים עצמם. לא זיכרון — ערכים מחושבים מהדוגמה החיה.
   הרצה: node gen/looks/people/toast.mjs */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, 'toast'), { recursive: true });

const SYS = [
  { id: 'material', name: 'Material 3 (Google · Gmail)', url: 'https://m3.material.io/components/snackbar/specs', sel: '[class*=snackbar],[class*=Snackbar]' },
  { id: 'primer', name: 'Primer (GitHub)', url: 'https://primer.style/components/toast', sel: '[class*=Toast],[class*=toast]' },
  { id: 'polaris', name: 'Polaris (Shopify)', url: 'https://polaris-react.shopify.com/components/feedback-indicators/toast', sel: '[class*=Toast],[class*=toast]' },
  { id: 'carbon', name: 'Carbon (IBM)', url: 'https://carbondesignsystem.com/components/notification/usage/', sel: '[class*=toast],[class*=notification]' },
  { id: 'atlassian', name: 'Atlassian', url: 'https://atlassian.design/components/flag/examples', sel: '[class*=flag],[class*=Flag]' },
  { id: 'baseweb', name: 'Base Web (Uber)', url: 'https://baseweb.design/components/snackbar/', sel: '[class*=snackbar],[class*=Snackbar]' },
  { id: 'spectrum', name: 'Spectrum (Adobe)', url: 'https://spectrum.adobe.com/page/toast/', sel: '[class*=Toast],[class*=toast]' },
];

/* זיהוי **לפי צורה** ולא לפי שם-מחלקה: רצועה נמוכה, רקע משלה, טקסט קצר,
   יושבת נמוך במסך. כך נתפס הרכיב גם כשהמחלקות מגובבות וגם כשהוא איור סטטי. */
const MEASURE = () => {
  const px = v => Math.round(parseFloat(v) || 0);
  const hex = c => { const m = c.match(/[\d.]+/g); if (!m) return null; const a = m[3] === undefined ? 1 : +m[3];
    if (a < .5) return null; return '#' + m.slice(0, 3).map(n => (+n).toString(16).padStart(2, '0')).join(''); };
  const lum = h => { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
    .map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
  const out = [];
  document.querySelectorAll('body *').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width < 200 || r.width > 760 || r.height < 34 || r.height > 96) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity < .5) return;
    const bg = hex(cs.backgroundColor); if (!bg) return;
    const par = el.parentElement ? hex(getComputedStyle(el.parentElement).backgroundColor) : null;
    if (bg === par) return;                       /* חייב רקע משלו */
    const txt = (el.innerText || '').replace(/\s+/g, ' ').trim();
    if (txt.length < 4 || txt.length > 70) return; /* טקסט קצר, לא פסקה */
    if (el.querySelectorAll('*').length > 12) return;
    const rad = px(cs.borderTopLeftRadius);
    const btn = el.querySelector('button,a');
    out.push({ w: Math.round(r.width), h: Math.round(r.height), bg, color: hex(cs.color),
      dark: lum(bg) < .3, radius: rad, padY: px(cs.paddingTop), padX: px(cs.paddingLeft),
      size: px(cs.fontSize), weight: cs.fontWeight, gap: px(cs.gap),
      shadow: cs.boxShadow === 'none' ? null : cs.boxShadow.slice(0, 60),
      action: btn ? (btn.innerText || '').trim().slice(0, 20) : null,
      actionColor: btn ? hex(getComputedStyle(btn).color) : null,
      text: txt.slice(0, 56) });
  });
  const t = document.body.innerText;
  const secs = [...new Set((t.match(/\b\d+(\.\d+)?\s*(seconds?|sec|ms|milliseconds?)\b/gi) || []).map(x => x.trim()))].slice(0, 6);
  const pos = ['bottom left', 'bottom center', 'bottom-left', 'bottom of the screen', 'top right', 'bottom right', 'centered', 'bottom start']
    .filter(w => t.toLowerCase().includes(w));
  return { found: out.slice(0, 6), secs, pos };
};

const b = await chromium.launch();
const all = [];
for (const s of SYS) {
  const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
  try {
    await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(3400);
    for (const t of ['Accept', 'Accept all', 'Got it', 'Allow all', 'I agree']) {
      const x = p.locator(`button:has-text("${t}")`).first();
      if (await x.count() && await x.isVisible().catch(() => false)) { await x.click().catch(() => { }); await p.waitForTimeout(600); break; }
    }
    /* בהרבה מערכות הטוסט מופיע רק אחרי לחיצה על «הצג» */
    for (const t of ['Show toast', 'Show snackbar', 'Show flag', 'Open', 'Trigger', 'Show']) {
      const x = p.locator(`button:has-text("${t}")`).first();
      if (await x.count() && await x.isVisible().catch(() => false)) { await x.click().catch(() => { }); await p.waitForTimeout(1100); break; }
    }
    const m = await p.evaluate(MEASURE);
    await p.screenshot({ path: join(here, 'toast', s.id + '.png') });
    all.push({ ...s, ...m });
    const f = m.found[0];
    console.log(`✓ ${s.name.padEnd(28)} ${f ? `${f.w}×${f.h} · ${f.bg}/${f.color} · r${f.radius} · ${f.size}px · פעולה «${f.action || '—'}»` : 'לא נתפס רכיב'}`);
    if (m.secs.length) console.log(`   זמנים בעמוד: ${m.secs.join(' · ')}`);
    if (m.pos.length) console.log(`   מיקום: ${m.pos.join(' · ')}`);
  } catch (e) { console.log(`✗ ${s.name} — ${String(e.message).slice(0, 45)}`); all.push({ ...s, err: String(e.message).slice(0, 45) }); }
  await p.close();
}
await b.close();
writeFileSync(join(here, 'toast.json'), JSON.stringify(all, null, 1));
