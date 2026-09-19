// probe: משפט יחיד ⇒ שלב 1 (תביעות) + שלב 2 (צרכים) + סיבת-הנפילה במילות-המנוע
process.env.YESHIVA_LEDGER = process.env.YESHIVA_LEDGER || '/dev/null';
process.env.YESHIVA_LEDGER_CAP = '500000';
const { scanOne } = await import('../../../../machtzev/generator/behavior-plan.mjs');
const Y = await import('../../../../yeshiva/purpose.mjs');
for (const t of process.argv.slice(2)) {
  const r = await scanOne({ src: 'probe', id: 'p', at: 'probe', text: t });
  const d = Y.demandsOf(t);
  console.log(`«${t}»`);
  console.log(`   שלב1 תביעות=${r.claims} [${d.map(x=>x.verb).join(',')||'—'}]  שלב2 צרכים=${r.needs} [${(r.needIds||[]).join(',')}]  מתגים=${r.owner} [${(r.ownerKinds||[]).join('/')||'—'}]`);
}
