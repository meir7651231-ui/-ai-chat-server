// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · mgrCustomerList — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/manager_dashboard.dart:279-366 (88 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): toList, compareTo, copyWith
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<ManagerCustomer> mgrCustomerList([List<ManagerOrder>? orders]) {
  final src = orders ?? kManagerOrderSeed;
  final byBuyer = <String, ManagerCustomer>{};
  for (final o in src) {
    final cur = byBuyer[o.who];
    if (cur == null) {
      byBuyer[o.who] = ManagerCustomer(
        name: o.who,
        orderCount: 1,
        totalSpend: o.sum,
        // fake-data-sweep 1א: real credit comes from computeCredit (customerCreditProvider); the sync seed is 0 ("לא רשומה"), never the name-hash.
        creditLimit: 0,
      );
    } else {
      byBuyer[o.who] = ManagerCustomer(
        name: cur.name,
        orderCount: cur.orderCount + 1,
        totalSpend: cur.totalSpend + o.sum,
        creditLimit: cur.creditLimit,
      );
    }
  }
  final out = byBuyer.values.toList()
    ..sort((a, b) => b.totalSpend.compareTo(a.totalSpend));
  return out;
}

/// A buyer aggregate — M3 foundation (see [mgrCustomerList]).
class ManagerCustomer {
  const ManagerCustomer({
    required this.name,
    required this.orderCount,
    required this.totalSpend,
    required this.creditLimit,
    this.ownerId = '',
    this.phone = '',
  });

  final String name;
  final int orderCount;
  final int totalSpend;
  final int creditLimit;

  /// A11 (launch uid-migration) — the owning manager's `auth.uid`, forward-ready
  /// for the SSOT `customers/{id}.ownerId`. Currently ALWAYS '' on this path:
  /// the aggregate is DERIVED from orders (`mgrCustomerList` over `Order.who`
  /// display names), so there is no owner-uid to stamp here, and the
  /// [CustomersRepository] interface carries NO public write method that creates
  /// a customer doc (it is a read-only derived surface — `all`/`byName`/
  /// `creditLimit`). The field exists so the Firestore mapper round-trips the
  /// schema's `ownerId` losslessly and so a FUTURE customer-write path can stamp
  /// it from `currentUidProvider`. Additive + display-neutral: written to the
  /// doc only when non-empty, so the seed + every legacy doc round-trip
  /// byte-identical (zero regression — the A3 `contractorUid` guard).
  final String ownerId;

  /// #8/3c (per-customer chat link) — the customer's (contractor's) free-text
  /// phone, carried onto the aggregate so the manager's chat affordance can
  /// resolve it to a chat uid (`UsersLookup.uidByPhone`) or fall back to 📞/💬
  /// (`ContactActions`). It is DERIVED, not stored on the `customers` doc:
  /// `managerCustomersProvider` (state/orders_engine.dart) stamps it from the
  /// buyer's MOST-RECENT non-empty `Order.customerPhone` (orders are newest-first,
  /// so the first non-empty phone per buyer wins) — the same field the order rows
  /// already reach with `ContactActions`. Additive + display-neutral: '' when
  /// unknown (the seed + every phone-less order), it is never mapped into `toDoc`/
  /// `fromDoc` (so Firestore docs round-trip byte-identical), and nothing renders
  /// it unless the LIVE chat affordance is shown (gated on `useFirebaseBackend`)
  /// — so the customers tab is byte-identical when the backend is off.
  final String phone;

  ManagerCustomer copyWith({
    String? name,
    int? orderCount,
    int? totalSpend,
    int? creditLimit,
    String? ownerId,
    String? phone,
  }) =>
      ManagerCustomer(
        name: name ?? this.name,
        orderCount: orderCount ?? this.orderCount,
        totalSpend: totalSpend ?? this.totalSpend,
        creditLimit: creditLimit ?? this.creditLimit,
        ownerId: ownerId ?? this.ownerId,
        phone: phone ?? this.phone,
      );
}

