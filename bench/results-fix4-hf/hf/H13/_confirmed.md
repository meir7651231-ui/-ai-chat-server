# Validator Report — Task H13 (panuy)

## Findings (ranked by severity)

**px1-column-order** · CONFIRMED · gen_app_panuy_px1_content.dart:3-6 const c3='מחיר לשעה', c4='מרחק בקמ' (should be c3='מרחק בקמ', c4='מחיר לשעה' per spec:panuy.txt:6 `[טבלה] שם, זמין, מרחק בקמ, מחיר לשעה`) · Root cause: particles.mjs:403 `entity.schema.filter((f) => s.columns.includes(f.label))` preserves schema order instead of spec order; fix: replace with `s.columns.map(col => entity.schema.find(f => f.label === col)).filter(Boolean)`

**ent1-all-columns** · FALSE-POSITIVE · gen_app_panuy_ent1.dart:187 ForgeDataGrid has all 14 schema columns; spec line 6 declares only a particle table (px1), not the entity list (ent1); entity list showing all fields is correct per spec; audit confuses particle column limit with entity-wide column visibility — they are independent concerns

## Final Sweep

Police report verifies column COUNT (4) but not ORDER. Particle px1 is correctly embedded in px1.dart line 34 with 4 columns, but the constants c3/c4 are swapped, so UI displays wrong column order. Audit-regression and audit-coverage both identify the same root cause: particles.mjs uses filter instead of map.

---

FIX-LIST: px1-column-order
