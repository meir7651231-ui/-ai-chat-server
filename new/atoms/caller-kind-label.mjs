/** חוט · caller-kind-label — תווית-סוג-המתקשר דרך מילון-המונחים. חוזה: caller-kind-label.contract.md
 *  חולץ כלשונו מ-maor/src/lib/callerId.ts:24-56; השכן termOf הוזרק כשקע (חוק-1). */
export function callerKindLabel(cfg, kind, termOf) {
  switch (kind) {
    case 'family':
      return termOf(cfg, 'entity.family', 'משפחה');
    case 'member':
      return termOf(cfg, 'entity.member', 'בן/בת משפחה');
    case 'supporter':
      return termOf(cfg, 'entity.supporter', 'תורם/ת');
    case 'volunteer':
      return termOf(cfg, 'entity.volunteer', 'מתנדב/ת');
    case 'coordinator':
      return termOf(cfg, 'entity.tzCoordinator', 'רכז/ת');
  }
}
