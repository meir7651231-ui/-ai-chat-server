import 'linked_budget.dart';

void main() {
  // pct=0 ⇒ ללא שינוי.
  assert(linkedBudget(15000, buildIndexDeltaPct: () => 0) == 15000);
  // pct=10 ⇒ 15000*1.10 = 16500.
  assert(linkedBudget(15000, buildIndexDeltaPct: () => 10) == 16500);
  // pct=6.10 ⇒ 15000*1.061 = 15915.
  assert(linkedBudget(15000, buildIndexDeltaPct: () => 6.10) == 15915);
  // pct=20 ⇒ 100*1.20 = 120.
  assert(linkedBudget(100, buildIndexDeltaPct: () => 20) == 120);
  print('linkedBudget OK');
}
