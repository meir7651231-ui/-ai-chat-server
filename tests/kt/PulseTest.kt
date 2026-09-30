import il.liba.app.power.PulseCore

fun pulseTests() {
    val p = PulseCore(); p.every("watchdog", 30_000, stretch = false); p.every("update", 3 * 3600_000L, now = 0L); p.every("peek", 9_000)
    ok(p.due(9_000) == listOf("peek"), "pulse: at 9s only peek is due")
    ok(p.due(30_000).containsAll(listOf("watchdog", "peek")) && !p.due(30_001).contains("watchdog"), "pulse: the watchdog at 30s, once")
    ok(p.due(3 * 3600_000L).contains("update"), "pulse: the update check every 3 hours")
    val q = PulseCore(); q.every("peek", 9_000); q.every("watchdog", 30_000, stretch = false)
    ok(q.due(20_000, stretchK = 3.0) == emptyList<String>() && q.due(30_000, stretchK = 3.0).containsAll(listOf("peek", "watchdog")), "pulse: a slow gear stretches peek to 27s, the watchdog stays 30s")
    val r = PulseCore(); r.every("holy", 30_000); r.enable("holy", false)
    ok(r.due(60_000).isEmpty(), "pulse: a disabled row does not run"); r.enable("holy", true); ok(r.due(60_000) == listOf("holy"), "pulse: enabled again, it runs")
    val s = PulseCore(); s.every("update", 3600_000L); s.touch("update", 3000_000L)
    ok(s.due(3600_000L).isEmpty() && s.due(6600_000L) == listOf("update"), "pulse: touch() moves the next run")
}
