// בדיקת-חוזה (רתמת-זהב) · trustReport — מייבאת אך ורק את האטום-שלה (חוק-4).
// 7 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/trust-report.test.mjs
// (אותם קלטים→פלטים; ‏eng = אובייקט-שקעים כמו במקור). מערכים מושווים
// אורך+איבר-איבר (חוק-8). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/trust-report_test.dart  ⇒ exit 0
import 'trust-report.dart';

int _f = 0;
void _ok(bool cond, String msg) {
  if (!cond) {
    // ignore: avoid_print
    print('✗ ' + msg);
    _f = 1;
  }
}

/// השוואת-מערך: אורך + איבר-איבר (חוק-8 — לעולם לא join).
void _eqList(List<dynamic> a, List<dynamic> b, String msg) {
  _ok(a.length == b.length, msg + ': אורך ' + a.length.toString() + ' ≠ ' + b.length.toString());
  if (a.length != b.length) return;
  for (var i = 0; i < a.length; i++) {
    _ok(a[i] == b[i], msg + '[' + i.toString() + ']: ' + a[i].toString() + ' ≠ ' + b[i].toString());
  }
}

// ‏eng בסיסי — featureOn לפי מפה, שאר האורקלים ירוקים (מקביל ל-mkEng במקור).
Map<String, dynamic> mkEng(Map<String, dynamic> flags, [Map<String, dynamic> over = const {}]) {
  final base = <String, dynamic>{
    'featureOn': (t, key) => _mapTruthy(flags[key]),
    'auditRoutes': (b) => <String, dynamic>{'ok': true, 'dangling': [], 'orphanTransfers': [], 'missingGateways': []},
    'failsafeRoute': (t) => <String, dynamic>{'ok': true, 'fallback': '200'},
    'recordingEncryption': (t) => <String, dynamic>{'enabled': false},
    'secretPreflight': (bs, e) => <String, dynamic>{'ok': true, 'missing': []},
    'crossTenantLeakScan': (bs) => <String, dynamic>{'clean': true, 'violations': []},
  };
  base.addAll(over);
  return base;
}

// ‏`!!flags[key]` של המקור — מפתח-חסר ⇒ false.
bool _mapTruthy(dynamic v) => !(v == null || v == false || v == 0 || v == '');

final bundle = <String, dynamic>{'tenant': <String, dynamic>{'tenantId': 't1'}, 'files': <String, dynamic>{}};

void main() {
  // 1) ירוק מינימלי — 5 בדיקות, score=100, grade='A'
  {
    final out = trustReport(bundle, {}, mkEng({'voice.hardening': true}));
    _eqList((out['checks'] as List).map((c) => c['key']).toList(),
        ['route-closure', 'failsafe', 'toll-caps', 'downstream', 'cti-readonly'], 'דוגמה 1: סדר-הבדיקות');
    _ok(out['score'] == 100, 'דוגמה 1: score ⇒ ' + out['score'].toString());
    _ok(out['grade'] == 'A', 'דוגמה 1: grade ⇒ ' + out['grade'].toString());
    _ok(out['ready'] == true, 'דוגמה 1: ready ⇒ ' + out['ready'].toString());
    _ok((out['failing'] as List).length == 0, 'דוגמה 1: failing לא ריק');
    _ok((out['checks'] as List)[1]['detail'] == 'נפילה למנהל 200', 'דוגמה 1: failsafe detail');
    _ok(out['tenantId'] == 't1', 'דוגמה 1: tenantId');
  }

  // 2) כשל-failsafe (critical) ⇒ score=70, grade='F', ready=false
  {
    final out = trustReport(bundle, {}, mkEng({'voice.hardening': true},
        {'failsafeRoute': (t) => <String, dynamic>{'ok': false}}));
    _ok(out['score'] == 70, 'דוגמה 2: score ⇒ ' + out['score'].toString());
    _ok(out['grade'] == 'F', 'דוגמה 2: grade ⇒ ' + out['grade'].toString());
    _ok(out['ready'] == false, 'דוגמה 2: ready ⇒ ' + out['ready'].toString());
    _eqList((out['failing'] as List).map((c) => c['key']).toList(), ['failsafe'], 'דוגמה 2: failing');
    _ok((out['failing'] as List)[0]['detail'] == 'אין מנהל — מבוי-סתום אפשרי', 'דוגמה 2: detail');
  }

  // 3) hardening כבוי (high) ⇒ score=80, grade='C', ready=true
  {
    final out = trustReport(bundle, {}, mkEng({}));
    _ok(out['score'] == 80, 'דוגמה 3: score ⇒ ' + out['score'].toString());
    _ok(out['grade'] == 'C', 'דוגמה 3: grade ⇒ ' + out['grade'].toString());
    _ok(out['ready'] == true, 'דוגמה 3: כשל-high לא חוסם');
  }

  // 4) recording פעיל ⇒ בדיקה שישית שתמיד pass=false; score=round(10/12*100)=83
  {
    final out = trustReport(bundle, {}, mkEng({'voice.hardening': true, 'recording': true},
        {'recordingEncryption': (t) => <String, dynamic>{'enabled': true}}));
    final rec = (out['checks'] as List).firstWhere((c) => c['key'] == 'recording-encryption');
    _ok((out['checks'] as List).length == 6, 'דוגמה 4: 6 בדיקות');
    _ok(rec['pass'] == false, 'דוגמה 4: pass=false תמיד');
    _ok(out['score'] == 83, 'דוגמה 4: score ⇒ ' + out['score'].toString());
    _ok(out['grade'] == 'C', 'דוגמה 4: grade ⇒ ' + out['grade'].toString());
    _ok((rec['detail'] as String).startsWith('מוגדר אך דורמנטי'), 'דוגמה 4: detail ⇒ ' + rec['detail'].toString());
  }

  // 5) כשרות תקינה ⇒ kosher-integrity pass; 12/12 ⇒ 100 'A'
  {
    final b = <String, dynamic>{
      'tenant': <String, dynamic>{
        'tenantId': 't1',
        'numbers': [
          <String, dynamic>{'kosher': true, 'onramp': 'sim-in-gateway', 'gatewayChannel': 2, 'channels': ['voice']},
        ],
      },
      'files': <String, dynamic>{},
    };
    final out = trustReport(b, {}, mkEng({'voice.hardening': true, 'voice.kosher': true}));
    final k = (out['checks'] as List).firstWhere((c) => c['key'] == 'kosher-integrity');
    _ok(k['pass'] == true, 'דוגמה 5: kosher pass');
    _ok(out['score'] == 100, 'דוגמה 5: score ⇒ ' + out['score'].toString());
    _ok(out['grade'] == 'A', 'דוגמה 5: grade ⇒ ' + out['grade'].toString());
  }

  // 6) env+peers — קריאות-השקעים המדויקות + כשל-סודות ⇒ 'F'
  {
    final env = <String, dynamic>{'K': 'v'};
    final peer = <String, dynamic>{'tenant': <String, dynamic>{'tenantId': 't2'}};
    List<dynamic>? pfBundles;
    dynamic pfEnv;
    List<dynamic>? leakArgs;
    final out = trustReport(bundle, <String, dynamic>{'env': env, 'peers': [peer]},
        mkEng({'voice.hardening': true}, {
      'secretPreflight': (bundles, e) {
        pfBundles = bundles as List;
        pfEnv = e;
        return <String, dynamic>{'ok': false, 'missing': ['A', 'B']};
      },
      'crossTenantLeakScan': (bundles) {
        leakArgs = bundles as List;
        return <String, dynamic>{'clean': true, 'violations': []};
      },
    }));
    _ok(pfBundles != null && pfBundles!.length == 1 && identical(pfBundles![0], bundle) && identical(pfEnv, env),
        'דוגמה 6: secretPreflight נקרא שגוי');
    _ok(leakArgs != null && leakArgs!.length == 2 && identical(leakArgs![0], bundle) && identical(leakArgs![1], peer),
        'דוגמה 6: crossTenantLeakScan נקרא שגוי');
    final sec = (out['checks'] as List).firstWhere((c) => c['key'] == 'secrets');
    _ok(out['grade'] == 'F', 'דוגמה 6: grade ⇒ ' + out['grade'].toString());
    _ok(out['ready'] == false, 'דוגמה 6: ready ⇒ ' + out['ready'].toString());
    _ok(sec['detail'] == 'חסרים 2 (שער-דומם)', 'דוגמה 6: detail ⇒ ' + sec['detail'].toString());
  }

  // 7) route-closure בכשל — איחוד רשימות-היתומים
  {
    final out = trustReport(bundle, {}, mkEng({'voice.hardening': true}, {
      'auditRoutes': (b) => <String, dynamic>{
            'ok': false,
            'dangling': ['x'],
            'orphanTransfers': ['y'],
            'missingGateways': ['z'],
          },
    }));
    _ok((out['checks'] as List)[0]['detail'] == 'יתומים: x, y, z',
        'דוגמה 7: detail יתומים ⇒ ' + (out['checks'] as List)[0]['detail'].toString());
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(trustReport(bundle, {}, mkEng({'voice.hardening': true}))['grade'] == 'A', 'assert-live guard');

  if (_f != 0) throw StateError('trust-report: דוגמת-חוזה נכשלה');
  // ignore: avoid_print
  print('✓ trust-report: 7 דוגמאות-חוזה — ירוק');
}
