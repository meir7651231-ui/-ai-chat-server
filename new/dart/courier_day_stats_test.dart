// בדיקת-חוזה · courierDayStats — מייבאת רק את האטום-שלה (חוק-4).
// היום מוזרק כפרמטר קבוע (שקע-שעון · חוק-6) — אין DateTime.now.
// אימות: dart run --enable-asserts new/dart/courier_day_stats_test.dart ⇒ exit 0.
import 'courier_day_stats.dart';

final DateTime _today = DateTime(2026, 8, 26);

void _eq(int got, int want, String msg) {
  if (got != want) {
    throw StateError('FAIL $msg\n  got : $got\n  want: $want');
  }
}

void _check(CourierDayStats s, String tag,
    {required int dt, required int mine, required int active, required int pod, required int sum}) {
  _eq(s.deliveredToday, dt, '$tag.deliveredToday');
  _eq(s.mineCount, mine, '$tag.mineCount');
  _eq(s.active, active, '$tag.active');
  _eq(s.podCount, pod, '$tag.podCount');
  _eq(s.deliveredSum, sum, '$tag.deliveredSum');
}

void main() {
  // דוגמה 1 — תמהיל בסיסי
  final ex1 = courierDayStats([
    CourierDelivery(stage: 'delivered', sum: 100, courierUser: 'dan', podCaptured: true, deliveredAt: DateTime(2026, 8, 26, 9)),
    CourierDelivery(stage: 'delivered', sum: 250, courierUser: 'dan', podCaptured: false, deliveredAt: DateTime(2026, 8, 25, 18)),
    CourierDelivery(stage: 'delivered', sum: 40, courierUser: 'rina', podCaptured: true, deliveredAt: DateTime(2026, 8, 26, 8)),
    const CourierDelivery(stage: 'ready'),
    CourierDelivery(stage: 'transit', courierUser: 'dan', podCaptured: true),
  ], username: 'dan', today: _today);
  _check(ex1, 'ex1', dt: 1, mine: 2, active: 2, pod: 2, sum: 350);

  // דוגמה 2 — ריק
  final ex2 = courierDayStats(const [], username: 'dan', today: _today);
  _check(ex2, 'ex2', dt: 0, mine: 0, active: 0, pod: 0, sum: 0);

  // דוגמה 3 — לגאסי בלי ייחוס
  final ex3 = courierDayStats([
    CourierDelivery(stage: 'delivered', sum: 500, courierUser: null, podCaptured: true, deliveredAt: DateTime(2026, 8, 26)),
  ], username: 'dan', today: _today);
  _check(ex3, 'ex3', dt: 0, mine: 0, active: 0, pod: 0, sum: 0);

  // דוגמה 4 — נמסר-בעבר / בלי deliveredAt
  final ex4 = courierDayStats([
    CourierDelivery(stage: 'delivered', sum: 90, courierUser: 'dan', podCaptured: false, deliveredAt: DateTime(2026, 8, 20)),
    const CourierDelivery(stage: 'delivered', sum: 10, courierUser: 'dan', podCaptured: true),
  ], username: 'dan', today: _today);
  _check(ex4, 'ex4', dt: 0, mine: 2, active: 0, pod: 1, sum: 100);

  // דוגמה 5 — active כלל-מערכתי
  final ex5 = courierDayStats([
    const CourierDelivery(stage: 'pickup', courierUser: 'rina'),
    const CourierDelivery(stage: 'ready', courierUser: 'dan'),
    const CourierDelivery(stage: 'transit', courierUser: null),
  ], username: 'dan', today: _today);
  _check(ex5, 'ex5', dt: 0, mine: 0, active: 3, pod: 0, sum: 0);

  print('OK courier_day_stats 5/5');
}
