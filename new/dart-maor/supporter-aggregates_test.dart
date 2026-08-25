// בדיקת-חוזה · supporter-aggregates — כל 7 דוגמאות-החוזה + בדיקת-ה-JS, איבר-איבר.
import 'supporter-aggregates.dart';

void ok(bool cond, String msg) {
  if (!cond) throw StateError('✗ ' + msg);
}

/// השוואת-פלט שדה-שדה (לא join): count/ils/usd כערכים מספריים, first/last כמחרוזות.
void eqAgg(dynamic r, num count, num ils, num usd, String first, String last,
    String msg) {
  ok(r is Map, msg + ' — פלט אינו Map');
  ok(r.length == 5, msg + ' — מספר-שדות');
  ok(r['count'] == count, msg + ' — count');
  ok(r['ils'] == ils, msg + ' — ils');
  ok(r['usd'] == usd, msg + ' — usd');
  ok(r['first'] == first, msg + ' — first');
  ok(r['last'] == last, msg + ' — last');
}

void main() {
  // 1) שקל+דולר, תאריכים
  eqAgg(
      supporterAggregates({
        'donations': [
          {'amount': 100, 'cur': '₪', 'date': '2026-01-05'},
          {'amount': 50, 'cur': '\$', 'date': '2026-03-01'},
        ]
      }),
      2, 100, 50, '2026-01-05', '2026-03-01', 'דוגמה 1');

  // 2) אין donations
  eqAgg(supporterAggregates({}), 0, 0, 0, '', '', 'דוגמה 2');

  // 3) cur חסר ⇒ שקל
  {
    final r = supporterAggregates({
      'donations': [
        {'amount': 70, 'date': '2025-05-05'}
      ]
    });
    ok(r['ils'] == 70 && r['usd'] == 0, 'דוגמה 3');
  }

  // 4) NaN נספר כ-0 אך count עולה
  {
    final r = supporterAggregates({
      'donations': [
        {'amount': double.nan, 'date': '2025-01-01'},
        {'amount': 30, 'date': '2025-02-02'},
      ]
    });
    ok(r['count'] == 2 && r['ils'] == 30, 'דוגמה 4');
  }

  // 5) מיון תאריכים
  {
    final r = supporterAggregates({
      'donations': [
        {'amount': 1, 'date': '2026-06-01'},
        {'amount': 2, 'date': '2026-02-01'},
      ]
    });
    ok(r['first'] == '2026-02-01' && r['last'] == '2026-06-01', 'דוגמה 5');
  }

  // 6) קבלה בלי date לא נכנסת לטווח
  {
    final r = supporterAggregates({
      'donations': [
        {'amount': 10},
        {'amount': 20, 'date': '2026-04-04'},
      ]
    });
    ok(
        r['count'] == 2 &&
            r['ils'] == 30 &&
            r['first'] == '2026-04-04' &&
            r['last'] == '2026-04-04',
        'דוגמה 6');
  }

  // 7) donations שאינו מערך ⇒ כ-ריק
  eqAgg(supporterAggregates({'donations': 'x'}), 0, 0, 0, '', '', 'דוגמה 7');

  // תוספות זהות-ביט מעבר לחוזה:
  // 7a) Infinity נספר כ-0 (Number.isFinite=false) אך count עולה
  {
    final r = supporterAggregates({
      'donations': [
        {'amount': double.infinity, 'date': '2025-03-03'},
        {'amount': 5, 'cur': '\$'},
      ]
    });
    ok(r['count'] == 2 && r['ils'] == 0 && r['usd'] == 5, 'תוספת Infinity');
  }
  // 7b) date ריק ('') = falsy ⇒ לא נכנס לטווח (truthiness של JS)
  {
    final r = supporterAggregates({
      'donations': [
        {'amount': 1, 'date': ''},
      ]
    });
    ok(r['count'] == 1 && r['first'] == '' && r['last'] == '', 'תוספת date ריק');
  }
  // 7c) amount מחרוזת אינו מספר-סופי ⇒ 0 (Number.isFinite('7')=false)
  {
    final r = supporterAggregates({
      'donations': [
        {'amount': '7', 'date': '2025-06-06'},
      ]
    });
    ok(r['count'] == 1 && r['ils'] == 0, 'תוספת amount מחרוזת');
  }

  print('OK');
}
