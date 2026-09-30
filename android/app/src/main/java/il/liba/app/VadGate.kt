package il.liba.app

import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import kotlin.math.sqrt

/** Step 21: on-device voice gate. Holds the mic cheaply and fires once real speech is heard,
 *  so the (chiming, network-hungry) SpeechRecognizer only runs when someone actually talks. */
class VadGate(private val sens: Double = 3.0, private val minRms: Double = 700.0, private val comm: Boolean = false, private val warm: Boolean = false, private val onVoice: () -> Unit) {
    @Volatile private var running = false
    private var thread: Thread? = null
    @Volatile private var rec: AudioRecord? = null
    @Volatile var floor = 300.0; private set
    val active get() = running
    /** duty-governor: listen onMs, rest offMs (offMs 0 = always on); the share of on-frames that were voice, for the
     *  missed-words estimate */
    @Volatile var onMs = 100; @Volatile var offMs = 0
    @Volatile var voiceFrac = 0.0; private set
    fun duty(on: Int, off: Int) { onMs = maxOf(on, 100); offMs = maxOf(off, 0) }

    fun start() { if (running) return; running = true; thread = Thread({ run() }, "liba-vad").apply { isDaemon = true; start() } }
    fun stop() { running = false; try { rec?.stop() } catch (e: Exception) { Trace.e(Trace.Code.E_MIC_READ, "stop:" + e.javaClass.simpleName) }; thread?.let { try { it.join(400) } catch (e: Exception) { Trace.e(Trace.Code.E_MIC_READ, "join:" + e.javaClass.simpleName) } }; thread = null }

    private fun run() {
        val rate = 16000; val ch = AudioFormat.CHANNEL_IN_MONO; val fmt = AudioFormat.ENCODING_PCM_16BIT
        val min = AudioRecord.getMinBufferSize(rate, ch, fmt); if (min <= 0) { Trace.e(Trace.Code.E_MIC_INIT, "minBuffer=" + min); running = false; return }
        val rec = try { AudioRecord(if (comm) MediaRecorder.AudioSource.VOICE_COMMUNICATION else MediaRecorder.AudioSource.VOICE_RECOGNITION, rate, ch, fmt, maxOf(min, 6400)) } catch (e: Exception) { Trace.e(Trace.Code.E_MIC_INIT, "ctor:" + e.javaClass.simpleName); running = false; return }
        if (rec.state != AudioRecord.STATE_INITIALIZED) { Trace.e(Trace.Code.E_MIC_INIT, "state=" + rec.state); running = false; try { rec.release() } catch (e: Exception) { Trace.e(Trace.Code.E_MIC_READ, "release:" + e.javaClass.simpleName) }; return }
        this.rec = rec
        val buf = ShortArray(320) // 20 ms frames
        var hot = 0; var frames = 0; var fired = false; var onFrames = 0; var voice = 0L; var seen = 0L
        try {
            rec.startRecording()
            while (running) {
                val n = rec.read(buf, 0, buf.size)
                if (n <= 0) { Thread.sleep(20); continue }
                var s = 0.0; for (i in 0 until n) { val v = buf[i].toDouble(); s += v * v }
                val rms = sqrt(s / n); frames++; onFrames++
                if (offMs > 0 && onFrames * 20 >= onMs && hot == 0 && frames > 30) { // rest the mic - never in the middle of a voice
                    onFrames = 0; try { rec.stop() } catch (e: Exception) { Trace.e(Trace.Code.E_MIC_READ, "duty:" + e.javaClass.simpleName) }
                    var slept = 0; while (running && slept < offMs) { Thread.sleep(50); slept += 50 }
                    if (!running) break; rec.startRecording(); continue }
                // adaptive noise floor: follows quiet quickly, loud slowly
                floor = if (rms < floor * 1.5) floor * 0.97 + rms * 0.03 else floor * 0.998 + rms * 0.002
                floor = floor.coerceIn(60.0, 5000.0)
                if (frames <= 30) { if (warm) floor = maxOf(floor, rms * 1.2); continue } // warm-up: learn the room (and, for barge-in, the speaker echo)
                if (rms > maxOf(floor * sens, minRms)) { hot++; voice++ } else hot = 0
                seen++; if (seen % 50 == 0L) voiceFrac = voice.toDouble() / seen
                if (hot >= (if (warm) 15 else 5)) { fired = true; break } // 100 ms of clear speech, 300 ms for barge-in
            }
        } catch (e: Exception) { Trace.e(Trace.Code.E_MIC_READ, "loop:" + e.javaClass.simpleName) } finally {
            try { rec.stop() } catch (e: Exception) { Trace.e(Trace.Code.E_MIC_READ, "stop:" + e.javaClass.simpleName) }
            try { rec.release() } catch (e: Exception) { Trace.e(Trace.Code.E_MIC_READ, "release:" + e.javaClass.simpleName) }
            this.rec = null
        }
        val wasRunning = running; running = false
        if (fired && wasRunning) onVoice()
    }
}
