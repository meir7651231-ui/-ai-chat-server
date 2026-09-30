// step context-fusion / body on the JVM. Run through: node tools/kt-test.mjs
import il.liba.app.sense.*

fun fusionTests() {
    val h = 3600_000L; val m = 60_000L; val d0 = 1_790_000_000_000L
    val b = BodyCore()
    b.screen(false, d0)                            // 23:00 the screen goes off
    ok(b.screen(true, d0 + 4 * h) == null && b.screen(false, d0 + 4 * h + 5 * m) == null && b.lastWake == 0L, "body: three in the morning, five minutes on - not a morning")
    b.screen(true, d0 + 8 * h)                     // 07:00
    ok(b.tick(d0 + 8 * h + 5 * m) == null, "body: not yet - it has to stay on ten minutes")
    ok(b.tick(d0 + 8 * h + 11 * m) == d0 + 8 * h && b.lastWake == d0 + 8 * h, "body: 07:00 is the wake, dated when it began, not when confirmed")
    ok(b.tick(d0 + 8 * h + 30 * m) == null, "body: and only once")
    b.screen(false, d0 + 9 * h); b.screen(true, d0 + 10 * h)
    ok(b.tick(d0 + 10 * h + 20 * m) == null, "body: an hour off in the day is not a night")
    val b2 = BodyCore(); b2.screen(false, d0); b2.screen(true, d0 + 5 * h); ok(b2.screen(false, d0 + 5 * h + 15 * m) == d0 + 5 * h, "body: on for fifteen minutes then off - confirmed at the off")
    val f = FusionCore()
    ok(f.update(Ctx(true, false, false, false)) != null && f.update(Ctx(true, false, false, false)) == null, "context: sent only when it changes")
    ok(f.update(Ctx(true, false, true, false))?.headset == true, "context: a headset is a change")
}
