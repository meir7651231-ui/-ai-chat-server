/** חוט · caller-kind-label — תווית-סוג-המתקשר דרך מילון-המונחים. חוזה: caller-kind-label.contract.md
 *  חולץ כלשונו מ-maor/src/lib/callerId.ts:24-56; השכן termOf הוזרק כשקע (חוק-1). */
export function callerKindLabel(cfg, kind, termOf, T) {
  switch (kind) {
    case T.k1:
      return termOf(cfg, T.k2, T.k3);
    case T.k4:
      return termOf(cfg, T.k5, T.k6);
    case T.k7:
      return termOf(cfg, T.k8, T.k9);
    case T.k10:
      return termOf(cfg, T.k11, T.k12);
    case T.k13:
      return termOf(cfg, T.k14, T.k15);
  }
}
