// בדיקת-חוזה · usableConnector — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/usable_connector_test.dart
// DoD (דיבר-12, נרשם לפני הקוד): הפקודה למעלה ⇒ exit 0 + "OK usable_connector".
import 'usable_connector.dart';

// פיקסטורה בדמות המקור: תפקידי-זרימה (מ-flowRole :310-317) + מפת-ספקים-מאומתים
// (‏kVerifiedSpecs) — מוזרקים דרך שני השקעים, כפי שהקופסה תחווט.
const _roleOf = {
  '77PIPE01': 'connector', // 'אביזרי נחושת' ⇒ connector (flow_role דוגמה 6)
  '77PIPE99': 'connector', // 'ברכיים' ⇒ connector — אך בלי ספק-מאומת
  '77TOILET1': 'fixture', // 'אסלות וכיורים' ⇒ fixture (התקן-קצה)
  '77701185': 'accessory', // מתלה מתכוונן — _accessorySkus (מקור:304)
  'UNKNOWN': 'accessory', // 'חבקי תליה' ⇒ מבני
};
const _verifiedSkus = {'77PIPE01', '77TOILET1', '77701185'};

bool _isConn(String sku) => _roleOf[sku] == 'connector';
bool _hasSpec(String sku) => _verifiedSkus.contains(sku);

bool _u(String sku) =>
    usableConnector(sku, isFlowConnector: _isConn, hasVerifiedSpec: _hasSpec);

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  // 1 · connector + ספק-מאומת ⇒ true (הצירוף היחיד שעובר; מקור:323).
  _eq(_u('77PIPE01'), true, '1 connector+verified'); n++;
  // 2 · connector בלי ספק-מאומת (name-inference) ⇒ false — לא נכנס ל-BOM אוטומטי.
  _eq(_u('77PIPE99'), false, '2 connector unverified'); n++;
  // 3 · fixture (התקן-קצה) ⇒ false גם כשמאומת — לעולם לא מחבר-אמצע-קו.
  _eq(_u('77TOILET1'), false, '3 fixture verified'); n++;
  // 4 · accessory (מתלה 77701185) ⇒ false גם כשמאומת.
  _eq(_u('77701185'), false, '4 accessory verified'); n++;
  // 5 · accessory מבני, לא-מאומת ⇒ false.
  _eq(_u('UNKNOWN'), false, '5 accessory unverified'); n++;

  // 6 · קצר-חישוב כמו && במקור: לא-connector ⇒ hasVerifiedSpec לא נקרא כלל.
  var specCalls = 0;
  final r = usableConnector('77TOILET1',
      isFlowConnector: _isConn,
      hasVerifiedSpec: (s) {
        specCalls++;
        return _hasSpec(s);
      });
  _eq(r, false, '6a short-circuit result'); n++;
  if (specCalls != 0) {
    throw StateError('FAIL [6b short-circuit]: hasVerifiedSpec נקרא $specCalls פעמים');
  }
  n++;

  // 7 · והצד השני: connector כן קורא לשקע-האימות (פעם אחת בדיוק).
  specCalls = 0;
  usableConnector('77PIPE01',
      isFlowConnector: _isConn,
      hasVerifiedSpec: (s) {
        specCalls++;
        return _hasSpec(s);
      });
  if (specCalls != 1) {
    throw StateError('FAIL [7 spec-called-once]: got=$specCalls want=1');
  }
  n++;

  assert(_u('77PIPE01') && !_u('77PIPE99'), 'assert-live guard');
  print('OK usable_connector · $n בדיקות ירוקות (עוגן install_engine.dart:322-323)');
}
