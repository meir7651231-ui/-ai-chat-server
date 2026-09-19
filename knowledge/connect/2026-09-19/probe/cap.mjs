process.env.YESHIVA_LEDGER='/dev/null'; process.env.YESHIVA_LEDGER_CAP='500000';
const C = await import('../../../../machtzev/generator/capability.mjs');
for (const t of process.argv.slice(2)) {
  const r = C.detectAlertClause(t);
  console.log(`«${t}»  ⇒ capability: ${r ? JSON.stringify({op:r.op,left:r.left,right:r.right}) : 'null'}`);
}
