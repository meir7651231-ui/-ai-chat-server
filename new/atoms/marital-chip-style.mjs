/** חוט · marital-chip-style — צבע-שבב למצב-משפחתי. חוזה: marital-chip-style.contract.md · שקע: chipStyle */
export function maritalChipStyle(status, chipStyle, MARITAL_CHIP, T) {
  const [bg, c] = MARITAL_CHIP[status] ?? [T.k1, '#4a5568'];
  return chipStyle(bg, c);
}
