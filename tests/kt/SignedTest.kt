// step signed-commands: the phone's own check (Signed.kt) on documents made by tools/cmd.mjs with a test key.
// Run through: node tools/kt-test.mjs
import il.liba.app.*
import java.io.File

fun signedTests(fixture: String) {
    val lines = File(fixture).readLines().filter { it.isNotBlank() }
    val pub = lines[0]; val now = System.currentTimeMillis(); val seen = mutableListOf<String>()
    var right = 0; val wrong = ArrayList<String>()
    for (l in lines.drop(1)) { val c = l.split('\t'); val why = Signed.check(c[0], c[1], c[2].toLong(), c[3], seen, now, pub)
        if ((c[4] == "ok") == (why == null)) right++ else wrong.add(c[0] + " → " + (why ?: "ok") + " (expected " + c[4] + ")") }
    ok(wrong.isEmpty(), "signed: $right/${lines.size - 1} decided as expected - valid run, forged/expired/replayed/altered refused, local and allowed hosts pass" + (if (wrong.isNotEmpty()) " - " + wrong.take(3) else ""))
    ok(Signed.openHostOk("https://github.com/x") && !Signed.openHostOk("http://github.com/x") && !Signed.openHostOk("https://github.com.evil.example/x"), "signed: open hosts - https only, exact host")
}
