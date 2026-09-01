import '../dart-data-maor/task-identity-sockets.dart' as sk_task_identity;
// בדיקת-חוזה ל-taskIdentity: 12 הקלטות-Golden + ratchet לתיקון-ההסגר (Final_Sigma
// + İ + צ'רוקי) — כולם אומתו מול V8/Node.
import 'task-identity.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw AssertionError('✗ $label ⇒ "$got" ≠ "$want"');
  }
}

void main() {
  // — 12 הקלטות-Golden (task-identity.test.mjs) —
  _eq(taskIdentity('', sk_task_identity.taskIdentity_T), 'מקומי', 'empty');
  _eq(taskIdentity('אבג', sk_task_identity.taskIdentity_T), 'אבג', 'heb');
  _eq(taskIdentity('כהן לוי', sk_task_identity.taskIdentity_T), 'כהן לוי', 'heb-two');
  _eq(taskIdentity('abc', sk_task_identity.taskIdentity_T), 'abc', 'abc');
  _eq(taskIdentity('a@b.com', sk_task_identity.taskIdentity_T), 'a@b.com', 'email');
  _eq(taskIdentity('2026-08-24', sk_task_identity.taskIdentity_T), '2026-08-24', 'date');
  _eq(taskIdentity('2026-08-24T12:00:00', sk_task_identity.taskIdentity_T), '2026-08-24t12:00:00', 'datetime');
  _eq(taskIdentity('0501234567', sk_task_identity.taskIdentity_T), '0501234567', 'phone');
  _eq(taskIdentity('03-1234567', sk_task_identity.taskIdentity_T), '03-1234567', 'phone2');
  _eq(taskIdentity('https://x.co', sk_task_identity.taskIdentity_T), 'https://x.co', 'url');
  _eq(taskIdentity('שלום עולם', sk_task_identity.taskIdentity_T), 'שלום עולם', 'heb-hello');
  _eq(taskIdentity('12', sk_task_identity.taskIdentity_T), '12', 'num');

  // — null/undefined ⇒ 'מקומי' (?? ריק) —
  _eq(taskIdentity(null, sk_task_identity.taskIdentity_T), 'מקומי', 'null');

  // — ratchet חוק-13: Final_Sigma (התיקון) —
  _eq(taskIdentity('ΟΔΟΣ', sk_task_identity.taskIdentity_T), 'οδος', 'final-sigma-word'); // Σ סופית ⇒ ς
  _eq(taskIdentity('Σ', sk_task_identity.taskIdentity_T), 'σ', 'sigma-isolated'); // מבודדת ⇒ σ
  _eq(taskIdentity('Σx', sk_task_identity.taskIdentity_T), 'σx', 'sigma-then-letter'); // אחריה אות ⇒ σ

  // — ratchet חוק-13: İ ⇒ i + combining-dot —
  _eq(taskIdentity('İ', sk_task_identity.taskIdentity_T), 'i̇', 'dotted-I');

  // — ratchet חוק-13: צ'רוקי שני-הטווחים —
  _eq(taskIdentity('Ꭰ', sk_task_identity.taskIdentity_T), 'ꭰ', 'cherokee-lo'); // +0x97D0
  _eq(taskIdentity('Ᏸ', sk_task_identity.taskIdentity_T), 'ᏸ', 'cherokee-supp'); // +8

  // — trim: NEL (U+0085) לא נגזם (חוק-16) —
  _eq(taskIdentity('a', sk_task_identity.taskIdentity_T), 'a', 'nel-kept');
  _eq(taskIdentity('  a  ', sk_task_identity.taskIdentity_T), 'a', 'ascii-trim');

  print('✓ task-identity.dart: כל הבדיקות עברו (Golden + ratchet חוק-13/16)');
}
