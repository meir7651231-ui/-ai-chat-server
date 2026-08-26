// בדיקת-חוזה · mgrCustomerList — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/mgr_customer_list_test.dart
import 'mgr_customer_list.dart';

ManagerOrder _o(String who, int sum) => ManagerOrder(who: who, sum: sum);

// סריאליזציית-לקוח יציבה להשוואה: name·count·spend·credit.
String _s(ManagerCustomer c) =>
    '${c.name}·${c.orderCount}·${c.totalSpend}·${c.creditLimit}';

void _eq(List<ManagerCustomer> got, List<String> want, String label) {
  final g = got.map(_s).join(' | ');
  final w = want.join(' | ');
  if (g != w) {
    throw StateError('FAIL [$label]: got="$g" want="$w"');
  }
}

void main() {
  var n = 0;

  _eq(mgrCustomerList(const []), const [], '1 empty'); n++;
  _eq(mgrCustomerList([_o('A', 100)]), const ['A·1·100·0'], '2 single'); n++;
  _eq(mgrCustomerList([_o('A', 100), _o('A', 30)]),
      const ['A·2·130·0'], '3 fold'); n++;
  _eq(mgrCustomerList([_o('A', 100), _o('B', 50)]),
      const ['A·1·100·0', 'B·1·50·0'], '4 sort desc'); n++;
  _eq(mgrCustomerList([_o('B', 50), _o('A', 100)]),
      const ['A·1·100·0', 'B·1·50·0'], '5 input-order independent'); n++;
  _eq(mgrCustomerList([_o('A', 20), _o('B', 50), _o('A', 40)]),
      const ['A·2·60·0', 'B·1·50·0'], '6 fold + sort'); n++;

  // ownerId/phone ברירת-מחדל '' (data-class-אח verbatim).
  final one = mgrCustomerList([_o('Z', 9)]).first;
  if (one.ownerId != '' || one.phone != '') {
    throw StateError('FAIL [7 defaults]: ownerId="${one.ownerId}" phone="${one.phone}"');
  }
  n++;

  assert(mgrCustomerList([_o('Q', 5)]).first.creditLimit == 0, 'assert-live guard');

  print('OK mgrCustomerList: $n asserts passed');
}
