// @anchor: shabbat
// shabbat-engine + pikuach-gate: Shabbat and yom tov - silent, from candle lighting until nightfall, computed offline
/* Step shabbat-engine. The windows are computed here and on the phone (Holy.kt, the same algorithm, checked for parity)
   from the place Meir set ("זמני שבת לפי בני ברק"; Jerusalem, 40 minutes, until he does) and twenty years of yom tov
   (00-moadim.js, generated). Inside a window nothing passes the gate - not a question, not a task, not urgent: the phone
   itself turns the page off, stops the voice and the microphone, and makes no network request at all; this page (on
   any other device) holds everything the same way. The only way through is Meir's own hand - three seconds on the
   bubble opens half an hour of emergency (pikuach nefesh). A signed pikuach message from outside waits for
   signed-commands. After the window: "שבוע טוב" and one ordered reading - how many waited, how many are questions, how
   many are very old (over 18 hours) - questions first, the rest on "הכול". */
/*<pure>*/
const ZMAN={
  rad:d=>d*Math.PI/180,deg:r=>r*180/Math.PI,
  /* minutes after UTC midnight of the given UTC date when the sun is `angle` degrees below the horizon, going down
     (rising=false) or up; one refinement at the event time */
  event(y,m,d,lat,lon,angle,rising){const R=ZMAN.rad,D=ZMAN.deg;let min=720;
    for(let k=0;k<2;k++){const jd=Date.UTC(y,m-1,d)/864e5+2440587.5+min/1440,t=(jd-2451545)/36525;
      const L0=((280.46646+t*(36000.76983+t*0.0003032))%360+360)%360,M=357.52911+t*(35999.05029-0.0001537*t),e=0.016708634-t*(0.000042037+0.0000001267*t);
      const C=Math.sin(R(M))*(1.914602-t*(0.004817+0.000014*t))+Math.sin(R(2*M))*(0.019993-0.000101*t)+Math.sin(R(3*M))*0.000289;
      const om=125.04-1934.136*t,lam=L0+C-0.00569-0.00478*Math.sin(R(om));
      const eps=23+(26+(21.448-t*(46.815+t*(0.00059-t*0.001813)))/60)/60+0.00256*Math.cos(R(om));
      const dec=Math.asin(Math.sin(R(eps))*Math.sin(R(lam))),yy=Math.pow(Math.tan(R(eps/2)),2);
      const eqt=4*D(yy*Math.sin(2*R(L0))-2*e*Math.sin(R(M))+4*e*yy*Math.sin(R(M))*Math.cos(2*R(L0))-0.5*yy*yy*Math.sin(4*R(L0))-1.25*e*e*Math.sin(2*R(M)));
      const cosH=(Math.cos(R(90+angle))/(Math.cos(R(lat))*Math.cos(dec)))-Math.tan(R(lat))*Math.tan(dec);if(cosH<-1||cosH>1)return null;
      const ha=D(Math.acos(cosH));min=720-4*lon-eqt+(rising?-4*ha:4*ha);}
    return min;},
  at(y,m,d,min){return Date.UTC(y,m-1,d)+Math.round(min*60000);},
  sunset(y,m,d,p){const x=ZMAN.event(y,m,d,p.lat,p.lon,0.833,false);return x==null?null:ZMAN.at(y,m,d,x);},
  tzeit(y,m,d,p){const x=ZMAN.event(y,m,d,p.lat,p.lon,8.5,false);return x==null?null:ZMAN.at(y,m,d,x);},
};
/* the holy windows: every run of consecutive holy days (Saturdays and the listed yom tov) from candle lighting the evening
   before (sunset minus the place's minutes - 40 in Jerusalem) until nightfall (8.5°) of the last day */
function holyWindows(fromMs,toMs,place,moadim){const out=[];const ymd=t=>new Date(t).toISOString().slice(0,10);
  const isHoly=t=>new Date(t).getUTCDay()===6||!!moadim[ymd(t)];
  let d=Date.UTC(new Date(fromMs).getUTCFullYear(),new Date(fromMs).getUTCMonth(),new Date(fromMs).getUTCDate())-864e5;
  for(;d<=toMs+864e5;d+=864e5){if(!isHoly(d)||isHoly(d-864e5))continue;let e=d;while(isHoly(e+864e5))e+=864e5;
    const pd=new Date(d-864e5),ld=new Date(e);
    const from=ZMAN.sunset(pd.getUTCFullYear(),pd.getUTCMonth()+1,pd.getUTCDate(),place)-(+place.b||40)*60000;
    const until=ZMAN.tzeit(ld.getUTCFullYear(),ld.getUTCMonth()+1,ld.getUTCDate(),place);
    const names=[];for(let x=d;x<=e;x+=864e5)names.push(moadim[ymd(x)]||'שבת');
    if(until>fromMs&&from<toMs)out.push({from,until,what:[...new Set(names)].join(' ו')});d=e;}
  return out;}
/*</pure>*/
const SHABBAT_PLACES=[['ירושלים',31.76904,35.21633,40],['בני ברק',32.08074,34.8338,20],['תל אביב',32.08088,34.78057,20],['חיפה',32.81841,34.9885,30],['פתח תקווה',32.08707,34.88747,20],
  ['בית שמש',31.73072,34.99293,20],['מודיעין עילית',31.93221,35.04416,20],['ביתר עילית',31.69903,35.12013,40],['אלעד',32.05207,34.95135,20],['אשדוד',31.79213,34.64966,20],
  ['נתניה',32.33291,34.85992,20],['רחובות',31.89421,34.81199,20],['צפת',32.96465,35.496,20],['טבריה',32.79221,35.53124,20],['באר שבע',31.25181,34.7913,20],['רמת גן',32.08227,34.81065,20],
  ['חולון',32.01034,34.77918,20],['קרית גת',31.60998,34.76422,20],['עמנואל',32.16,35.1352,20],['קרית ספר',31.93221,35.04416,20]];
const SHABBAT_DEFAULT={name:'ירושלים',lat:31.76904,lon:35.21633,b:40};
let shabbatWin=null,shabbatEmergencyUntil=0;
function shabbatPlace(){const p=memSettings.place;return p&&isFinite(+p.lat)&&isFinite(+p.lon)?{name:String(p.name||''),lat:+p.lat,lon:+p.lon,b:+p.b||20}:SHABBAT_DEFAULT;}
function shabbatAt(now){return holyWindows(now-3*864e5,now+864e5,shabbatPlace(),MOADIM).find(w=>w.from<=now&&now<w.until)||null;}
/* the gate asks this first: inside a window nothing passes but Meir's own emergency */
function shabbatOn(now){now=now||Date.now();if(shabbatEmergencyUntil>now)return false;if(window.__testShabbat!=null)return !!window.__testShabbat;return !!shabbatAt(now);}
/* entering and leaving, once a minute: channel/shabbat says where things stand; after it, one ordered reading */
async function shabbatTick(now){now=now||Date.now();const w=window.__testShabbat!=null?(window.__testShabbat?{from:now-3600e3,until:now+3600e3,what:'שבת'}:null):shabbatAt(now);
  if(w&&!shabbatWin){shabbatWin=w;if(db)P.shabbat().set({from:w.from,until:w.until,what:w.what,mode:'on',place:shabbatPlace().name,at:now}).catch(e=>fail('P_DB_WRITE',e,'channel/shabbat'));return 'in';}
  if(!w&&shabbatWin){const was=shabbatWin;shabbatWin=null;if(db)P.shabbat().set({from:was.from,until:was.until,what:was.what,mode:'off',place:shabbatPlace().name,at:now}).catch(e=>fail('P_DB_WRITE',e,'channel/shabbat'));
    await motzash(was,now);return 'out';}
  return w?'on':'off';}
async function motzash(was,now){now=now||Date.now();const waiting=inboxQ.filter(d=>!d.local&&!spokenLocal.has(d.id)&&d.kind!=='cmd'&&!d.failed);
  const asks=waiting.filter(d=>d.kind==='ask'||d.kind==='stuck').length,stale=waiting.filter(d=>(+d.ts||0)>=CLOCK_MIN&&now-(+d.ts)>18*3600e3);
  for(const d of stale){if(db)P.inboxDoc(d.id).update({stale:true}).catch(()=>{});}
  if(!waiting.length){queueLocal({id:'motzash-'+was.until,kind:'say',release:true,speaker:'ליבה',topic:'מוצאי '+was.what,text:(was.what==='שבת'?'שבוע טוב':'חג שמח')+'. לא חיכה לך כלום.'});return;}
  catchupAt=now;catchupUntil=now+CATCHUP_HOLD;setTimeout(()=>{catchupUntil=0;pump();},CATCHUP_HOLD+500);
  queueLocal({id:'motzash-'+was.until,kind:'say',release:true,speaker:'ליבה',topic:'מוצאי '+was.what,text:(was.what==='שבת'?'שבוע טוב':'חג שמח')+'. בזמן ה'+was.what+' חיכו '+waiting.length+' הודעות'+(asks?', '+asks+' מהן שאלות':'')+(stale.length?', ו-'+stale.length+' ישנות מאוד':'')+'. '+(asks?'אקריא קודם את השאלות. ':'')+'תגיד "הכול" ואקריא את השאר.'});}
/* the commands */
const shabbatFmt=t=>new Date(t).toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Jerusalem'});
const shabbatDayName=t=>new Date(t).toLocaleDateString('he-IL',{weekday:'long',timeZone:'Asia/Jerusalem'});
function shabbatWhen(){const now=Date.now(),p=shabbatPlace();const w=holyWindows(now-864e5,now+14*864e5,p,MOADIM).find(x=>x.until>now);
  if(!w){sayLocal('לא מצאתי שבת או חג בשבועיים הקרובים.');return true;}
  const sh=w.what==='שבת';const on=w.from<=now;
  sayLocal((on?(sh?'עכשיו שבת. היא יוצאת':'עכשיו '+w.what+'. החג יוצא'):(sh?'השבת הבאה נכנסת ב'+shabbatDayName(w.from)+' ב-'+shabbatFmt(w.from)+' ויוצאת':'החג הבא, '+w.what+', נכנס ב'+shabbatDayName(w.from)+' ב-'+shabbatFmt(w.from)+' ויוצא'))+' ב'+shabbatDayName(w.until)+' ב-'+shabbatFmt(w.until)+', לפי '+(p.name||'המקום ששמרתי')+'.');return true;}
function shabbatSetPlace(rest){const n=inorm(rest);const hit=SHABBAT_PLACES.find(x=>x[0]===n||'ב'+x[0]===n);
  if(!hit){sayLocal('אני לא מכירה את '+rest.trim()+'. אפשר למשל: ירושלים, בני ברק, בית שמש, מודיעין עילית, ביתר עילית, אלעד, חיפה.');return true;}
  memSettings.place={name:hit[0],lat:hit[1],lon:hit[2],b:hit[3]};P.settings().set(memSettings).catch(e=>fail('P_DB_WRITE',e,'memory/settings'));
  if(appMode)post(PROTO.toApp.place,{body:JSON.stringify(memSettings.place)});
  sayLocal('זמני השבת לפי '+hit[0]+': כניסה '+hit[3]+' דקות לפני השקיעה, יציאה בצאת הכוכבים. בשבת אני שותקת לגמרי.');return true;}
function shabbatPlaceSend(){if(appMode&&hasCap('holy'))post(PROTO.toApp.place,{body:JSON.stringify(shabbatPlace())});}
every('shabbat',60000,()=>{shabbatTick().catch(()=>{});});setTimeout(()=>{shabbatTick().catch(()=>{});},4000);
window.__shabbat={tick:shabbatTick,at:shabbatAt,windows:holyWindows,place:shabbatPlace,zman:ZMAN};
