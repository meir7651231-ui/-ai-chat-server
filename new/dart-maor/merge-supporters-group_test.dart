// רתמת-זהב · merge-supporters-group — דוגמאות-החוזה בדיוק כלשונן מבדיקת-ה-JS.
// אם עובר: Dart ≡ JS. הרצה: dart run --enable-asserts merge-supporters-group_test.dart
import 'merge-supporters-group.dart';

void main() {
  var calls = 0;
  // שקע-בדיקה כלשון-החוזה: סוכם ils ורושם את סדר-המיזוג
  // (a,b) => {...a, ils: a.ils+b.ils, order: [...(a.order ?? []), b.id]}
  dynamic fakeMerge(dynamic a, dynamic b) {
    calls++;
    return {
      ...a,
      'ils': a['ils'] + b['ils'],
      'order': [...(a['order'] ?? []), b['id']],
    };
  }

  // דוגמה 1 — קיפול-שמאלי של 3 כרטיסים
  {
    calls = 0;
    final out = mergeSupportersGroup(
      {'id': 'a', 'ils': 100},
      [
        {'id': 'b', 'ils': 50},
        {'id': 'c', 'ils': 25},
      ],
      fakeMerge,
    );
    assert(out['ils'] == 175, '1 ils=175');
    assert(out['id'] == 'a', '1 id=a');
    assert(out['order'].join(',') == ['b', 'c'].join(','), '1 סדר');
    assert(out['order'].length == 2, '1 אורך-סדר');
    assert(calls == 2, '1 שתי-קריאות');
  }

  // דוגמה 2 — losers ריק ⇒ ה-keeper עצמו, אפס קריאות
  {
    calls = 0;
    final keeper = {'id': 'a', 'ils': 100};
    final out = mergeSupportersGroup(keeper, [], fakeMerge);
    assert(identical(out, keeper), '2 אותו-אובייקט');
    assert(calls == 0, '2 אפס-קריאות');
  }

  // דוגמה 3 — loser יחיד ⇒ קריאה אחת בדיוק
  {
    calls = 0;
    final out = mergeSupportersGroup(
      {'id': 'a', 'ils': 7},
      [
        {'id': 'z', 'ils': 3},
      ],
      fakeMerge,
    );
    assert(out['ils'] == 10, '3 ils=10');
    assert(calls == 1, '3 קריאה-אחת');
  }

  print('✓ merge-supporters-group: 3 דוגמאות-חוזה — ירוק (Dart ≡ JS)');
}
