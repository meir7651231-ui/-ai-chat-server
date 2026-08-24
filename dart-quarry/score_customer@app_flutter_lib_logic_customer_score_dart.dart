// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · scoreCustomer — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/customer_score.dart:65-110 (46 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
CustomerScore scoreCustomer(RfmInput input) {
  final f = _band(input.orderCount, kRfmFreqHigh, kRfmFreqMid);
  final m = _band(input.totalSpend, kRfmMoneyHigh, kRfmMoneyMid);
  final rd = input.recencyDays;
  // recency: טרי=2, מתיישן=1, קר/לא-ידוע→ר=-1 (מושמט מ-max) או 0.
  final int r;
  if (rd == null) {
    r = -1; // לא-ידוע — FM בלבד
  } else if (rd <= kRfmRecentDays) {
    r = 2;
  } else if (rd <= kRfmStaleDays) {
    r = 1;
  } else {
    r = 0; // קר
  }

  final hasR = r >= 0;
  final points = f + m + (hasR ? r : 0);
  final maxPoints = hasR ? 6 : 4;
  final ratio = maxPoints == 0 ? 0.0 : points / maxPoints;

  final String tier;
  if (ratio >= 0.75) {
    tier = 'champion';
  } else if (ratio >= 0.5) {
    tier = 'loyal';
  } else if (ratio >= 0.25) {
    tier = 'occasional';
  } else {
    tier = 'dormant';
  }

  // בסיכון: היה בעל-ערך (F+M≥3 מתוך 4) אך התקרר (recency ידוע וקר).
  final atRisk = hasR && r == 0 && (f + m) >= 3;

  return CustomerScore(
    r: r,
    f: f,
    m: m,
    points: points,
    maxPoints: maxPoints,
    tier: tier,
    atRisk: atRisk,
  );
}

