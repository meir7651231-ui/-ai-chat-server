// step keystore-vault on the JVM (a test key - the real one never leaves the phone's Keystore): thirty known phrases
// sealed, none readable in what is stored; a changed byte or the wrong store does not open; a crash that could not be
// sealed keeps where it broke, not what it held. Run through: node tools/kt-test.mjs
import il.liba.app.VaultCore
import javax.crypto.KeyGenerator

fun vaultTests() {
    val key = KeyGenerator.getInstance("AES").apply { init(256) }.generateKey(); val other = KeyGenerator.getInstance("AES").apply { init(256) }.generateKey()
    val phrases = (1..30).map { "משפט סודי מספר $it על החשבון של המוסד" }
    val blobs = phrases.map { VaultCore.seal(key, "[{\"who\":\"me\",\"text\":\"$it\"}]", "log") }
    val leaked = phrases.indices.count { i -> val b = blobs[i]; b.contains(phrases[i]) || b.contains("סודי") || String(java.util.Base64.getDecoder().decode(b.substring(3)), Charsets.UTF_8).contains("סודי") }
    ok(leaked == 0, "vault: 30 known phrases sealed - $leaked of 30 readable in what is stored")
    ok(phrases.indices.all { VaultCore.open(key, blobs[it], "log")!!.contains(phrases[it]) }, "vault: each opens back, whole")
    ok(VaultCore.seal(key, "אותו דבר", "log") != VaultCore.seal(key, "אותו דבר", "log"), "vault: the same words sealed twice look different (a fresh nonce)")
    val b = blobs[0]; val raw = java.util.Base64.getDecoder().decode(b.substring(3)); raw[20] = (raw[20].toInt() xor 1).toByte()
    ok(VaultCore.open(key, "v1:" + java.util.Base64.getEncoder().encodeToString(raw), "log") == null, "vault: one changed byte - does not open (never garbage)")
    ok(VaultCore.open(key, b, "mem") == null && VaultCore.open(other, b, "log") == null && VaultCore.open(key, "not a blob", "log") == null, "vault: another store's name, another key, or junk - does not open")
    val st = "java.lang.IllegalStateException: meir said: the bank code is 1234\n\tat il.liba.app.X.y(X.kt:10)\nCaused by: java.io.IOException: text of a message\n\tat il.liba.app.Z.w(Z.kt:3)"
    val s = VaultCore.scrubStack(st)
    ok(!s.contains("1234") && !s.contains("message") && s.contains("IllegalStateException") && s.contains("at il.liba.app.X.y(X.kt:10)"), "vault: an unsealed crash keeps where it broke, not what it held")
}
