// בדיקת-חוזה · certExpiryStatus — מייבאת רק את האטום-שלה (חוק-4).
// היום מוזרק כפרמטר קבוע (שקע-שעון · חוק-6) — אין DateTime.now.
// אימות: dart run --enable-asserts new/dart/cert_expiry_status_test.dart ⇒ exit 0.
import 'cert_expiry_status.dart';

final DateTime _now = DateTime(2026, 8, 26, 14, 30);

void _eq(CertExpiryStatus got, CertExpiryStatus want, String msg) {
  if (got != want) {
    throw StateError('FAIL $msg\n  got : $got\n  want: $want');
  }
}

void main() {
  _eq(certExpiryStatus(DateTime(2026, 8, 25), now: _now),
      CertExpiryStatus.expired, 'ex1-yesterday');
  _eq(certExpiryStatus(DateTime(2026, 8, 26), now: _now),
      CertExpiryStatus.expiringSoon, 'ex2-today');
  _eq(certExpiryStatus(DateTime(2026, 9, 26), now: _now),
      CertExpiryStatus.expiringSoon, 'ex3-31days');
  _eq(certExpiryStatus(DateTime(2026, 9, 27), now: _now),
      CertExpiryStatus.valid, 'ex4-32days');
  _eq(certExpiryStatus(DateTime(2027, 1, 1), now: _now),
      CertExpiryStatus.valid, 'ex5-far');
  print('OK cert_expiry_status 5/5');
}
