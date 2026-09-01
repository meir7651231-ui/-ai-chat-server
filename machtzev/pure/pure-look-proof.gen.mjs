import { PURE_LOOK } from '../../new/atoms/pure-look.mjs';
const N=PURE_LOOK.neutral, S=PURE_LOOK.semantic;
const nvars=Object.entries(N).map(([k,v])=>`${k}:${v}`).join(';');
const svars=Object.entries(S).map(([k,v])=>`${k}:${v}`).join(';');
function themeCSS(id){const t=PURE_LOOK.themes[id];return `.${id}{`+Object.entries(t).map(([k,v])=>`${k}:${v}`).join(';')+'}';}
const themes=Object.keys(PURE_LOOK.themes);
const panels=themes.map(id=>`
  <div class="panel ${id}">
    <div class="th">${id}</div>
    <button class="btn">Action</button>
    <div class="fld"><span class="lbl">Label</span><input class="inp" value="Value"></div>
    <div class="fld"><span class="lbl">Label</span><input class="inp err" value="Value"><span class="eh">error</span></div>
  </div>`).join('');
const html=`<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>pure-look · atom proof</title>
<style>
:root{${svars}}
body{margin:0;background:#050506;font-family:"Space Grotesk",system-ui,sans-serif;direction:rtl;padding:26px;color:#ECE9E2}
h1{font-size:15px;font-weight:600;letter-spacing:.06em;color:#9B968C;margin:0 0 4px;direction:ltr}
.sub{font-size:11px;color:#6E6A62;margin:0 0 20px;direction:ltr}
.row{display:flex;gap:16px;flex-wrap:wrap}
.panel{${nvars};flex:1;min-width:230px;background:var(--surface);border:1px solid var(--hair);border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:14px;color:var(--ink)}
${themes.map(themeCSS).join('\n')}
.th{font-family:ui-monospace,monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);direction:ltr}
.btn{height:44px;border:0;border-radius:11px;font-weight:700;font-size:13px;color:#0B0B0D;cursor:pointer;
  background:linear-gradient(180deg,var(--a-hi),var(--a) 55%,var(--a-800));
  box-shadow:0 1px 2px rgba(0,0,0,.4),0 7px 18px var(--gl),inset 0 1px 0 rgba(255,255,255,.4)}
.fld{display:flex;flex-direction:column;gap:6px}
.lbl{font-size:11px;font-weight:600;color:var(--mut)}
.inp{height:44px;border-radius:11px;background:var(--sunken);border:1px solid var(--hair);color:var(--ink);
  padding:0 13px;text-align:right;box-shadow:0 0 0 3px var(--gl);border-color:var(--a)}
.inp.err{box-shadow:0 0 0 3px rgba(224,87,78,.26);border-color:var(--err)}
.eh{font-size:9.5px;color:var(--err);direction:ltr}
</style>
<h1>pure-look — single atom proof</h1>
<p class="sub">every color below is read from new/atoms/pure-look.mjs · theme switch morphs accent · error stays red (semantic-fixed)</p>
<div class="row">${panels}</div>`;
process.stdout.write(html);
