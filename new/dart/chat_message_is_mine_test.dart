// בדיקת-Golden · chatMessageIsMine — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'chat_message_is_mine.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((chatMessageIsMine(ChatMessage(id: 'a', threadId: 'a', fromRole: BsRole.contractor, text: 'a', ts: DateTime(2026, 8, 24)), BsRole.contractor, 'contractor')).toString(), 'true', '#0'); n++;
  _eq((chatMessageIsMine(ChatMessage(id: 'b', threadId: 'b', fromRole: BsRole.bot, text: 'b', ts: DateTime(2026, 1, 1, 13, 45)), BsRole.bot, 'store')).toString(), 'true', '#1'); n++;
  _eq((chatMessageIsMine(ChatMessage(id: 'c', threadId: 'c', fromRole: BsRole.worker, text: 'c', ts: DateTime(2025, 12, 31, 23, 59)), BsRole.worker, 'courier')).toString(), 'true', '#2'); n++;
  _eq((chatMessageIsMine(ChatMessage(id: 'c', threadId: 'c', fromRole: BsRole.worker, text: 'c', ts: DateTime(2025, 12, 31, 23, 59)), BsRole.worker, 'worker')).toString(), 'true', '#3'); n++;
  _eq((chatMessageIsMine(ChatMessage(id: 'c', threadId: 'c', fromRole: BsRole.worker, text: 'c', ts: DateTime(2025, 12, 31, 23, 59)), BsRole.worker, 'manager')).toString(), 'true', '#4'); n++;
  _eq((chatMessageIsMine(ChatMessage(id: 'c', threadId: 'c', fromRole: BsRole.worker, text: 'c', ts: DateTime(2025, 12, 31, 23, 59)), BsRole.worker, 'bot')).toString(), 'true', '#5'); n++;
  _eq((chatMessageIsMine(ChatMessage(id: 'c', threadId: 'c', fromRole: BsRole.worker, text: 'c', ts: DateTime(2025, 12, 31, 23, 59)), BsRole.worker, '')).toString(), 'true', '#6'); n++;
  _eq((chatMessageIsMine(ChatMessage(id: 'c', threadId: 'c', fromRole: BsRole.worker, text: 'c', ts: DateTime(2025, 12, 31, 23, 59)), BsRole.worker, 'abc')).toString(), 'true', '#7'); n++;
  _eq((chatMessageIsMine(ChatMessage(id: 'c', threadId: 'c', fromRole: BsRole.worker, text: 'c', ts: DateTime(2025, 12, 31, 23, 59)), BsRole.worker, 'כהן לוי')).toString(), 'true', '#8'); n++;
  _eq((chatMessageIsMine(ChatMessage(id: 'c', threadId: 'c', fromRole: BsRole.worker, text: 'c', ts: DateTime(2025, 12, 31, 23, 59)), BsRole.worker, '2026-08-24')).toString(), 'true', '#9'); n++;
  _eq((chatMessageIsMine(ChatMessage(id: 'c', threadId: 'c', fromRole: BsRole.worker, text: 'c', ts: DateTime(2025, 12, 31, 23, 59)), BsRole.worker, '0501234567')).toString(), 'true', '#10'); n++;
  _eq((chatMessageIsMine(ChatMessage(id: 'a', threadId: 'a', fromRole: BsRole.contractor, text: 'a', ts: DateTime(2026, 8, 24)), BsRole.bot, 'contractor')).toString(), 'false', '#11'); n++;
  print('✓ chatMessageIsMine: '+n.toString()+' Golden');
}
