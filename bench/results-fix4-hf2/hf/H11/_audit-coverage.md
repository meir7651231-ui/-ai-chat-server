# Audit Coverage: sechirut min() Field

## Finding

**new/dart-gen-bs/gen_app_sechirut_ent1.dart:54** · When saving a new record (not editing), indices `_v[10]` and `_v[11]` are empty strings (never set), so `min((num.tryParse(_v[10] ?? '') ?? 0), (num.tryParse(_v[11] ?? '') ?? 0))` computes to `min(0, 0) = 0`, storing תקרה נמוכה as `0.00` instead of the correct min of the two computed ceilings · **P1 wrong result (new records broken)** · Use the computed values directly: `(min((num.tryParse(_v[3] ?? '') ?? 0) * 3, (num.tryParse(_v[3] ?? '') ?? 0) * (num.tryParse(_v[4] ?? '') ?? 0) / 3)).toStringAsFixed(2)` — or extract the pre-computed c27/c28 strings from the save map.

---

## Coverage Checked

✅ **Entity form (ent1 screen)**: Field c29 (תקרה נמוכה) present in form labels (line 33), displayed with `_calc()` widget (line 208) showing min() result.

✅ **Particle table (px1)**: Table includes c19 (header) and c32 (data) for תקרה נמוכה columns (px1.dart line 34, px1_content.dart c19=שם c32=מפתח).

✅ **Entity list card view**: Field renders in card display (line 105-108 includes c29 in labels and values arrays).

✅ **CSV export**: Field included in export (line 120-124 _csv() method includes c29).

✅ **Database storage**: Field saved to map on save() (line 54) and loaded on edit() (line 66).

✅ **Calculation widget display**: Pre-save calculation preview shows on form (line 208) with correct min() formula structure.

✅ **Compilation**: dart:math imported (line 11), min() function available.

⚠️ **Defect**: New-record path breaks — indices _v[10], _v[11] empty on insert (only populated from DB on edit).
