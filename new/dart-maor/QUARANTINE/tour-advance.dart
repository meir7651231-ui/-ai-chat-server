// חוט · tour-advance — אינדקס-הצעד-הבא בסיור. חוזה: tour-advance.contract.md
// הומר מ-new/atoms/tour-advance.mjs (מוצא: maor/src/lib/tour.ts:80-85). טהור.
dynamic tourAdvance(dynamic index, dynamic delta, dynamic length) {
  final next = index + delta;
  if (next < 0) return 0;
  if (next >= length) return null;
  return next;
}
