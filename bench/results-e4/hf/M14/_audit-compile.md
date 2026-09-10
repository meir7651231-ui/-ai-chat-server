# Audit: panuy.txt stages addition

## Findings

**new/dart-gen-bs/gen_app_panuy_ent1.dart:92** · Stage array access lacks bounds checking; `appStore.stageOf('app_panuy_ent1', rid)` used directly as array index without `.clamp(0, 2)`. Inconsistent with line 189 of same file (`kF(r).clamp(0, kS.length - 1) == c`) and pattern in other apps (e.g. gen_app_calendar_root.dart line uses `.clamp(0, 1)`). Potential RangeError at runtime if stageOf returns out-of-bounds value. · **P1** · Use: `stage: (const [gen_app_panuy_ent1_c32, gen_app_panuy_ent1_c33, gen_app_panuy_ent1_c34])[appStore.stageOf('app_panuy_ent1', rid).clamp(0, 2)]`

## Coverage

**✅ Verified correct:**
- Stages defined in spec file (line 4): שלבים: פנוי, הוזמן, בוצע — syntax valid
- Stage constants properly generated in content file (c32=פנוי, c33=הוזמן, c34=בוצע)
- Stage initialized on record creation (line 55): `'__stage': '0'`
- Stage displayed in subtitle (line 3): "14 שדות · 3 שלבים"
- DsWorkflow widget rendered with correct 3 stages (line 158)
- Kanban board view (line 189) shows stages with proper `.clamp(0, 2)` bounds checking
- stageDone comparison correct (line 92: `>= 2` for 3-stage array, indices 0-2)
- onAdvance callback set to correct max (line 92: `appStore.advance(..., rid, 3)`)
- Computed fields (sqrt, boqLineAmount) in form rendering use safe null coalescing and math functions
- Police report confirms: regen_ok ✅, compiles ✅ (0 errors), s1 ✅ (stage syntax), s2 ✅ (data intact)

**Could not verify (requires runtime/appStore internals):**
- Whether appStore.stageOf() return contract guarantees bounds [0, N-1] — if not, line 92 is unsafe crash vector

