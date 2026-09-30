// @anchor: signed
// signed-commands: a command from the channel runs only with a valid signature; a signed pikuach nefesh passes Shabbat
/* Step signed-commands. A cmd document (another session asking the phone to do something) is obeyed only when it carries
   {nonce, exp, sig} signed with the key in tools/cmd.mjs: verified here with WebCrypto, and again on the phone
   (Signed.kt) - a page that was broken into still cannot make the phone act. A refused one is marked refused and never
   posted. A pikuach nefesh message (tools/cmd.mjs --pikuach) is the one thing that passes the Shabbat gate - on a page
   that is open; the phone itself turns its page off on Shabbat, and whether it should listen for one on its own is
   Meir's decision. */
const CMD_PUB='MCowBQYDK2VwAyEAMG4YGL185eVi8Z7kvOjIqysywHVj3VmLH/5mmld3Wp0=';let cmdKey=null;
const b64bytes=s=>Uint8Array.from(atob(String(s||'')),c=>c.charCodeAt(0));
async function cmdKeyGet(){if(cmdKey)return cmdKey;if(!(window.crypto&&crypto.subtle))return null;
  try{cmdKey=await crypto.subtle.importKey('spki',b64bytes(window.__testCmdPub||CMD_PUB),{name:'Ed25519'},false,['verify']);}catch(e){fail('P_SIG',e,'import');return null;}return cmdKey;}
const nonceSeen=new Set();try{JSON.parse(localStorage.getItem(LSK('nonces'))||'[]').forEach(n=>nonceSeen.add(n));}catch(e){}
function nonceMark(n){nonceSeen.add(n);try{localStorage.setItem(LSK('nonces'),JSON.stringify([...nonceSeen].slice(-200)));}catch(e){}}
/* the exact bytes tools/cmd.mjs signed; false on anything missing, expired, replayed or wrong */
async function sigOk(kind,d){if(!d||!d.sig||!d.nonce||!(+d.exp>Date.now()))return false;if(kind==='cmd'&&nonceSeen.has(String(d.nonce)))return false;
  const k=await cmdKeyGet();if(!k)return false;const msg=(kind==='cmd'?'cmd|':'pikuach|')+d.nonce+'|'+d.exp+'|'+(kind==='cmd'?d.cmd:d.text);
  try{const ok=await crypto.subtle.verify({name:'Ed25519'},k,b64bytes(d.sig),new TextEncoder().encode(String(msg)));if(ok&&kind==='cmd')nonceMark(String(d.nonce));return ok;}catch(e){fail('P_SIG',e,'verify');return false;}}
/* pikuach documents are checked as they arrive; the gate (sync) reads the answer */
function pikuachCheck(list){list.forEach(d=>{if(d.pikuach&&d.pikuachOk===undefined){d.pikuachOk=false;sigOk('pikuach',d).then(v=>{d.pikuachOk=v;if(v)setTimeout(pump,50);});}});}
window.__signed={ok:sigOk,pub:CMD_PUB};
