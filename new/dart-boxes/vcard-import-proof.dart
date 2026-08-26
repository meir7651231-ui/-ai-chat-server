// 🧪 הוכחת-חוצה-שפות · vcard-import (Dart) — מריצה את vcard-import.dart על אותם
// קלטים/WANT כמו new/boxes/vcard-import.test.mjs. ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה.
import 'dart:convert';
import 'vcard-import.dart' as V;

int n = 0, fails = 0;
void eq(String name, Object? got, Object? want) {
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) {
    print('✗ $name: got $g want $w');
    fails++;
  } else {
    n++;
  }
}

void main() {
  // 1) QP — עברית אמיתית (עדשה-עוינת: המקור מטפל, האטום-הישן זרק HEX2)
  eq('QP קיר', V.decodeQuotedPrintable('=D7=A7=D7=99=D7=A8'), 'קיר');
  eq('QP ascii', V.decodeQuotedPrintable('Abc 123'), 'Abc 123');

  // 2) קובץ בן 3 כרטיסים (דוגמת-החוזה §3)
  final vcf = [
    'BEGIN:VCARD', 'VERSION:2.1',
    'N;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:=D7=9B=D7=94=D7=9F;=D7=9E=D7=90=D7=99=D7=A8;;;',
    'FN;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:=D7=9E=D7=90=D7=99=D7=A8 =D7=9B=D7=94=D7=9F',
    'TEL;CELL:050-1234567', 'TEL;HOME:03-9998888',
    'EMAIL:maor@example.com',
    'ORG;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:=D7=97=D7=A1=D7=93;',
    'TITLE:Manager',
    'ADR;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:;;=D7=A8=D7=97=D7=95=D7=91 1;=D7=AA=D7=9C =D7=90=D7=91=D7=99=D7=91;;;',
    'NOTE:hello', 'END:VCARD',
    'BEGIN:VCARD', 'FN:Junk', 'TEL:100', 'END:VCARD',
    'BEGIN:VCARD', 'TEL:0501112222', 'END:VCARD',
  ].join('\r\n');

  final parsed = V.parseVcards(vcf);
  eq('parsed count', parsed.length, 3);
  eq('c0', parsed[0], {
    'fullName': 'מאיר כהן', 'family': 'כהן', 'given': 'מאיר',
    'phones': [
      {'value': '050-1234567', 'label': 'נייד'},
      {'value': '03-9998888', 'label': 'בית'},
    ],
    'emails': ['maor@example.com'], 'org': 'חסד', 'title': 'Manager',
    'address': 'רחוב 1, תל אביב', 'note': 'hello',
  });
  eq('c1 junk (טלפון 100)', V.isJunkContact(parsed[1]), true);
  eq('c2 junk (בלי-שם)', V.isJunkContact(parsed[2]), true);
  eq('importable count', V.importableContacts(vcf).length, 1);
  eq('row0', V.contactToRow(parsed[0]), {
    'name': 'מאיר כהן', 'phone': '050-1234567', 'phone2': '03-9998888',
    'email': 'maor@example.com', 'address': 'רחוב 1, תל אביב',
    'notes': '🏢 חסד · Manager · hello',
  });

  // 3) תווית-טלפון עברית מותאמת (X-CUSTOM QP)
  final vcf2 = [
    'BEGIN:VCARD', 'FN:Test',
    'TEL;X-CUSTOM(CHARSET=UTF-8,ENCODING=QUOTED-PRINTABLE,=D7=A0=D7=99=D7=99=D7=93):0509999999',
    'END:VCARD',
  ].join('\n');
  eq('custom hebrew label', V.parseVcards(vcf2)[0]['phones'], [
    {'value': '0509999999', 'label': 'נייד'},
  ]);

  // 4) קלט-קצה — ריק/null (עדשה-עוינת)
  eq('empty', V.parseVcards(''), []);
  eq('null', V.parseVcards(null), []);
  eq('importable empty', V.importableContacts(''), []);

  // 5) 🛡 מגן-הכרעה — מדולג: המגן ב-vcard-import.test.mjs הוא הגנת-מקור-JS
  //    (readFileSync + src.includes על טקסט-ה-mjs). לא רלוונטי לתאום-ה-Dart.

  if (fails > 0) {
    print('❌ קופסת-vcard-import (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('vcard-import dart proof failed');
  }
  print('✓ קופסת-vcard-import (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
