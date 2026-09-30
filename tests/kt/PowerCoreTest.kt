// step power-ledger on the JVM: each subsystem charged by how long it ran times its rate; the projection from the last
// hour; the phone's counters read right whatever unit the phone uses. Run through: node tools/kt-test.mjs
import il.liba.app.power.PowerCore

fun powerTests() {
    val t0 = 1_790_000_000_000L; val min = 60_000L
    val m = PowerCore.Meter("2026-09-30")
    m.set("base", true, t0); m.set("mic.vad", true, t0)
    m.set("tts", true, t0 + 10 * min); m.set("tts", true, t0 + 11 * min); m.set("tts", false, t0 + 16 * min)   // the same call twice: harmless
    m.set("asr.cloud", false, t0 + 20 * min)                                                                    // off without on: nothing
    val r = PowerCore.report(m, 4000.0, t0 + 60 * min)
    val by = r.byTag.toMap()
    ok(Math.abs(by["mic.vad"]!! - 8.0) < 0.01 && Math.abs(by["tts"]!! - 40.0 * 6 / 60) < 0.01 && Math.abs(by["base"]!! - 0.5) < 0.01 && by["asr.cloud"] == null,
        "power: an hour of listening, six minutes of speech - each charged by its own time: ${r.byTag}")
    ok(r.byTag.first().first == "mic.vad" && Math.abs(r.mah - 12.5) < 0.02 && Math.abs(r.pct - 0.31) < 0.01, "power: the biggest first, the total in mAh and percent: ${r.mah} mAh, ${r.pct}%")
    ok(r.projPct == null, "power: no projection before a quarter of an hour of points")
    for (i in 1..12) PowerCore.report(m, 4000.0, t0 + 60 * min + i * 5 * min)
    val r2 = PowerCore.report(m, 4000.0, t0 + 125 * min)
    ok(r2.projPct != null && Math.abs(r2.projPct!! - 8.5 * 24 / 4000 * 100) < 0.2, "power: the projection for a whole day from the last hour: ${r2.projPct}%")
    ok(PowerCore.normCurrent(-350_000, false) == 350.0 && PowerCore.normCurrent(420, false) == 420.0 && PowerCore.normCurrent(-350_000, true) == 0.0, "power: µA or mA, either sign, and nothing while charging")
    ok(PowerCore.capacity(2_200_000, 50) == 4400.0 && PowerCore.capacity(0, 50) == null, "power: capacity from the counters, or nothing")
    val j = PowerCore.json(r)
    ok(j.startsWith("{\"day\":\"2026-09-30\",\"mah\":12.5") && j.contains("\"byTag\":{\"mic.vad\":8.0"), "power: the report for the page: " + j.take(90))
}
