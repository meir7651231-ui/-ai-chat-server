/* extract.mjs — מכשיר-המדידה. אותו קוד בדיוק רץ על חמשת האתרים החיים (probe.mjs)
   ועל חמשת המסכים שלנו (match.mjs). שני הצדדים נמדדים באותה סרגל — זו כל הנקודה. */
export const EXTRACT = () => {
  const px = (v) => Math.round(parseFloat(v) || 0);
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05;
  };
  const hex = (c) => {
    const m = c.match(/[\d.]+/g); if (!m) return null;
    const a = m[3] === undefined ? 1 : +m[3];
    if (a < 0.5) return null;
    return '#' + m.slice(0, 3).map(n => (+n).toString(16).padStart(2, '0')).join('');
  };
  const bump = (map, k, w = 1) => { if (!k) return; map[k] = (map[k] || 0) + w; };
  const top = (map, n = 8) => Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, n)
    .map(([k, v]) => ({ v: k, w: Math.round(v) }));

  /* אמנות אינה טוקן: באתרים האמיתיים העטיפות, האיורים והצילומים הם תמונות,
     ולכן ממילא אינם נספרים בסריקת-הצבעים. אצלנו הם מצוירים ב-CSS/SVG ומסומנים
     data-art — הסריקה מדלגת עליהם, כדי ששני הצדדים יימדדו באותה מידה. */
  const isArt = (el) => !!el.closest('[data-art]');
  const all = [...document.querySelectorAll('body *')].filter(vis);
  const bgArea = {}, inkArea = {}, radii = {}, shadows = {}, fams = {}, gaps = {}, pads = {};

  all.forEach(el => {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    const area = Math.min(r.width * r.height, 1.2e6) / 1000;
    const art = isArt(el);
    const bg = hex(cs.backgroundColor); if (bg && !art) bump(bgArea, bg, area);
    const txt = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (txt && !art) { const c = hex(cs.color); if (c) bump(inkArea, c, Math.max(1, area / 20)); }
    const rad = px(cs.borderTopLeftRadius); if (rad) bump(radii, rad + 'px', 1);
    if (cs.boxShadow && cs.boxShadow !== 'none') bump(shadows, cs.boxShadow.slice(0, 80), 1);
    const f = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(); if (f) bump(fams, f, Math.max(1, area / 50));
    if (cs.display.includes('flex') || cs.display.includes('grid')) { const g = px(cs.gap); if (g) bump(gaps, g + 'px', 1); }
    const p = px(cs.paddingTop); if (p) bump(pads, p + 'px', 1);
  });

  /* טיפוגרפיה לפי תפקיד — נלקח האלמנט הגדול/הנפוץ מכל סוג */
  const typ = {};
  const role = (sel, key) => {
    const els = [...document.querySelectorAll(sel)].filter(vis)
      .sort((a, b) => parseFloat(getComputedStyle(b).fontSize) - parseFloat(getComputedStyle(a).fontSize));
    if (!els.length) return;
    const cs = getComputedStyle(els[0]);
    typ[key] = { size: px(cs.fontSize), weight: cs.fontWeight, lh: cs.lineHeight, ls: cs.letterSpacing,
      family: cs.fontFamily.split(',')[0].replace(/["']/g, ''), color: hex(cs.color), text: (els[0].textContent || '').trim().slice(0, 32) };
  };
  role('h1', 'h1'); role('h2', 'h2'); role('h3', 'h3'); role('p', 'body'); role('small,figcaption', 'small');

  /* כפתורים — כל מה שנראה כפתור, מקובץ לפי החתימה החזותית */
  const btnSig = {};
  [...document.querySelectorAll('button,a[class*=btn],a[class*=Button],[role=button],a[class*=cta]')].filter(vis)
    .forEach(el => {
      const cs = getComputedStyle(el), r = el.getBoundingClientRect();
      if (r.height < 22 || r.width < 40) return;
      const sig = JSON.stringify({ bg: hex(cs.backgroundColor), color: hex(cs.color),
        radius: px(cs.borderTopLeftRadius), padX: px(cs.paddingLeft), padY: px(cs.paddingTop),
        h: Math.round(r.height), size: px(cs.fontSize), weight: cs.fontWeight,
        border: cs.borderTopWidth === '0px' ? null : cs.borderTopWidth + ' ' + hex(cs.borderTopColor),
        shadow: cs.boxShadow === 'none' ? null : cs.boxShadow.slice(0, 60),
        transform: cs.textTransform === 'none' ? null : cs.textTransform });
      bump(btnSig, sig, 1);
    });

  /* כרטיסים — רקע שונה מההורה, פינה מעוגלת, שטח משמעותי */
  const cardSig = {};
  all.forEach(el => {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    if (r.width < 120 || r.height < 60) return;
    const rad = px(cs.borderTopLeftRadius); if (rad < 6) return;
    const bg = hex(cs.backgroundColor); if (!bg) return;
    const pbg = el.parentElement ? hex(getComputedStyle(el.parentElement).backgroundColor) : null;
    if (bg === pbg) return;
    bump(cardSig, JSON.stringify({ bg, radius: rad, padding: px(cs.paddingTop) + '/' + px(cs.paddingLeft),
      border: cs.borderTopWidth === '0px' ? null : cs.borderTopWidth + ' ' + hex(cs.borderTopColor),
      shadow: cs.boxShadow === 'none' ? null : cs.boxShadow.slice(0, 60) }), 1);
  });

  const bodyCs = getComputedStyle(document.body);
  const main = document.querySelector('main,[role=main]') || document.body;
  return {
    title: document.title.slice(0, 70),
    body: { bg: hex(bodyCs.backgroundColor) || '#ffffff', color: hex(bodyCs.color),
      family: bodyCs.fontFamily.split(',')[0].replace(/["']/g, ''), size: px(bodyCs.fontSize), lh: bodyCs.lineHeight },
    mainWidth: Math.round(main.getBoundingClientRect().width),
    palette: { bg: top(bgArea, 10), ink: top(inkArea, 8) },
    fonts: top(fams, 5), radii: top(radii, 7), gaps: top(gaps, 6), pads: top(pads, 6),
    shadows: top(shadows, 4),
    type: typ,
    buttons: top(btnSig, 6).map(x => ({ ...JSON.parse(x.v), count: x.w })),
    cards: top(cardSig, 6).map(x => ({ ...JSON.parse(x.v), count: x.w })),
    elements: all.length,
  };
};
