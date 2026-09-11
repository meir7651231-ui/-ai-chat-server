# Opening Question (§ג.1 MASTER_PROTOCOL)

**Question:** 
The spec `panuy.txt` already defines `מרחק בקמ` (distance in km) computed as sqrt(squared-distance).
The task asks to:
1. Sort the list by distance (nearest first)
2. Show real distance in km

**Assumed Answer:**
- The list particle should sort its rows by the `מרחק בקמ` field in ascending order (nearest first)
- The particle should display `מרחק בקמ` (not `מרחק בריבוע`) to show real distance
- The generator will compile this to Flutter/Dart using the sort capability and field display in the particle definition

**Next Steps:**
1. Read SPEC-LANG.md to understand how to express sorting in the spec
2. Check if particle language supports sort directives
3. Modify panuy.txt spec if language allows it, or extend the engine if it doesn't
4. Generate and verify the app works correctly
5. Run police-bench.mjs to verify no breakage
