// בדיקת-חוזה · deliveryNoteTitle — מייבאת רק את האטום-שלה (חוק-4).
// אימות: dart run --enable-asserts new/dart/delivery_note_title_test.dart ⇒ exit 0.
import 'delivery_note_title.dart';

void _eq(String got, String want, String msg) {
  if (got != want) {
    throw StateError('FAIL $msg\n  got : $got\n  want: $want');
  }
}

void main() {
  _eq(deliveryNoteTitle(const NoteOrder(id: 'ORD-1042')),
      'תעודת משלוח — ORD-1042', 'ex1');
  _eq(deliveryNoteTitle(const NoteOrder(id: '7')),
      'תעודת משלוח — 7', 'ex2');
  _eq(deliveryNoteTitle(const NoteOrder(id: '')),
      'תעודת משלוח — ', 'ex3-empty');
  _eq(deliveryNoteTitle(const NoteOrder(id: 'הזמנה #12')),
      'תעודת משלוח — הזמנה #12', 'ex4');
  print('OK delivery_note_title 4/4');
}
