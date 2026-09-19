process.env.YESHIVA_LEDGER='/dev/null'; process.env.YESHIVA_LEDGER_CAP='500000';
const Y = await import('../../../../yeshiva/purpose.mjs');
for (const t of process.argv.slice(2)) {
  const p = Y.goalPsak(t, 'probe');
  const k = (p.requirements||[]).filter(r=>r.kind==='קבוע');
  console.log(`«${t}»\n   קבועים: ${k.map(r=>`${r.word}${r.unit?' '+r.unit:''} cmp=${r.cmp||'∅'}`).join(' | ')||'—'}`);
}
