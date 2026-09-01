import '../dart-data-maor/telephony-to-tenant-sockets.dart' as sk_telephony_to_tenant;
/// בדיקות-חוזה · telephony-to-tenant — כל 7 דוגמאות-החוזה + בדיקת-ה-JS.
/// מערכים = אורך + איבר-איבר; כשל ⇒ StateError.
import 'telephony-to-tenant.dart';

void ok(bool cond, String msg) {
  if (!cond) throw StateError(msg);
}

bool listEq(dynamic a, List b) {
  if (a is! List || a.length != b.length) return false;
  for (var i = 0; i < b.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

Map<String, dynamic> baseTc(List numbers) => <String, dynamic>{
      'numbers': numbers,
      'officeDays': [4, 0, 2],
      'officeStart': '09:00',
      'officeEnd': '17:00',
      'officeExt': '101',
      'managerExt': '201',
      'vmBox': '100',
      'city': '',
      'kosherMode': false,
      'hebrewCalendar': true,
      'zmanim': false,
      'shabbat': true,
      'fasts': false,
      'voicemail': true,
    };

Map<String, dynamic> findNum(Map<String, dynamic> t, String id) =>
    (t['numbers'] as List).cast<Map<String, dynamic>>().firstWhere(
          (n) => n['id'] == id,
          orElse: () => throw StateError('קו $id לא נמצא'),
        );

void main() {
  final t = telephonyToTenant(baseTc([
      {'id': 'n1', 'e164': ' +972501234567 ', 'label': 'קו ראשי', 'kind': 'sim'},
      {'id': 'n2', 'e164': '', 'label': 'ריק', 'kind': 'virtual'},
      {'id': 'n3', 'e164': '+97277', 'kind': 'virtual'},
      {'id': 'n4', 'e164': '+97252', 'kind': 'whatsapp', 'kosher': true},
      {'id': 'n5', 'e164': '+972521111111', 'label': 'שער ב', 'kind': 'sim'},
    ]), '', 'maor-test', sk_telephony_to_tenant.telephonyToTenant_T);
  final nums = t['numbers'] as List;

  // 1) קו בלי e164 מסונן
  ok(nums.length == 4 && !nums.any((n) => n['id'] == 'n2'),
      'דוגמה 1: קו-ריק לא סונן');

  // 2) SIM: trim + onramp/channels + ערוצי-שער עולים
  final n1 = findNum(t, 'n1');
  ok(n1['e164'] == '+972501234567', 'דוגמה 2: e164 לא עבר trim');
  ok(n1['label'] == 'קו ראשי' && n1['type'] == 'sim',
      'דוגמה 2: label/type שגויים');
  ok(n1['onramp'] == 'sim-in-gateway' && listEq(n1['channels'], ['voice']),
      'דוגמה 2: onramp/channels של sim שגויים');
  ok(n1['gatewayChannel'] == 1, 'דוגמה 2: gatewayChannel ראשון לא 1');
  ok(findNum(t, 'n5')['gatewayChannel'] == 2, 'דוגמה 2: SIM שני לא ערוץ 2');

  // 3) virtual בלי label ⇒ id; whatsapp ⇒ device-link + kosher
  final n3 = findNum(t, 'n3');
  ok(
      n3['label'] == 'n3' &&
          n3['onramp'] == 'customer-forward' &&
          !n3.containsKey('gatewayChannel'),
      'דוגמה 3: virtual שגוי');
  final n4 = findNum(t, 'n4');
  ok(
      n4['onramp'] == 'device-link' &&
          listEq(n4['channels'], ['whatsapp']) &&
          n4['kosher'] == true,
      'דוגמה 3: whatsapp שגוי');
  ok(!n1.containsKey('kosher'), 'דוגמה 3: kosher הופיע כשלא-truthy');

  // 4) outbound: ה-SIM הראשון; בלי SIM ⇒ ראשון; אפס-קווים ⇒ 'n1'
  ok((t['outbound'] as Map)['defaultNumberId'] == 'n1',
      'דוגמה 4: default לא ה-SIM הראשון');
  final tNoSim = telephonyToTenant(baseTc([
        {'id': 'v9', 'e164': '+9721', 'kind': 'virtual'}
      ]), 'א', 'x-org', sk_telephony_to_tenant.telephonyToTenant_T);
  ok((tNoSim['outbound'] as Map)['defaultNumberId'] == 'v9',
      'דוגמה 4: בלי-SIM לא נפל לקו הראשון');
  final tEmpty = telephonyToTenant(baseTc([]), 'א', 'x-org', sk_telephony_to_tenant.telephonyToTenant_T);
  ok((tEmpty['outbound'] as Map)['defaultNumberId'] == 'n1',
      "דוגמה 4: אפס-קווים לא 'n1'");

  // 5) officeHours ממוין + destinations + cti
  final oh = t['officeHours'] as Map;
  ok(
      listEq(oh['days'], [0, 2, 4]) &&
          oh['start'] == '09:00' &&
          oh['end'] == '17:00' &&
          oh.length == 3,
      'דוגמה 5: officeHours שגוי');
  final dest = t['destinations'] as Map;
  final office = dest['office'] as Map;
  final manager = dest['manager'] as Map;
  final vm = dest['voicemail'] as Map;
  ok(
      dest.length == 3 &&
          listEq(office['ext'], ['101']) &&
          office['ringSeconds'] == 25 &&
          office.length == 2 &&
          manager['ext'] == '201' &&
          manager['ringSeconds'] == 30 &&
          manager.length == 2 &&
          vm['box'] == '100' &&
          vm.length == 1,
      'דוגמה 5: destinations שגוי');
  final cti = t['cti'] as Map;
  ok(cti['org'] == 'maor-test' && cti['mode'] == 'directory' && cti.length == 2,
      'דוגמה 5: cti שגוי');

  // 6) orgName ריק ⇒ 'ארגון'; city ריק ⇒ אין מפתח; timezone קבוע
  ok(t['orgName'] == 'ארגון', "דוגמה 6: orgName ריק לא 'ארגון'");
  ok(!t.containsKey('city'), 'דוגמה 6: city ריק הופיע');
  ok(t['timezone'] == 'Asia/Jerusalem', 'דוגמה 6: timezone שגוי');
  final tCity = telephonyToTenant(<String, dynamic>{...baseTc([]), 'city': 'צפת'}, 'מאור', 'x-org', sk_telephony_to_tenant.telephonyToTenant_T);
  ok(tCity['city'] == 'צפת' && tCity['orgName'] == 'מאור',
      'דוגמה 6: city/orgName מלאים שגויים');

  // 7) features — מיפוי ישיר מהדגלים
  final feat = t['features'] as Map;
  ok(
      feat.length == 6 &&
          feat['voice.kosher'] == false &&
          feat['calendar.hebrew'] == true &&
          feat['calendar.shabbat'] == true &&
          feat['calendar.fasts'] == false &&
          feat['calendar.zmanim'] == false &&
          feat['voicemail'] == true,
      'דוגמה 7: features שגוי');

  // סדר-מפתחות זהה ל-JS (סדר-הכנסה, בלי city כשריק)
  ok(
      listEq(t.keys.toList(), [
        'tenantId',
        'orgName',
        'timezone',
        'officeHours',
        'numbers',
        'destinations',
        'outbound',
        'cti',
        'features'
      ]),
      'סדר-מפתחות-tenant שגוי');
  ok(
      listEq(tCity.keys.toList(), [
        'tenantId',
        'orgName',
        'timezone',
        'city',
        'officeHours',
        'numbers',
        'destinations',
        'outbound',
        'cti',
        'features'
      ]),
      'סדר-מפתחות עם city שגוי');
  ok(
      listEq(n1.keys.toList(),
          ['id', 'e164', 'label', 'type', 'onramp', 'channels', 'gatewayChannel']),
      'סדר-מפתחות-קו-SIM שגוי');
  ok(
      listEq(n4.keys.toList(),
          ['id', 'e164', 'label', 'type', 'onramp', 'channels', 'kosher']),
      'סדר-מפתחות-קו-whatsapp שגוי');

  print('OK');
}
