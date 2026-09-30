// step device-mem: the phone's memory, on the JVM. Run through: node tools/kt-test.mjs
// args[0] = a file of "phrase\twords" lines made from the page's own memWords, so both sides match letter for letter.
import il.liba.app.*
import java.io.File

var fails = 0
fun ok(c: Boolean, m: String) { println((if (c) "PASS " else "FAIL ") + m); if (!c) fails++ }

fun main(args: Array<String>) {
    // 1 the words: exactly the page's
    val rows = File(args[0]).readLines().filter { it.isNotBlank() }.map { it.split('\t') }
    val bad = rows.filter { MemCore.words(it[0]).joinToString(" ") != it.getOrElse(1) { "" } }
    ok(bad.isEmpty(), "words: ${rows.size - bad.size}/${rows.size} phrases split exactly as the page splits them" + (if (bad.isNotEmpty()) " - " + bad.take(3).joinToString(" / ") { it[0] + " → " + MemCore.words(it[0]).joinToString(" ") + " ≠ " + it.getOrElse(1) { "" } } else ""))

    val now = 1_790_000_000_000L
    val m = MemCore()
    val fs = (0 until 600).map { MFact("k$it", "עובדה מספר $it על הארון", uses = it % 17, updatedAt = now - it) } +
        listOf(MFact("dani.1", "דני הוא הבן שלי", "person", 40, now), MFact("dani.2", "דני מתגייס באוגוסט", "event", 30, now),
               MFact("trip", "אני בחו\"ל עד ה-12", "note", 50, now, expiresAt = now - 1000), MFact("acct", "רואה החשבון הוא משה", "person", 35, now))
    m.apply(fs, listOf(MPerson("דני", "דני", listOf("דניאל"), "הבן שלי", now), MPerson("משה", "משה", emptyList(), "רואה החשבון", now)), listOf("אל תעדכן אותי על מייל"), now)
    ok(m.facts.size == MemCore.CAP, "a snapshot keeps the ${MemCore.CAP} facts used most: ${m.facts.size}")
    ok(m.facts.containsKey("dani.1") && m.facts.containsKey("acct"), "the ones used most are among them")

    // 2 the questions, from the phone, under a second each
    val qs = listOf("מה אתה זוכר על דני", "מי זה דני", "מי זה דניאל", "מה את יודעת על לדני", "מי זה משה", "מה אתה זוכר על הארון") +
        (0 until 14).map { "מה אתה זוכר על עובדה $it" }
    var slow = 0L; val answers = qs.map { q -> val t0 = System.nanoTime(); val a = if (q.startsWith("מי זה")) m.answerWho(q.removePrefix("מי זה").trim(), now) else m.answerAbout(q.substringAfter(" על ").trim(), now); slow = maxOf(slow, System.nanoTime() - t0); a }
    ok(slow < 1_000_000_000L, "20 memory questions answered from the phone, the slowest in ${slow / 1_000_000} ms (under a second)")
    ok(answers[0].contains("דני הוא הבן שלי") && answers[0].contains("מתגייס") && answers[0].contains("מהזיכרון שבטלפון"), "about: " + answers[0])
    ok(answers[1].startsWith("דני הוא הבן שלי") && answers[1].contains("דניאל") && answers[1].contains("מתגייס"), "who: " + answers[1])
    ok(answers[2].startsWith("דני הוא"), "who by a nickname: " + answers[2])
    ok(answers[3].contains("דני הוא הבן שלי"), "a Hebrew prefix finds the same fact: " + answers[3])
    ok(!m.answerAbout("חו\"ל", now).contains("עד ה-12"), "an expired fact is never said as true")

    // 3 fifty "תזכור" said offline: kept, found, survive a snapshot, all acked
    val ps = (0 until 50).map { m.remember("שהמפתח של המחסן $it אצל השכן", now + it) }
    ok(m.pending.size == 50 && m.answerAbout("המחסן 17", now).contains("המפתח של המחסן 17"), "50 offline remembers: pending, and found at once")
    ok(m.answerRemember(ps[0]).startsWith("זכרתי: המפתח של המחסן 0"), "said back without the ש: " + m.answerRemember(ps[0]))
    m.apply(fs, emptyList(), emptyList(), now + 100)
    ok(m.pending.size == 50 && m.facts.keys.count { it.startsWith("dev.") } == 50, "a snapshot that came before the ack loses none of them")
    m.ack(ps.take(30).map { it.id })
    ok(m.pending.size == 20 && m.facts.keys.count { it.startsWith("dev.") } == 20, "30 acked: 20 still pending")
    m.ack(ps.drop(30).map { it.id })
    ok(m.pending.isEmpty() && m.facts.keys.none { it.startsWith("dev.") }, "all 50 reached the page: 100%")

    reminderTests()
    senseTests()
    calTests()
    fusionTests()
    holyTests(args[1], args[2])
    signedTests(args[3])
    updateTests(args[4])
    localBrainTests()
    powerTests()
    governorTests()
    vaultTests()
    egressTests()
    guardTests()
    println(if (fails > 0) "\n$fails נכשלו" else "\nכל הבדיקות עברו")
    if (fails > 0) System.exit(1)
}
