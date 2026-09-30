package il.liba.app

/**
 * step faults: the speech guard measured, not guessed. Every utterance that finished tells how long a character takes
 * on this phone, this voice, this rate (an average that moves slowly); the guard is that times the length, with room,
 * never under 4 s and never over 90 s. Until three utterances were measured the old guess stands. Pure Kotlin.
 */
class GuardCore {
    var msPerChar = 0.0; private set
    var samples = 0; private set
    fun learn(chars: Int, ms: Long) { if (chars < 8 || ms <= 0 || ms > 120_000) return; val r = ms.toDouble() / chars
        msPerChar = if (samples == 0) r else msPerChar * 0.8 + r * 0.2; samples++ }
    fun guardMs(chars: Int): Long = if (samples < 3) 4000L + chars * 120L else (2500 + chars * msPerChar * 1.8).toLong().coerceIn(4000L, 90_000L)
}
