/** חוט · finder-axes — צירי-הצלילה של מאתר-המשפחות. חוזה: finder-axes.contract.md
 *  חולץ כלשונו מ-maor/src/components/families/lib.ts:87-101; השכן termOf
 *  (מילון-המונחים) הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function finderAxes(config, termOf) {
  return [
    ['city', 'עיר'],
    ['comm', 'קהילה'],
    ['marital', 'מצב משפחתי'],
    ['status', 'סטטוס'],
    ['cred', termOf(config, 'entity.cred', 'אמינות')],
    ['kids', 'ילדים'],
    ['enrolled', termOf(config, 'nav.courses', 'חוגים')],
    ['sefach', 'ספח מלא'],
    ['lang', 'שפה'],
  ];
}
