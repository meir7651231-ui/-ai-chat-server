// step faults on the JVM: the speech guard learns this phone's voice instead of guessing. Run through: node tools/kt-test.mjs
import il.liba.app.GuardCore

fun guardTests() {
    val g = GuardCore()
    ok(g.guardMs(100) == 16_000L, "guard: before three measured utterances - the old guess (4 s + 120 ms a character)")
    g.learn(3, 500); g.learn(100, 0); g.learn(100, 500_000)
    ok(g.samples == 0, "guard: too short, zero or absurd durations teach nothing")
    repeat(5) { g.learn(100, 6_000) }
    ok(Math.abs(g.msPerChar - 60.0) < 0.01 && g.guardMs(100) == 13_300L, "guard: 60 ms a character measured - 100 characters get 13.3 s, not 16: ${g.guardMs(100)}")
    ok(g.guardMs(1) == 4000L && g.guardMs(5000) == 90_000L, "guard: never under 4 s, never over 90 s")
    repeat(20) { g.learn(100, 12_000) }
    ok(g.msPerChar > 115 && g.guardMs(100) > 22_000L, "guard: a slower voice (rate changed) - the guard follows: ${g.guardMs(100)}")
}
