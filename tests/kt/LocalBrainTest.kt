// step local-brain on the JVM: the state questions answered from the mirror, each with how old it is.
// Run through: node tools/kt-test.mjs
import il.liba.app.*

fun localBrainTests() {
    val now = 1_790_000_000_000L
    val m = Mirror(now - 5 * 60_000L, listOf(MTask("בניית הדוח", "blocked", "לאיזה חודש?"), MTask("סידור הגלריה", "running"), MTask("ישן", "done")),
        listOf("השוואת הצעות לגג"), "מאיר: איזה ספק", "לשלוח לספק השני", "n_AAA111", 1)
    val w = LocalBrain.answer("brain.where", m, now)!!
    ok(w.startsWith("עצרנו בהשוואת הצעות לגג. הצעד הבא: לשלוח לספק השני") && w.contains("מלפני 5 דקות"), "local brain: where we stopped, and how old: $w")
    val s = LocalBrain.answer("tasks.stuck", m, now)!!
    ok(s.startsWith("משימה אחת תקועה: בניית הדוח - לאיזה חודש?") && s.contains("הדף לא מחובר"), "local brain: what is stuck: $s")
    ok(LocalBrain.answer("brain.open", m.copy(openLoop = emptyList()), now)!!.startsWith("פתוח: בניית הדוח; סידור הגלריה"), "local brain: open, derived from the tasks when the brief has none")
    ok(LocalBrain.answer("brain.who", m, now)!!.startsWith("המוח: n_AAA111, 1 ערים"), "local brain: who")
    ok(LocalBrain.answer("brain.where", null, now)!!.startsWith("אין לי עדיין תמונה"), "local brain: no mirror yet - says so, invents nothing")
    ok(LocalBrain.answer("memory.about", m, now) == null, "local brain: not a state question - not its to answer")
    val mp = m.copy(proofs = listOf(MProof("הבדיקות עברו", "המנהל", "נמדד", "cmd node tests/zman.test.js", now - 60_000L)))
    ok(LocalBrain.answer("proof.where", mp, now)!!.startsWith("\"הבדיקות עברו\" - נמדד, אמר המנהל. המקור: cmd node tests/zman.test.js (לפי מה שידעתי"), "local brain: where it came from, with the page down: " + LocalBrain.answer("proof.where", mp, now))
    ok(LocalBrain.answer("proof.where", m, now)!!.startsWith("עוד לא אמרתי שום דבר שיש לו מקור"), "local brain: nothing sourced yet - says so")
    ok(LocalBrain.todayLine(m.copy(today = listOf("דוח נוכחות ב-10", "תורנות מטבח ב-7"))) == "היום נשאר: דוח נוכחות ב-10, תורנות מטבח ב-7." && LocalBrain.todayLine(m) == "" && LocalBrain.todayLine(null) == "", "local brain: what is left today, for the status")
    ok(LocalBrain.age(now, now - 3 * 3600_000L) == "מלפני 3 שעות" && LocalBrain.age(now, now - 30_000L) == "מלפני רגע", "local brain: ages in words")
}
