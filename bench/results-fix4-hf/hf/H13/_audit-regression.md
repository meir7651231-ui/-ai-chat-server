# Audit Report: Table Column Order Regression (Task H13)

## Finding

**machtzev/generator/particles.mjs:403** · Table columns rendered in schema order, not spec-declared order · **P1 wrong result** · Fix: Sort filtered columns by spec order

### Detailed Description

The task requires the table to show exactly four columns **in this order**: שם, זמין, מרחק בקמ, מחיר לשעה

**Generated output (WRONG):**
- c1 = 'שם' (1st column, correct)
- c2 = 'זמין' (2nd column, correct)
- c3 = 'מחיר לשעה' (3rd column, WRONG — should be מרחק בקמ)
- c4 = 'מרחק בקמ' (4th column, WRONG — should be מחיר לשעה)

**Root cause:** Line 403 in particles.mjs uses `filter()` to select columns, which returns them in schema order (where מחיר לשעה appears at position 7 and מרחק בקמ at position 12), not in the order specified in the spec declaration:

```javascript
const cols = s.columns ? entity.schema.filter((f) => s.columns.includes(f.label)) : entity.schema;
```

This preserves the order from `entity.schema`, which has מחיר לשעה before מרחק בקמ, ignoring the spec's declared order: `[טבלה] שם, זמין, מרחק בקמ, מחיר לשעה`

**Evidence:** 
- Spec (line 6 of panuy.txt): `חלקיק אדם: [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה`
- Entity schema order (panuy.txt, line 4): `מחיר לשעה` at position 7, `מרחק בקמ` at position 12
- Generated content (gen_app_panuy_px1_content.dart, lines 3-6): c1='שם', c2='זמין', c3='מחיר לשעה', c4='מרחק בקמ'
- Generated UI (gen_app_panuy_px1.dart, line 34): uses c1,c2,c3,c4 mapped to c5,c6,c7,c8 which are: שם, זמין, מחיר לשעה, מרחק בקמ

**The fix:** Replace the `filter()` approach with mapping in declaration order:
```javascript
const cols = s.columns ? s.columns.map(col => entity.schema.find(f => f.label === col)).filter(Boolean) : entity.schema;
```

This preserves the order declared in the spec instead of falling back to schema order.

---

## Coverage

**Verified:**
- ✅ Spec file correctly declares 4-column table with specific order
- ✅ Police report confirms `four_columns = 4` (correct count)
- ✅ Table particle correctly parsed from spec (shapeOf function, particles.mjs:124-138)
- ✅ No regression in other files (byte_identical_others = ✅)
- ✅ No handwritten edits to generated files
- ✅ Engine runs without error (regen_ok = ✅)

**Could not verify:**
- Frontend rendering in browser (Flutter/Dart not installed per audit constraints)
- Whether other table particles in other apps are similarly affected

---

**Task Status:** INCOMPLETE — Column order requirement not met
