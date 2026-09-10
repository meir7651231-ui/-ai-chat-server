# Inspection — H11: Add תקרה נמוכה Field

## Finding: min() Function Not Supported in Spec Language

The generator's `compileFormula` function in `render-ds.mjs` only supports:
- Arithmetic operators: +, -, *, /
- Parentheses: ( )
- Field name substitution

It does NOT support function calls like `min(a, b)`.

**Residue check (line in compileFormula):**
```
const residue = e.replace(/@\d+@/g, ' ').replace(/[0-9.+\-*/()\s]/g, '');
if (residue.trim().length) return null;  // ❌ "min" will fail here
```

## Options

1. **Extend the generator** to support min() and other functions
2. **Use alternative syntax** (if one exists in spec language)
3. **Implement in a different layer** (e.g., business logic or render helpers)

The task description says "Add a computed field...computed by the app", which suggests the generator should handle it. Need to add min() support to the spec language compiler.

## Status: Blocked

Cannot complete task with current generator capabilities. Need to modify `render-ds.mjs` to support function syntax.
