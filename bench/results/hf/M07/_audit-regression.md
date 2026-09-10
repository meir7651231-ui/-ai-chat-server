# Audit Report: M07 (Sechirut) — State-Leakage & Regression

## Findings

**new/dart-data-bs/auto/gen_app_sechirut_scr5_content.dart:31** · Dashboard layout regression · P1 wrong result · Reorder dashboard rows: move new findings counter to separate row, keep payment sum on original third row

**new/dart-gen-bs/gen_app_sechirut_scr5.dart:23** · Same regression: c29 label changed from payment sum ("סכום") to findings counter ("לא"), moving sum to new row (c35). Visual hierarchy of dashboard altered—right side of row 3 now shows findings not-sent counter instead of payment total. Original layout: Row3=[Payment unpaid count | Payment sum]. New layout: Row3=[Payment unpaid count | Findings unsent count], Row4=[Payment sum | empty]. Breaks dashboard visual consistency.

## Coverage

✓ **Verified correct:**
- Generator parsed spec correctly: 7 dashboard counters (was 6) now reflected in content counts and hub screen (c17: "7 מדדים")
- Particle "לא נשלחו" correctly added to findings screen (px3): c31='לא נשלחו', c33='נשלח', c34='לא', counter expression 'מונה(נשלח=לא)' correct
- Counter logic sound: `appStore.records('app_sechirut_ent3').where((r) => (r[...field...] ?? '') == 'לא').length` is safe Dart (null-coalesced field access, count operation)
- No state-leakage: only sechirut app modified; other apps (schoolos, studio, etc.) untouched
- Police report confirms regen_ok, byte_identical_others, gates_pass ✓

✗ **Layout regression found:**
- Dashboard (scr5) third row RIGHT SIDE changed from payment sum display to findings unsent counter; sum moved to new fourth row
- Content constants shifted: c29 payload changed 'סכום'→'לא', indices after c31 incremented by 6 new constants
- Not checked: whether layout change matches intended dashboard design (may be deliberate, but alters visual hierarchy)

