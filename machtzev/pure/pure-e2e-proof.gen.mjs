/** קופסת-הדגמה (חיווט, לא-אטום): אותו כפתור, שתי בחירות מאותו מקור — דרך resolvePigment. */
import { PURE_LOOK } from '../../new/atoms/pure-look.mjs';
import { resolvePigment } from '../../new/atoms/pure-resolve.mjs';

// הקופסה מרכיבה base פר-ערכה מהקטלוג (spread = חיווט, מותר בקופסה)
const baseOf = t => ({ ...PURE_LOOK.neutral, ...PURE_LOOK.semantic, ...PURE_LOOK.themes[t] });

// בונה-כפתור אחד — מקבל layers (הבחירה) ומושך כל פיגמנט דרך ה-resolver
function button(title, layers) {
  const g = (role, fb) => resolvePigment(role, layers) ?? fb;
  const fill = g('--a'), hi = g('--a-hi'), deep = g('--a-800'), glow = g('--gl');
  const ink = g('--ink-on', '#0B0B0D'), radius = g('--radius', '11px');
  return `<div class="cell"><div class="th">${title}</div>
    <button style="color:${ink};border-radius:${radius};
      background:linear-gradient(180deg,${hi},${fill} 55%,${deep});
      box-shadow:0 1px 2px rgba(0,0,0,.4),0 7px 18px ${glow},inset 0 1px 0 rgba(255,255,255,.4)">Action</button>
    <div class="cap">${layers._cap}</div></div>`;
}

const base = baseOf('t-indigo');

// בחירה A: ברירת-מחדל — אפס override. accent מהערכה.
const choiceA = [null, null, null, base]; choiceA._cap = 'theme=t-indigo · אפס override';

// בחירה B: אותו אטום — override פר-מופע: מראה-זהב (חוצה-משפחה) + רדיוס פר-property + דיו כהה
const goldInstance = {
  '--a-hi': '#FBEFC0', '--a': '#E6C766', '--a-800': '#B98F2E',
  '--gl': 'rgba(200,150,40,0.45)', '--ink-on': '#3A2C05', '--radius': '22px'
};
const choiceB = [null, goldInstance, null, base]; choiceB._cap = 'theme=t-indigo · instance override: מראה-זהב + radius 22';

const N = PURE_LOOK.neutral;
const html = `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>pure e2e</title><style>
body{margin:0;background:${N['--canvas']};color:${N['--ink']};direction:rtl;
  font-family:"Space Grotesk",system-ui,sans-serif;padding:30px}
h1{font-size:16px;margin:0 0 4px}.s{font-size:11px;color:${N['--faint']};margin:0 0 24px;direction:ltr}
.row{display:flex;gap:20px;flex-wrap:wrap}
.cell{background:${N['--surface']};border:1px solid ${N['--hair']};border-radius:16px;padding:22px;min-width:240px;display:flex;flex-direction:column;gap:14px}
.th{font-family:ui-monospace,monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:${N['--faint']};direction:ltr}
button{height:46px;border:0;font-weight:700;font-size:13px;cursor:pointer}
.cap{font-family:ui-monospace,monospace;font-size:10px;color:${N['--mut']};direction:ltr;line-height:1.5}
</style>
<h1>pure — אטום אחד, קצה-לקצה</h1>
<p class="s">same button builder · same source (pure-look.mjs) · pigments resolved by pure-resolve.mjs · only the layers (the choice) differ · atom files untouched</p>
<div class="row">${button('בחירה A', choiceA)}${button('בחירה B', choiceB)}</div>`;
process.stdout.write(html);
