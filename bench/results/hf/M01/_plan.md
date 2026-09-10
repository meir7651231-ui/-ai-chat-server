# Plan: Add Payment Entity to peruk02.txt

**Goal:** Add `תשלום` (payment) entity with 3 fields (תיק link, סכום amount, שולם paid yes/no), cascade delete on case deletion, and table screen.

## 10-Step Decomposition

1. **Read peruk02.txt** - understand current structure (2 entities: תיק, ממצא)
2. **Search for similar patterns** - check how finding entity is defined (cascade, particles)
3. **Define payment entity** - line 7b, with required fields and cascade rule
4. **Add particles for payment** - table, empty state, action button (following finding pattern)
5. **Add particles for case** - link to payments table in case detail screen
6. **Verify spec syntax** - ensure field names, types, and cascade match spec language
7. **Register any new gates** - if new validation rules needed (likely no, reuse existing)
8. **Run search-record** - check for existing similar entities (duplicate detection)
9. **Run generator** - execute `node machtzev/generator/app-ds.mjs` to emit code
10. **Verify machine report** - run police-bench with claims.json and confirm DONE

## Fix Layers
- Spec layer: peruk02.txt (the source of truth)
- Generated outputs: new/dart-gen-bs, new/dart-data-bs (never touch these)
