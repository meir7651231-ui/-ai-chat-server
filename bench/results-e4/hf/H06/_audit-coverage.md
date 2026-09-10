# 🔍 Audit Coverage — Task H06 (peruk12 price sort)

## Findings
No findings. All checks pass.

## Coverage
**Verified correct:**
- new/dart-gen-bs/gen_app_peruk12_px1.dart:25 · Table particle sorts תיק records by מחיר field with numeric comparison: field=gen_app_peruk12_px1_c7='מחיר'; sort uses `num.tryParse(x)` + `nx.compareTo(ny)` for numeric values, falls back to `x.compareTo(y)` for text; empty values handled (pushed to end via `x.isEmpty ? 1 : -1`); ascending order (cheapest first) via compareTo semantics
- new/dart-data-bs/auto/gen_app_peruk12_px1_content.dart:9 · Constants correctly map: c7='מחיר' (sort field), c4='מחיר' (column header), c11='מחיר' (data cell)
- new/dart-gen-bs/gen_app_peruk12_home.dart · Home screen sorts by date (a.due.compareTo), not price — no regression
- Spec source: machtzev/generator/specs-ds/peruk12.txt:10 correctly updated to `[טבלה] | מיון: מחיר מהנמוך`
- Machine police report: sort ✅ px1, numeric ✅ 2×, compile ✅, gates ✅ — task DONE verified
- No other screens (entity ent1, report rp1, hub, root, home) display the price-sorted table — only px1 particle screen shows it
