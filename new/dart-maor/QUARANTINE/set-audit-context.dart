// ⚛️ אטום-Dart (דרגת-חוזה) · setAuditContext — בניית הקשר-הלוג-המסונכרן
// מוצא: maor/src/lib/cloud.ts:138-143 (setAuditContext; חוק-4 — התנהגות זהה למקור-ה-JS).
//        המקור: new/atoms/set-audit-context.mjs —
//        `return { auditUid: uid, auditEmail: email.trim().toLowerCase(), auditReadable: canRead };`
// טוהר: פונקציות top-level עצמאיות, אפס import (רק שפה/סטנדרט); עוזרים מקומיים בקידומת _.
//
// תפקיד: הקשר auditlog/{uid} של המחובר — uid כמות-שהוא · מייל מנורמל (trim+lowercase,
//        כהשוואת-המיילים ב-Rules) · canRead (מנהל/מייל-על ⇒ true; עובד/ת ⇒ false).
//        במקור הושם לשלושה משתני-מודול — ההשמה היא חיווט-קופסה; האטום רק מחשב.
// קלט:  uid (String) · email (String) · canRead (bool) — dynamic כמו ה-JS.
// פלט:  Map חדש {auditUid, auditEmail, auditReadable} — הפניה טרייה בכל קריאה.
//
// הערות-המרה (מקור→Dart), אומתו בהרצה-דיפרנציאלית Node מול Dart-VM:
// • trim (סטייה שנתפסה): ‏Dart trim() מקרצף גם U+0085 (NEL); ‏JS TrimString לא
//   (NEL אינו WhiteSpace/LineTerminator של ES). ⇒ ‏_jsTrim עם קבוצת-התווים
//   המדויקת של ES: ‏09–0D · 20 · A0 · 1680 · 2000–200A · 2028 · 2029 · 202F ·
//   205F · 3000 · FEFF. ‏(U+180E — שניהם לא מקרצפים; זהה.)
// • toLowerCase (כלל-13 — מיפוי-מלא של JS מול הפשוט של Dart, שתי סטיות שנתפסו):
//   ‏(א) ‏U+0130 "İ" ⇒ ‏JS "i̇" (שתי יחידות) מול Dart "i" — טבלת-חריגים.
//   ‏(ב) ‏Final_Sigma: ‏"ΑΣ" ⇒ ‏JS "ας" (‏U+03C2 סופית) מול Dart "ασ" — ‏Dart מיישם
//   מיפוי-פשוט חסר-הקשר. ⇒ ‏_jsLower רץ פר-rune: ‏Σ ⇒ ς כשלפניו אות-בעלת-רישיות
//   (בדילוג על תווים מתעלמי-רישיות) ואחריו אין כזו — כתנאי Final_Sigma של Unicode;
//   cased ≈ תו שמשתנה תחת lower/upper, ‏Case_Ignorable ≈ הבלוקים המקובלים
//   (סימנים-משלבים, ‏Lm/Sk, ‏Cf, ‏MidLetter ' . :) — קירוב שאומת מול V8 על
//   ΑΣ@Β.Γ / Σ בודדת / Α+0301+Σ / ΑΣ+0301+Β (ארבעתם ביט-זהים).
// • קלט לא-מחרוזת: ‏JS זורק TypeError על email.trim ⇒ ‏Dart זורק TypeError בהורדת-
//   הטיפוס — שקילות-זריקה.

/// JS-faithful trim: exactly the ES TrimString character set (WhiteSpace +
/// LineTerminator). Notably does NOT strip U+0085 (NEL), unlike Dart's trim().
bool _jsWhitespace(int u) =>
    (u >= 0x09 && u <= 0x0D) ||
    u == 0x20 ||
    u == 0xA0 ||
    u == 0x1680 ||
    (u >= 0x2000 && u <= 0x200A) ||
    u == 0x2028 ||
    u == 0x2029 ||
    u == 0x202F ||
    u == 0x205F ||
    u == 0x3000 ||
    u == 0xFEFF;

String _jsTrim(String s) {
  var start = 0;
  var end = s.length;
  while (start < end && _jsWhitespace(s.codeUnitAt(start))) {
    start++;
  }
  while (end > start && _jsWhitespace(s.codeUnitAt(end - 1))) {
    end--;
  }
  return s.substring(start, end);
}

/// Cased-letter approximation (UAX §3.13): a rune that changes under either
/// case conversion. Verified against V8 on the contract's differential probes.
bool _cased(int r) {
  final c = String.fromCharCode(r);
  return c.toLowerCase() != c || c.toUpperCase() != c;
}

/// Case_Ignorable approximation — the common blocks: combining marks,
/// modifier letters/symbols (Lm/Sk incl. Greek diacritics), format controls
/// (Cf), and the MidLetter/Single_Quote word-break set (' . : etc.).
bool _caseIgnorable(int r) =>
    r == 0x27 || // '
    r == 0x2E || // .
    r == 0x3A || // :
    r == 0x5E || // ^
    r == 0x60 || // `
    r == 0xA8 ||
    r == 0xAD || // soft hyphen (Cf)
    r == 0xAF ||
    r == 0xB4 ||
    r == 0xB7 || // middle dot (MidLetter)
    r == 0xB8 ||
    (r >= 0x2B0 && r <= 0x2FF) || // Lm/Sk modifiers
    (r >= 0x300 && r <= 0x36F) || // combining diacritical marks
    r == 0x374 ||
    r == 0x375 ||
    r == 0x37A ||
    r == 0x384 ||
    r == 0x385 ||
    r == 0x387 || // Greek ano teleia (MidLetter)
    (r >= 0x483 && r <= 0x489) ||
    (r >= 0x591 && r <= 0x5C7) || // Hebrew points/accents
    r == 0x5F4 || // Hebrew gershayim ״ (MidLetter)
    (r >= 0x610 && r <= 0x61A) ||
    (r >= 0x64B && r <= 0x65F) ||
    r == 0x670 ||
    (r >= 0x6D6 && r <= 0x6DC) ||
    (r >= 0x6DF && r <= 0x6E8) ||
    (r >= 0x1AB0 && r <= 0x1AFF) ||
    (r >= 0x1DC0 && r <= 0x1DFF) ||
    (r >= 0x200B && r <= 0x200F) || // ZW*/direction marks (Cf)
    r == 0x2018 ||
    r == 0x2019 || // curly single quotes (Single_Quote)
    r == 0x2024 ||
    r == 0x2027 ||
    (r >= 0x202A && r <= 0x202E) ||
    (r >= 0x2060 && r <= 0x2064) ||
    (r >= 0x20D0 && r <= 0x20FF) || // combining marks for symbols
    (r >= 0xFE00 && r <= 0xFE0F) || // variation selectors
    (r >= 0xFE20 && r <= 0xFE2F) || // combining half marks
    r == 0xFE52 ||
    r == 0xFE55 ||
    r == 0xFEFF ||
    r == 0xFF07 ||
    r == 0xFF0E ||
    r == 0xFF1A;

/// Unicode Final_Sigma condition for the sigma at index [i] of [runes]:
/// preceded (skipping case-ignorables) by a cased letter, and NOT followed
/// (skipping case-ignorables) by a cased letter.
bool _finalSigma(List<int> runes, int i) {
  var before = false;
  for (var j = i - 1; j >= 0; j--) {
    if (_caseIgnorable(runes[j])) continue;
    before = _cased(runes[j]);
    break;
  }
  if (!before) return false;
  for (var j = i + 1; j < runes.length; j++) {
    if (_caseIgnorable(runes[j])) continue;
    return !_cased(runes[j]);
  }
  return true;
}

/// JS-faithful toLowerCase (full Unicode default case conversion):
/// U+0130 "İ" -> "i̇" (rule 13) and Final_Sigma Σ -> ς; everything else
/// delegates to Dart's simple mapping (identical to JS outside those two).
String _jsLower(String s) {
  final runes = s.runes.toList();
  final out = StringBuffer();
  for (var i = 0; i < runes.length; i++) {
    final r = runes[i];
    if (r == 0x130) {
      out.write('i̇');
    } else if (r == 0x3A3) {
      out.write(_finalSigma(runes, i) ? 'ς' : 'σ');
    } else {
      out.write(String.fromCharCode(r).toLowerCase());
    }
  }
  return out.toString();
}

/// Builds the synced-audit-log context of the signed-in user. Verbatim
/// behaviour of the JS source new/atoms/set-audit-context.mjs:
/// uid passes through untouched, email is normalised (JS trim + JS
/// toLowerCase), canRead passes through. Returns a fresh Map every call —
/// no shared state (the module-variable assignment stayed in the box).
dynamic setAuditContext(dynamic uid, dynamic email, dynamic canRead) {
  return {
    'auditUid': uid,
    'auditEmail': _jsLower(_jsTrim(email as String)),
    'auditReadable': canRead,
  };
}
