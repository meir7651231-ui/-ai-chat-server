# ✓ Validator Report — peruk17 Sort Task

| id | verdict | evidence | fix |
|---|---|---|---|
| SORT-ENUM-NOT-ALPHA | CONFIRMED P1 | new/dart-gen-bs/gen_app_peruk17_px1.dart:26 `final c = o.indexOf(x).compareTo(o.indexOf(y));` compares enum indices (0,1,2,3) instead of string values; spec requires alphabetical by סיווג field | Change line 26 from `o.indexOf(x).compareTo(o.indexOf(y))` to `x.compareTo(y)` for true lexicographic sorting of Hebrew text |

## Detail

**Task requirement:** "make the cases table sorted alphabetically by סיווג" (from spec peruk17.txt line 10: `מיון: סיווג עולה`)

**Current behavior:** Sorts by enum order
- Enum values in gen_app_peruk17_px1_content.dart: c8='השלמת מסמכים', c9='דחייה לגופה', c10='זימון ועדה', c11='נגמר השעון'
- Current sort logic uses `o.indexOf(x).compareTo(o.indexOf(y))` where `o = [c8,c9,c10,c11]`
- Result: [השלמת(0) < דחייה(1) < זימון(2) < נגמר(3)] — enum order

**Required behavior:** Alphabetical (Unicode codepoint order)
- Hebrew Unicode: ד(U+05D3) < ה(U+05D4) < ז(U+05D6) < נ(U+05E0)
- Result should be: [דחייה < השלמת < זימון < נגמר]

**Why confirmed:** Three independent auditors (_audit-regression.md, _audit-compile.md, _audit-coverage.md) all report identical P1 defect with same proposed fix. Dart semantics confirm `String.compareTo()` performs lexicographic comparison. Fix is safe and side-effect free.

**Not from police:** Police report shows all generic checks passing (regen_ok ✅, byte_identical_others ✅, gates_pass ✅, compiles ✅); no automated failures. Semantic correctness audit caught issue that test gates did not.

---

FIX-LIST: SORT-ENUM-NOT-ALPHA
