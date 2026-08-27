import 'match_trigger_id.dart';

// מימוש-אמת לשקע matchClosed — verbatim מהמקור (_matchClosed).
String? matchClosed(Set<String> closed, String reply) {
  final r = reply.trim();
  if (r.isEmpty) return null;
  for (final k in closed) {
    if (r == k) return k;
  }
  String? best;
  for (final k in closed) {
    if (k.isNotEmpty &&
        r.contains(k) &&
        (best == null || k.length > best.length)) {
      best = k;
    }
  }
  return best;
}

void main() {
  // exact.
  assert(matchTriggerId('order.stuck', matchClosed: matchClosed) == 'order.stuck');
  // longest-contained בתוך משפט.
  assert(matchTriggerId('הטריגר הוא order.delivered כן', matchClosed: matchClosed) ==
      'order.delivered');
  // המצאה / ריק ⇒ null.
  assert(matchTriggerId('order.zzz', matchClosed: matchClosed) == null);
  assert(matchTriggerId('', matchClosed: matchClosed) == null);
  print('matchTriggerId OK');
}
