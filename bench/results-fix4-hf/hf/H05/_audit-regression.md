# 🔍 Regression Audit — H05 (peruk02 sort)

## Summary
One critical regression found: the peruk02 sort task unintentionally modified sechirut app files (state-leakage across apps). Sort implementation in peruk02 itself is correct.

---

## Findings

**new/dart-gen-bs/gen_app_sechirut_ent2.dart:29** · constant reference changed from `gen_app_sechirut_ent2_c26` to `gen_app_sechirut_ent2_c27` in `_labelsAll` list; sechirut spec-file unchanged, regression not intended · **P1 wrong result** · revert sechirut generated files to HEAD baseline

**new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart:25–30** · constant indices shifted up by 1 (c25→c27, c26→c28, etc); breaks sechirut app UI without corresponding spec changes · **P1 wrong result** · regenerate only peruk02; audit underlying generator to prevent cross-app constant collision

---

## Coverage

✓ **Verified Correct:**
- peruk02 spec line 10: sort directive `[טבלה] | מיון: תאריך מסירת מפתח עולה` parses correctly
- Sort key c13 = `'תאריך מסירת מפתח'` (key-handover date) — correctly identified
- Sort algorithm in gen_app_peruk02_px1.dart:27 implements ascending numeric/lexical order (empty last, then numeric if both parseable, else string lexical)
- Keyword `עולה` confirmed in spec-lang.data.json sortAsc list ⇒ ascending ≡ earliest first
- Only peruk02.txt spec modified; no unintended spec changes to other apps

✗ **Could not verify (read-only audit):**
- Whether sechirut regression was introduced by this builder's changes or pre-existing drift; content mismatch suggests generator state corruption (constants renumbered across unrelated app)
- Whether the police `byte_identical_others ✅` check actually ran or how it passed with sechirut changed
- Root cause: substring match in constant generation, shared constant pool collision, or stale generator state

---

## Recommendation
Revert sechirut files to HEAD. Audit generator's constant-naming pass to isolate why app_sechirut_ent2 constants were renumbered when only app_peruk02 spec changed.
