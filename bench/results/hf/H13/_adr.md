# ADR: Table Column Visibility Task (H13)

## ג.1 Opening Question (MASTER_PROTOCOL)

**Q: How should the spec language allow specifying which columns a table displays?**

Current spec syntax (panuy.txt line 6):
```
חלקיק אדם: [טבלה]
```

This shows ALL fields from the entity schema.

### Assumed Answer:
Extend the table particle syntax to accept optional column list:
- `[טבלה]` — show all fields (backward compatible, current behavior)
- `[טבלה: שם, זמין, מרחק בקמ, מחיר לשעה]` — show only listed columns in that order

**Rationale:**
1. Minimal spec language change (field names separated by comma)
2. Backward compatible (empty list = all fields)
3. Order-preserving (list order = display order)
4. Column names match field labels from entity schema

**Verification:**
- Parse new syntax in particles.mjs
- Filter entity.schema to only selected columns
- Preserve original behavior when no columns specified
- Test with panuy.txt showing 4 columns

---

## ג.2 Decomposition (10 steps)

1. **Understand current spec language** — read particles.mjs parser for table kind
2. **Extend parser regex** — add optional `(<column list>)` to table syntax
3. **Extract column filter logic** — parse comma-separated field names  
4. **Update table wiring** — filter entity.schema based on selected columns
5. **Validate column names** — check each name exists in schema
6. **Update panuy.txt** — change table particle to specify 4 columns
7. **Search for atoms** — verify table atoms accept filtered schema
8. **Compose rendering** — ensure labels & rows match filtered columns
9. **Run machine test** — verify with police-bench
10. **Document in LEARNINGS** — record findings

---

## Decision & Rationale

**Layer:** spec language (particles.mjs parser) + wiring (labels/rows generation)

**Why not other layers:**
- Generated code (new/) ❌ must not hand-edit
- Core generator ❌ complex for this task
- Spec .txt ✅ right layer — declares intent

**Verification method:** 
- Machine report: `node police-bench.mjs --root . --task H13 --claims ./claims.json`
- Check: panuy app renders person table with exactly 4 columns

---

## Implementation Complete ✅

### Changes Made

**1. Extended table particle regex** (particles.mjs line 122)
- From: `^\\[` + alt(G.pTable) + `\\]`
- To: `^\\[` + alt(G.pTable) + `\\s*(?::\\s*([^\\]]+))?\\]$`
- Captures optional column list inside brackets

**2. Added column parsing & validation** (particles.mjs lines 123-131)
- Parse comma-separated column names
- Validate each against schema (F(col))
- Return shape with columns array (or null if not specified)

**3. Updated table wiring** (particles.mjs lines 395-401)
- Filter entity.schema based on s.columns (if specified)
- selectedSchema preserves column order from spec
- Backward compatible: null columns → show all fields

**4. Updated panuy spec** (panuy.txt line 6)
- From: `חלקיק אדם: [טבלה]`
- To: `חלקיק אדם: [טבלה: שם, זמין, מרחק בקמ, מחיר לשעה]`

### Verification

Machine report signature: bb8a15893e9432c2

| Check | Result | Claim |
|---|---|---|
| four_columns | ✅ columns=4 | CONFIRMED |
| has_km | ✅ 3× | CONFIRMED |
| gates_pass | ✅ | CONFIRMED |
| regen_ok | ✅ | CONFIRMED |
| byte_identical_others | ✅ | CONFIRMED |
| no_hebrew_in_engine | ✅ | CONFIRMED |

**VERDICT: DONE** — All surface requirements met, all gates green, all claims confirmed.

---

## Status: COMPLETE ✅
