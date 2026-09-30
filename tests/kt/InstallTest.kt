// step verified-install on the JVM: eight ways an update can be wrong - each refused, each with its own sentence, and
// Android's own answer in words. Run through: node tools/kt-test.mjs
import il.liba.app.UpdateTrust

fun installTests() {
    val sha = "a".repeat(64); val ok = UpdateTrust.Got(5_000_000, 5_000_000, true, sha, true, 80)
    val why = listOf(
        UpdateTrust.file(sha, ok.copy(bytes = 1_000_000), 79),              // cut short
        UpdateTrust.file(sha, ok.copy(sameSigner = false), 79),              // another signer
        UpdateTrust.file(sha, ok.copy(code = 79), 79),                       // not newer
        UpdateTrust.file(sha, ok.copy(sha = "b".repeat(64)), 79),            // another file
        UpdateTrust.before(false, 200, "application/octet-stream", 5_000_000, 1L shl 33),   // no permission to install
        UpdateTrust.before(true, 200, "application/vnd.android.package-archive", 5_000_000, 10_000_000),  // no room
        UpdateTrust.before(true, 404, "text/plain", 0, 1L shl 33),           // not on the server
        UpdateTrust.before(true, 200, "text/html; charset=utf-8", 3000, 1L shl 33))  // an error page
    ok(why.all { it != null } && why.toSet().size == 8, "install: eight wrong updates, eight refusals, eight different sentences: $why")
    ok(UpdateTrust.file(sha, ok, 79) == null && UpdateTrust.before(true, 200, "application/vnd.android.package-archive", 5_000_000, 1L shl 33) == null, "install: the right one passes")
    ok(UpdateTrust.installed(0, null) == null && UpdateTrust.installed(6, null) == "אין מספיק מקום להתקנה" && UpdateTrust.installed(3, null) == "ההתקנה בוטלה" && UpdateTrust.installed(99, "INSTALL_FAILED_X")!!.contains("INSTALL_FAILED_X"),
        "install: Android's answer in words")
    ok(UpdateTrust.rollbackWords(null) == "אין לי גרסה קודמת שמורה." && UpdateTrust.rollbackWords("הגרסה הקודמת, מספר 71").contains("להעלות אותה שוב כגרסה חדשה"), "install: going back is said honestly - Android does not install an older version over a newer one")
}
