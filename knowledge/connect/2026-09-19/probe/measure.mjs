process.env.YESHIVA_LEDGER='/dev/null'; process.env.YESHIVA_LEDGER_CAP='500000';
const { scanUnits, scanOne } = await import('../../../../machtzev/generator/behavior-plan.mjs');
const out=[]; for (const u of scanUnits()) out.push(await scanOne(u));
const s1=out.filter(r=>!r.noBehavior&&!r.error).length, s2=out.filter(r=>r.needs>0).length;
const k={}; for(const r of out) for(const x of (r.ownerKinds||[])) k[x]=(k[x]||0)+1;
console.log(JSON.stringify({units:out.length,s1,s2,kinds:k}));
