// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _dayBucket — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/intel/segments.dart:249-313 (65 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): toUtc, joinSegmentsToCustomers, uidOf, compareTo
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
DateTime _dayBucket(DateTime at, Duration offset) {
  final shifted = at.toUtc().add(offset);
  return DateTime.utc(shifted.year, shifted.month, shifted.day);
}

/// One joined row — an actor roll-up aligned to its owner-side [ManagerCustomer]
/// business record. The pair is matched BY UID (see [joinSegmentsToCustomers]),
/// never by the display label.
class ActorCustomerJoin {
  /// [customer] is null when the roll-up has no matching owner-side record.
  const ActorCustomerJoin({required this.segment, this.customer});

  /// The stable-identity roll-up (keyed by uid/actorKey).
  final ActorSegment segment;

  /// The owner-side customer record matched by uid, or null when unmatched.
  final ManagerCustomer? customer;

  /// The roll-up's stable key ([ActorSegment.key]).
  String get key => segment.key;

  /// True iff an owner-side record was matched by uid.
  bool get matched => customer != null;

  /// The customer label resolved OWNER-SIDE from the joined record — never a
  /// merge key (R2-#12). Null when unmatched.
  String? get resolvedLabel => customer?.name;
}

/// Align each actor roll-up in [segments] to a [ManagerCustomer] in [customers]
/// VIA THE UID KEY — never the display label (R2-#12 DoD).
///
/// ── ManagerCustomer uid reconciliation (documented) ──
/// [ManagerCustomer] (`manager_dashboard.dart:299-325`) is a DERIVED aggregate
/// over `Order.who` display labels and exposes NO customer-uid field: its only
/// identity-ish field, `ownerId`, is the OWNING MANAGER's auth.uid (and is always
/// '' on the derived path), NOT the customer's identity — so it is not a valid
/// customer join key. Therefore the customer's uid is supplied OWNER-SIDE via the
/// REQUIRED [uidOf] resolver. There is deliberately NO label fallback: a resolver
/// (not the display label) is the only way to key a customer, which makes joining
/// by label structurally impossible. Two customers who share a label but resolve
/// to different uids therefore stay SEPARATE rows.
///
/// Returns one row per roll-up (matched + unmatched), sorted by [ActorSegment.key]
/// for deterministic order.
List<ActorCustomerJoin> joinSegmentsToCustomers(
  Map<String, ActorSegment> segments,
  List<ManagerCustomer> customers, {
  required String? Function(ManagerCustomer customer) uidOf,
}) {
  // Index owner-side records by their owner-supplied uid — never the label.
  final byUid = <String, ManagerCustomer>{};
  for (final c in customers) {
    final id = uidOf(c);
    if (id == null || id.isEmpty) continue;
    byUid[id] = c; // last write wins on a duplicate uid (owner-side dedupe)
  }

  final out = <ActorCustomerJoin>[
    for (final entry in segments.entries)
      ActorCustomerJoin(segment: entry.value, customer: byUid[entry.key]),
  ]..sort((a, b) => a.key.compareTo(b.key));
  return out;
}

