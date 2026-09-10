# Implementation Plan: Table Column Visibility

## Goal
Make the people table in panuy app show only 4 columns (שם, זמין, מרחק בקמ, מחיר לשעה) by extending the spec language to allow column filtering.

## Steps

### 1. Understand Current State (DONE)
- `particles.mjs` line 122: `[טבלה]` particle is parsed with no column specification
- `particles.mjs` line 386-387: Table wiring shows ALL entity.schema fields
- `panuy.txt` line 6: Defines `חלקיק אדם: [טבלה]` with no column filtering

### 2. Extend Regex in shapeOf() (particles.mjs line 122)
Change from:
```javascript
if ((m = e.match(new RegExp('^\\[' + alt(G.pTable) + '\\]')))) return { kind: 'table' };
```

To:
```javascript
if ((m = e.match(new RegExp('^\\[' + alt(G.pTable) + '\\](?:\\s*[::]\\s*(.+))?$')))) {
  const columnStr = m[2];
  const columns = columnStr ? columnStr.split(/[,،]/).map((x) => clean(x)).filter(Boolean) : null;
  return { kind: 'table', columns };
}
```

This allows:
- `[טבלה]` — all fields (columns = null)
- `[טבלה: שם, זמין, מרחק בקמ, מחיר לשעה]` — specific columns

### 3. Validate Column Names in shapeOf() 
After parsing columns, validate they exist in schema:
```javascript
if (columns) {
  for (const col of columns) {
    if (!F(col)) return { kind: null, why: `טבלה: שדה לא בסכמה: ${col}` };
  }
}
```

### 4. Filter Entity Schema in Table Wiring (particles.mjs line 386-387)
Change from showing all fields to showing only specified columns:

```javascript
} else if (s.kind === 'table') {
  // Filter schema to only selected columns (if specified)
  const selectedSchema = s.columns 
    ? entity.schema.filter((f) => s.columns.includes(f.label))
    : entity.schema;
  
  const labels = selectedSchema.map((f) => k(f.label));
  const rows = `[for (final r in ${recs}) [${selectedSchema.map((f) => strOf(f.label)).join(', ')}]]`;
  const w = firstWired(kd[0][1], { labels, rows, label: lbl }); 
  if (!w) { notes.push(`⚪ ${p.name}: אין אטום-טבלה מתחווט`); continue; }
  widgets.push(`AnimatedBuilder(animation: appStore, builder: (context, _) => ${w.call})`); 
  p.wired = [w.cand]; 
  continue;
}
```

### 5. Preserve Column Order
The columns list order should be preserved in the output (use the order specified, not the order in schema).

### 6. Update panuy.txt Spec
Change line 6 from:
```
חלקיק אדם: [טבלה]
```

To:
```
חלקיק אדם: [טבלה: שם, זמין, מרחק בקמ, מחיר לשעה]
```

### 7. Test
Run: `node police-bench.mjs --root . --task H13 --claims ./claims.json`

Verify:
- No parse errors in particles
- Table shows only 4 columns in correct order
- No other tables affected
- Backward compatibility: tables without column spec still show all fields

## Files to Modify
1. `machtzev/generator/particles.mjs` — line 122 (regex) + lines 386-387 (wiring)
2. `machtzev/generator/specs-ds/panuy.txt` — line 6 (spec)

## Verification Checklist
- [ ] Regex matches new column syntax
- [ ] Column names validated against schema
- [ ] selectedSchema preserves order
- [ ] labels and rows use selectedSchema
- [ ] panuy.txt updated with 4 columns in correct order
- [ ] No byte edits in generated code
- [ ] Police report passes all gates
