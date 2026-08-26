import { attachChargeTo as f } from './nedarim-attach-charge-to.mjs';
// עצמאי (חוק-1: אפס import-אח; שקעים/אחים inline כ-doubles נאמנים). Golden נלכד מריצת-חיווט-אמיתי.
function normId(s){const d=(s||'').replace(/\D/g,'');if(!d||/^0+$/.test(d))return '';if(d.replace(/^0+/,'').length<4)return '';return d.length>=5?d:'';}
function normPhone(s){let d=(s||'').replace(/\D/g,'');if(/^(\d)\1+$/.test(d))return '';d=d.replace(/^00/,'');if(d.startsWith('972'))d='0'+d.slice(3);return d.replace(/^0{2,}/,'0');}
function normSearch(t){return String(t||'').toLowerCase().replace(/[֑-ׇ]/g,'').replace(/[ךםןףץ]/g,(ch)=>({'ך':'כ','ם':'מ','ן':'נ','ף':'פ','ץ':'צ'})[ch]).replace(/['"׳״\-–._]/g,'').trim();}
const nsk=(t)=>normSearch(t).split(/\s+/).filter((w)=>w).sort().join(' ');
const curOf=(c)=>{const raw=String(c.currency||'').trim();return raw==='$'||raw==='2'||/usd|\$|דולר/i.test(raw)?'$':'₪';};
const hokDayFromDate=(iso)=>{const d=Number((iso||'').slice(8,10));return isFinite(d)&&d>=1?Math.min(28,Math.floor(d)):1;};
function chargeToHistD(charge){const h={d:(charge.d||(charge.at||'').slice(0,10)||'').trim(),a:charge.amount,c:curOf(charge),clearer:'נדרים'};const ref=(charge.reference||'').trim();const txn=(charge.txnId||'').trim();const rec=(charge.receipt||'').trim();const l4=(charge.last4||'').trim();const keva=(charge.kevaId||'').trim();if(ref)h.ref=ref;if(txn)h.txn=txn;if(rec)h.receipt=rec;if(l4)h.last4=l4;if(keva)h.kevaId=keva;return h;}
function chargeDedupKeyD(charge){const txn=(charge.txnId||'').trim();if(txn)return 'txn:'+txn;const ref=(charge.reference||'').trim();return ref?'ref:'+ref:'';}
function withNedarimHokD(sp,charge){if(!(charge.amount>0))return sp;const keva=(charge.kevaId||'').trim();if(!keva)return sp;if(sp.hok&&!sp.hok.kevaId)return sp;const cd=(charge.d||charge.at||'').slice(0,10);const prevStart=sp.hok?.startedAt||'';return {...sp,hok:{amount:charge.amount,cur:curOf(charge),day:hokDayFromDate(cd),method:'card',note:'הו״ק נדרים · '+keva,active:true,startedAt:prevStart&&prevStart<cd?prevStart:cd||prevStart||'',kevaId:keva}};}
const Dm={normId,normPhone,normSearch,nameSortKey:nsk};
const Ds={normId,normPhone,normSearch};
const Da={chargeDedupKey:chargeDedupKeyD,chargeToHist:chargeToHistD,withNedarimHok:withNedarimHokD};
const S=[
 {id:'a',name:'אבי כהן',extId:'T100',idNum:'',phone:'0501234567',email:'avi@x.com',city:'ירושלים',hist:[]},
 {id:'b',name:'דנה לוי',extId:'',idNum:'123456782',phone:'0529876543',email:'',city:'',hist:[]},
 {id:'c',name:'משה',extId:'',idNum:'',phone:'',email:'',city:'',hist:[]},
];
const ch1={toremId:'T100',amount:100,txnId:'TX1',d:'2026-08-10',currency:'₪'};
const ch2={phone:'0529876543',amount:200,txnId:'TX2',d:'2026-08-11'};
const ch3={name:'לא ידוע פלוני',amount:50,txnId:'TX3'};
const chName={name:'דנה לוי',amount:70,txnId:'TX4'};
const WANT="{\"added\":true,\"histLen\":1}";
const got=JSON.stringify((()=>{const r=f(S,'a',ch1,Da);return {added:r.added,histLen:r.supporters[0].hist.length};})());
if(got!==WANT){console.error('✗ nedarim-attach-charge-to\n'+got+'\n≠\n'+WANT);process.exit(1);}
console.log('✓ nedarim-attach-charge-to: Golden — ירוק');
