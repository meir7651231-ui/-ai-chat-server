package il.liba.app

import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import kotlin.math.sqrt

/** Step 21: on-device voice gate. Holds the mic cheaply and fires once real speech is heard,
 *  so the (chiming, network-hungry) SpeechRecognizer only runs when someone actually talks. */
class VadGate(private val sens: Double = 3.0, private val minRms: Double = 700.0, private val comm: Boolean = false, private val onVoice: () -> Unit) {
    @Volatile private var running = false
    private var thread: Thread? = null
    @Volatile var floor = 300.0; private set
    val active get() = running

    fun start() { if (running) return; running = true; thread = Thread({ run() }, "liba-vad").apply { isDaemon = true; start() } }
    fun stop() { running = false; thread?.let { try { it.join(400) } catch (e: Exception) {} }; thread = null }

    private fun run() {
        val rate = 16000; val ch = AudioFormat.CHANNEL_IN_MONO; val fmt = AudioFormat.ENCODING_PCM_16BIT
        val min = AudioRecord.getMinBufferSize(rate, ch, fmt); if (min <= 0) { running = false; return }
        val rec = try { AudioRecord(if (comm) MediaRecorder.AudioSource.VOICE_COMMUNICATION else MediaRecorder.AudioSource.VOICE_RECOGNITION, rate, ch, fmt, maxOf(min, 6400)) } catch (e: Exception) { running = false; return }
        if (rec.state != AudioRecord.STATE_INITIALIZED) { running = false; try { rec.release() } catch (e: Exception) {}; return }
        val buf = ShortArray(320) // 20 ms frames
        var hot = 0; var frames = 0; var fired = false
        try {
            rec.startRecording()
            while (running) {
                val n = rec.read(buf, 0, buf.size)
                if (n <= 0) { Thread.sleep(20); continue }
                var s = 0.0; for (i in 0 until n) { val v = buf[i].toDouble(); s += v * v }
                val rms = sqrt(s / n); frames++
                // adaptive noise floor: follows quiet quickly, loud slowly
                floor = if (rms < floor * 1.5) floor * 0.97 + rms * 0.03 else floor * 0.998 + rms * 0.002
                floor = floor.coerceIn(60.0, 5000.0)
                if (frames > 30 && rms > maxOf(floor * sens, minRms)) hot++ else hot = 0
                if (hot >= 5) { fired = true; break } // ~100 ms of clear speech energy
            }
        } catch (e: Exception) {} finally {
            try { rec.stop() } catch (e: Exception) {}
            try { rec.release() } catch (e: Exception) {}
            running = false
        }
        if (fired) onVoice()
    }
}
