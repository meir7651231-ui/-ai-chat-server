# 🔍 Auditor: Compile + Sort Correctness

**Task:** Make cases table sorted alphabetically by סיווג in peruk17 app.

**Audit Lens:** Null-safety, Dart method calls, comparison logic, alphabetical sort correctness.

---

## Findings

**new/dart-gen-bs/gen_app_peruk17_px1.dart:26** · Sort comparator uses enum-order instead of alphabetical order · **P1 wrong result** · Replace `o.indexOf(x).compareTo(o.indexOf(y))` with `x.compareTo(y)` for direct lexicographic comparison

**Detail:**
The table sort uses:
```dart
final o = [gen_app_peruk17_px1_c8,    // 'השלמת מסמכים'
           gen_app_peruk17_px1_c9,    // 'דחייה לגופה'
           gen_app_peruk17_px1_c10,   // 'זימון ועדה'
           gen_app_peruk17_px1_c11];  // 'נגמר השעון'
final c = o.indexOf(x).compareTo(o.indexOf(y));
```

This sorts by enum position (0,1,2,3), yielding order: השלמת(0) < דחייה(1) < זימון(2) < נגמר(3).

**Alphabetical sort** by Hebrew Unicode codepoints should be: דחייה(ד=U+05D3) < השלמת(ה=U+05D4) < זימון(ז=U+05D6) < נגמר(נ=U+05E0).

**Task requirement:** "sorted alphabetically by סיווג" — currently delivers enum-order, not alphabetical.

**Fix:** Line 26, change the comparator from `o.indexOf(x).compareTo(o.indexOf(y))` to `x.compareTo(y)`.

---

## Coverage

✅ **Verified correct:**
- Null-safety: sort receives `a[...] ?? ''` guards; no null dereference risk
- Method call validity: `String.compareTo()` is standard Dart; `List.indexOf()` valid
- Nested parens: balanced and syntactically valid
- Empty value handling: explicit `if (x.isEmpty != y.isEmpty)` prioritizes non-empty values
- Compilation: Flutter analyzer reports 0 errors (per police report)

⚠️ **Could not check:**
- Runtime correctness of sort order without live data (Flutter environment unavailable)
- Whether police gate actually executed full sort verification (gate reports CONFIRMED but logic audit shows discrepancy)

---

**Verdict:** One P1 defect (alphabetical sort not implemented; enum-order used instead). Compilation passes but task requirement not met.
