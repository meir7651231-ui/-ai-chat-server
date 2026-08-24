/** חוט · marital-chip-style — צבע-שבב למצב-משפחתי. חוזה: marital-chip-style.contract.md · שקע: chipStyle */
const MARITAL_CHIP = {
  נשואים: ['#e6f4ea', '#1e7a3a'],
  'אלמן/ה': ['#eef1f5', '#4a5568'],
  גרושים: ['#fdecec', '#b4433a'],
  פרודים: ['#fff4e5', '#a15c00'],
};
export function maritalChipStyle(status, chipStyle) {
  const [bg, c] = MARITAL_CHIP[status] ?? ['#eef1f5', '#4a5568'];
  return chipStyle(bg, c);
}
