/** חוט · plan-ayin-advance — תכנון פעולת הכפתור-החכם של תיק-המעקב.
 *  חוזה: plan-ayin-advance.contract.md · שקעים (אובייקט sockets):
 *  ayinActionVisible · featLabel · itemLabel · unitLabel · stageLabel · eyesTotal
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts (קריאות-השכן שוקעו). */
export function planAyinAdvance(cfg, name, a, sockets, T) {
  const { ayinActionVisible, featLabel, itemLabel, unitLabel, stageLabel, eyesTotal } = sockets;
  if (!ayinActionVisible(a)) return null;
  const feat = featLabel(cfg);
  const item = itemLabel(cfg);
  const unit = unitLabel(cfg);
  const st = a.stage;
  if (st === T.k1) {
    return {
      patch: { stage: T.k2 },
      event: { title: `${feat}: ${stageLabel(cfg, 'lead')} — ${name} (${a.names.length} ${item})`, done: false },
      toast: `נרשמו ${a.names.length} — נכנס ללוח: ${stageLabel(cfg, 'lead')}`,
    };
  }
  if (st === T.k2) {
    return {
      patch: { stage: T.k3 },
      event: { title: `${feat}: ${stageLabel(cfg, 'lead')} ✓ — ${name}`, done: true },
      toast: `אושר — נרשם בלוח ובדוח. עכשיו: ${stageLabel(cfg, 'eyes')}`,
    };
  }
  if (st === T.k3) {
    const eyes = eyesTotal(a);
    return {
      patch: { stage: T.k4 },
      event: { title: `${feat}: ${stageLabel(cfg, 'answer')} — ${name} (${eyes} ${unit})`, done: false },
      toast: `נרשם — נכנס ללוח: ${stageLabel(cfg, 'answer')}`,
    };
  }
  // st === 'answer'
  if (!a.answerPushed) {
    return {
      patch: { answerPushed: true },
      event: { title: `${feat}: ${stageLabel(cfg, 'answer')} — ${name}`, done: false },
      toast: T.k5,
    };
  }
  return {
    patch: { stage: T.k6 },
    event: { title: `${feat}: ${stageLabel(cfg, 'done')} — ${name}`, done: true },
    toast: T.k7,
  };
}
