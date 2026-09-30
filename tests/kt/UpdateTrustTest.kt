// step update-trust on the JVM: six poisoned updates refused, each with its own reason; one good one accepted.
// Run through: node tools/kt-test.mjs
import il.liba.app.*
import java.io.File

fun updateTests(fixture: String) {
    val l = File(fixture).readLines(); val pub = l[0]; val f = l[1].split('\t')   // code sha url sig
    val code = f[0].toInt(); val sha = f[1]; val url = f[2]; val sig = f[3]
    ok(UpdateTrust.manifest(code, sha, url, sig, pub) == null, "update: a manifest made by release.mjs is believed")
    val bad = listOf(UpdateTrust.manifest(code, sha, url, "", pub), UpdateTrust.manifest(code + 1, sha, url, sig, pub), UpdateTrust.manifest(code, sha, url.replace("https", "http"), sig, pub),
        UpdateTrust.manifest(code, "", url, sig, pub))
    ok(bad.all { it != null } && bad.toSet().size == 4, "update: unsigned, altered, not https, no hash - four manifests refused, four reasons: $bad")
    val good = UpdateTrust.Got(2_700_000, 2_700_000, true, sha, true, code)
    val poisoned = listOf(good.copy(sha = "0".repeat(64)), good.copy(sameSigner = false), good.copy(code = 51), good.copy(bytes = 1_000_000), good.copy(isApk = false), good.copy(code = 60))
    val why = poisoned.map { UpdateTrust.file(sha, it, 60) }
    ok(why.all { it != null } && why.take(5).toSet().size == 5, "update: wrong hash, wrong signer, a downgrade to 51, cut short, not an APK, the same version - six refused: $why")
    ok(UpdateTrust.file(sha, good, 60) == null, "update: the real one is accepted")
}
