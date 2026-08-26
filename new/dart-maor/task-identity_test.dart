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
  _eq(taskIdentity(''), 'מקומי', 'empty');
  _eq(taskIdentity('אבג'), 'אבג', 'heb');
  _eq(taskIdentity('כהן לוי'), 'כהן לוי', 'heb-two');
  _eq(taskIdentity('abc'), 'abc', 'abc');
  _eq(taskIdentity('a@b.com'), 'a@b.com', 'email');
  _eq(taskIdentity('2026-08-24'), '2026-08-24', 'date');
  _eq(taskIdentity('2026-08-24T12:00:00'), '2026-08-24t12:00:00', 'datetime');
  _eq(taskIdentity('0501234567'), '0501234567', 'phone');
  _eq(taskIdentity('03-1234567'), '03-1234567', 'phone2');
  _eq(taskIdentity('https://x.co'), 'https://x.co', 'url');
  _eq(taskIdentity('שלום עולם'), 'שלום עולם', 'heb-hello');
  _eq(taskIdentity('12'), '12', 'num');

  // — null/undefined ⇒ 'מקומי' (?? ריק) —
  _eq(taskIdentity(null), 'מקומי', 'null');

  // — ratchet חוק-13: Final_Sigma (התיקון) —
  _eq(taskIdentity('ΟΔΟΣ'), 'οδος', 'final-sigma-word'); // Σ סופית ⇒ ς
  _eq(taskIdentity('Σ'), 'σ', 'sigma-isolated'); // מבודדת ⇒ σ
  _eq(taskIdentity('Σx'), 'σx', 'sigma-then-letter'); // אחריה אות ⇒ σ

  // — ratchet חוק-13: İ ⇒ i + combining-dot —
  _eq(taskIdentity('İ'), 'i̇', 'dotted-I');

  // — ratchet חוק-13: צ'רוקי שני-הטווחים —
  _eq(taskIdentity('Ꭰ'), 'ꭰ', 'cherokee-lo'); // +0x97D0
  _eq(taskIdentity('Ᏸ'), 'ᏸ', 'cherokee-supp'); // +8

  // — trim: NEL (U+0085) לא נגזם (חוק-16) —
  _eq(taskIdentity('a'), 'a', 'nel-kept');
  _eq(taskIdentity('  a  '), 'a', 'ascii-trim');

  print('✓ task-identity.dart: כל הבדיקות עברו (Golden + ratchet חוק-13/16)');
}
