package il.liba.app.sense

import android.app.KeyguardManager
import android.content.Context
import android.media.AudioDeviceCallback
import android.media.AudioDeviceInfo
import android.media.AudioManager
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.PowerManager
import il.liba.app.Trace
import org.json.JSONObject

/**
 * step context-fusion: the phone's part of "what is Meir doing now" - the screen and the lock (from the bubble's existing
 * screen receiver), a headset (AudioDeviceCallback), a call (AudioManager mode, from its listener on Android 12+ or a
 * two-second look before) - and when he woke up (BodyCore). No new permission. Sent to the page (ctx) only when
 * something changed; the page adds the calendar and decides what may interrupt.
 */
object SenseFusion {
    val body = BodyCore(); private val fusion = FusionCore()
    @Volatile var sink: ((String) -> Unit)? = null
    @Volatile var last: String? = null
    private val main = Handler(Looper.getMainLooper())
    private var app: Context? = null
    private var started = false
    private val poll = object : Runnable { override fun run() { app?.let { publish(it) }; main.postDelayed(this, if (Build.VERSION.SDK_INT >= 31) 60_000L else 2_000L) } }

    fun start(c: Context) {
        if (started) return; started = true; app = c.applicationContext
        val am = c.getSystemService(AudioManager::class.java)
        runCatching {
            am?.registerAudioDeviceCallback(object : AudioDeviceCallback() {
                override fun onAudioDevicesAdded(a: Array<out AudioDeviceInfo>?) { publish(c) }
                override fun onAudioDevicesRemoved(a: Array<out AudioDeviceInfo>?) { publish(c) }
            }, main)
            if (Build.VERSION.SDK_INT >= 31) am?.addOnModeChangedListener(c.mainExecutor) { publish(c) }
        }.onFailure { Trace.e(Trace.Code.E_SYS_CB, "fusion:" + it.javaClass.simpleName) }
        main.post(poll)
    }
    /** from the bubble's screen receiver */
    fun onScreen(c: Context, on: Boolean) { body.screen(on, System.currentTimeMillis()); publish(c, force = false) }

    private fun headset(am: AudioManager?) = runCatching { am?.getDevices(AudioManager.GET_DEVICES_OUTPUTS)?.any { it.type in setOf(AudioDeviceInfo.TYPE_BLUETOOTH_A2DP,
        AudioDeviceInfo.TYPE_BLUETOOTH_SCO, AudioDeviceInfo.TYPE_WIRED_HEADSET, AudioDeviceInfo.TYPE_WIRED_HEADPHONES, AudioDeviceInfo.TYPE_USB_HEADSET) } == true }.getOrDefault(false)

    fun publish(c: Context, force: Boolean = false) {
        val now = System.currentTimeMillis(); val woke = body.tick(now)
        val am = c.getSystemService(AudioManager::class.java)
        val ctx = Ctx(c.getSystemService(PowerManager::class.java)?.isInteractive == true, c.getSystemService(KeyguardManager::class.java)?.isKeyguardLocked == true,
            headset(am), am?.mode == AudioManager.MODE_IN_CALL || am?.mode == AudioManager.MODE_IN_COMMUNICATION)
        if (fusion.update(ctx) == null && woke == null && !force) return
        val j = JSONObject().put("screen", ctx.screen).put("locked", ctx.locked).put("headset", ctx.headset).put("call", ctx.call)
            .put("lastWake", body.lastWake).put("wakeSource", body.wakeSource).put("at", now).toString()
        last = j; sink?.invoke(j)
    }
}
