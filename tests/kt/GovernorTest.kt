// step duty-governor on the JVM: the gear from the state, down at once, up after the dwell and the gap, never flapping.
// Run through: node tools/kt-test.mjs
import il.liba.app.power.*

fun governorTests() {
    val t = 1_790_000_000_000L; val min = 60_000L
    fun st(p: Double?, bat: Int = 60, ch: Boolean = false, scr: Boolean = true, idle: Boolean = false, temp: Double? = null) = PowerState(p, 6.0, bat, ch, scr, idle, temp)
    ok(GovernorCore.choose(st(4.0), Tier.FULL, t, t).first == Tier.FULL, "governor: under the budget - full")
    ok(GovernorCore.choose(st(7.0), Tier.FULL, t, t + 1000).first == Tier.ECO, "governor: over the budget - down to eco at once")
    ok(GovernorCore.choose(st(10.0), Tier.ECO, t, t + 1000).first == Tier.SURVIVAL, "governor: far over - survival")
    ok(GovernorCore.choose(st(3.0), Tier.ECO, t, t + 5 * min).first == Tier.ECO, "governor: back under, but only five minutes in the gear - stays")
    ok(GovernorCore.choose(st(5.0), Tier.ECO, t, t + 11 * min).first == Tier.ECO, "governor: ten minutes, but 5 of 6 is inside the gap - stays (no flapping)")
    ok(GovernorCore.choose(st(3.0), Tier.ECO, t, t + 11 * min).first == Tier.FULL, "governor: ten minutes and well under - back to full")
    ok(GovernorCore.choose(st(20.0, ch = true), Tier.SURVIVAL, t, t + min).first == Tier.FULL, "governor: charging - full at once")
    ok(GovernorCore.choose(st(null, bat = 4), Tier.FULL, t, t).first == Tier.COLD && GovernorCore.choose(st(null, bat = 12), Tier.FULL, t, t).first == Tier.SURVIVAL, "governor: battery 4% cold, 12% survival")
    ok(GovernorCore.choose(st(null, scr = false, idle = true), Tier.FULL, t, t).first == Tier.ECO && GovernorCore.choose(st(null, temp = 46.0), Tier.FULL, t, t).first == Tier.SURVIVAL, "governor: phone idle - eco; hot - survival")
    ok(GovernorCore.admit(Tier.ECO, Job("update", 0)) == false && GovernorCore.admit(Tier.ECO, Job("peek", 1)) && !GovernorCore.admit(Tier.COLD, Job("say", 2)) && GovernorCore.admit(Tier.COLD, Job("urgent", 3)), "governor: admission by importance")
    ok(GovernorCore.words(Tier.FULL, Tier.ECO, "אני שורפת מעל התקציב") == "עברתי להילוך חסכוני, כי אני שורפת מעל התקציב. עדיין שומעת אותך, רק בהפסקות קצרות.", "governor: one sentence on the change")
    ok(Math.abs(GovernorCore.missEstimate(Tier.ECO, 0.1) - 0.07) < 1e-9 && GovernorCore.missEstimate(Tier.FULL, 0.1) == 0.0, "governor: the missed-words estimate")
}
