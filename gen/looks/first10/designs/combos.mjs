/* עשרה שילובים של חמש הערכות. כל שילוב לוקח כל שכבה מאתר אחר —
   וכל אתר מופיע בדיוק פעמיים בכל עמודה, כדי שהעשרה באמת יהיו שונים. */
import { KITS } from './kits.mjs';

/* [בית, ויג׳טים, כפתורים, כרטיסים, ממשק] */
const MIX = [
  ['monzo', 'spotify', 'raycast', 'wise', 'duolingo'],    // 1 — הבקשה המקורית של הבעלים
  ['spotify', 'wise', 'duolingo', 'monzo', 'raycast'],    // 2
  ['raycast', 'monzo', 'wise', 'duolingo', 'spotify'],    // 3
  ['duolingo', 'raycast', 'monzo', 'spotify', 'wise'],    // 4
  ['wise', 'duolingo', 'spotify', 'raycast', 'monzo'],    // 5
  ['monzo', 'wise', 'spotify', 'duolingo', 'raycast'],    // 6
  ['spotify', 'raycast', 'wise', 'monzo', 'duolingo'],    // 7
  ['wise', 'monzo', 'duolingo', 'raycast', 'spotify'],    // 8
  ['duolingo', 'spotify', 'raycast', 'wise', 'monzo'],    // 9
  ['raycast', 'duolingo', 'monzo', 'spotify', 'wise'],    // 10
];
const LAYER = ['בית', 'ויג׳טים', 'כפתורים', 'כרטיסים', 'ממשק'];

const tokens = (k) => `:root{--bg:${k.tok.bg};--card:${k.tok.card};--sunk:${k.tok.sunk};--ink:${k.tok.ink};
 --mut:${k.tok.mut};--hair:${k.tok.hair};--acc:${k.tok.acc};--accInk:${k.tok.accInk};--pos:${k.tok.pos};
 --warn:${k.tok.warn};--solid:${k.tok.solid};--onSolid:${k.tok.onSolid};--accText:${k.tok.accText};--r:${k.tok.r};--face:${k.face}}
body{background:var(--bg);color:var(--ink)}
a{color:inherit}`;

/* פס-ההרכב: מה נלקח מאיפה — נגזר מהשילוב, לא נכתב ביד */
const mixCss = `.mixbar{display:flex;flex-wrap:wrap;gap:0;border:1px solid var(--hair);border-radius:10px;
 overflow:hidden;margin-top:26px;font-size:12px}
.mixbar div{flex:1 1 130px;padding:9px 12px;border-inline-start:1px solid var(--hair)}
.mixbar div:first-child{border-inline-start:0}
.mixbar b{display:block;font-size:13px;font-weight:700}
.mixbar span{color:var(--mut)}`;

export default MIX.map((mix, i) => {
  const [home, wid, btn, card, surf] = mix.map(x => KITS[x]);
  const n = i + 1;
  const parts = mix.map((x, j) => `<div><span>${LAYER[j]}</span><b>${KITS[x].name}</b></div>`).join('');
  const fonts = [...new Set([...surf.font, ...(home === surf ? [] : home.font)])];
  return {
    id: String(n).padStart(2, '0') + '-' + mix[4] + '-' + mix[0],
    name: `${n} · ${surf.name} × ${home.name}`,
    ref: mix.map((x, j) => `${LAYER[j]}: ${KITS[x].name}`).join(' · '),
    fonts,
    css: [tokens(surf), surf.typeCss, home.homeCss, wid.widCss, card.cardCss, btn.btnCss, mixCss].join('\n'),
    body: (D) => home.home(D, {
      wid: () => wid.wid(D),
      cards: () => card.cards(D),
      btns: () => btn.btns(D),
      mixLine: `<div class="mixbar">${parts}</div>
        <p style="margin-top:10px">כל החלקים נלקחו מחמשת האתרים שנבחרו · הגופן: ${surf.faceNote} ·
        המספרים נגזרים מהמחסן · נתוני דוגמה</p>`,
    }),
  };
});
