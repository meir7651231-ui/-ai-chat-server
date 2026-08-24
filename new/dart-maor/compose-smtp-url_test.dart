import 'compose-smtp-url.dart';

void main() {
  // רתמת-זהב: בדיוק דוגמאות-החוזה של בדיקת-ה-JS (אותם קלטים→פלטים).
  assert(composeSmtpUrl('a@b.com', 'pw', 'smtp.gmail.com:465') ==
      'smtps://a%40b.com:pw@smtp.gmail.com:465');
  assert(composeSmtpUrl('a@b.com', 'pw', 'smtp-mail.outlook.com:587') ==
      'smtp://a%40b.com:pw@smtp-mail.outlook.com:587');
  assert(composeSmtpUrl('a@b.com', 'p@ss:1/2', 'h.co:465') ==
      'smtps://a%40b.com:p%40ss%3A1%2F2@h.co:465');
  assert(composeSmtpUrl(' a@b.com ', ' pw ', ' smtp.gmail.com:465 ') ==
      'smtps://a%40b.com:pw@smtp.gmail.com:465');
  assert(composeSmtpUrl('', 'pw', 'h:465') == null);
  assert(composeSmtpUrl('a@b.com', '', 'h:465') == null);
  assert(composeSmtpUrl('a@b.com', 'pw', '') == null);
  assert(composeSmtpUrl('abc', 'pw', 'h:465') == null);
  assert(composeSmtpUrl('@b.com', 'pw', 'h:465') == null);
  assert(composeSmtpUrl('a@b.com', 'pw', 'mail.example.com:2525') ==
      'smtp://a%40b.com:pw@mail.example.com:2525');
  print('✓ compose-smtp-url (Dart): 10 מקרים — ירוק');
}
