package il.liba.app

import android.content.Context
import android.media.AudioDeviceInfo
import android.media.AudioManager
import android.media.MediaRouter

/** step kotlin-egress on the device: where the voice would come out right now */
object AudioRoute {
    private val CAR = Regex("(?i)(car|auto|carplay|android auto|sync|uconnect|mazda|toyota|hyundai|kia|skoda|seat|ford|honda|nissan|רכב|מולטימדיה)")
    private val BT = setOf(AudioDeviceInfo.TYPE_BLUETOOTH_A2DP, AudioDeviceInfo.TYPE_BLUETOOTH_SCO, 26 /* BLE_HEADSET */, 27 /* BLE_SPEAKER */)
    private val WIRED = setOf(AudioDeviceInfo.TYPE_WIRED_HEADSET, AudioDeviceInfo.TYPE_WIRED_HEADPHONES, AudioDeviceInfo.TYPE_USB_HEADSET)
    fun bt(c: Context): AudioDeviceInfo? = (c.getSystemService(Context.AUDIO_SERVICE) as AudioManager).getDevices(AudioManager.GET_DEVICES_OUTPUTS).firstOrNull { it.type in BT }
    fun current(c: Context): Route = runCatching {
        val am = c.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        // where the voice will really go (Android 13+): the device the system routes the assistant's voice to - not
        // every device that happens to be paired (the phone test: a connected watch or earbud case read as a stranger's speaker)
        val outs = if (android.os.Build.VERSION.SDK_INT >= 33) runCatching { am.getAudioDevicesForAttributes(android.media.AudioAttributes.Builder().setUsage(android.media.AudioAttributes.USAGE_ASSISTANT).setContentType(android.media.AudioAttributes.CONTENT_TYPE_SPEECH).build()).toTypedArray() }
            .getOrElse { am.getDevices(AudioManager.GET_DEVICES_OUTPUTS) }.let { if (it.isEmpty()) am.getDevices(AudioManager.GET_DEVICES_OUTPUTS) else it } else am.getDevices(AudioManager.GET_DEVICES_OUTPUTS)
        val mr = c.getSystemService(Context.MEDIA_ROUTER_SERVICE) as MediaRouter; val sel = mr.getSelectedRoute(MediaRouter.ROUTE_TYPE_LIVE_AUDIO)
        if (outs.any { it.type == AudioDeviceInfo.TYPE_HDMI } || (sel != null && sel != mr.defaultRoute && sel.deviceType == MediaRouter.RouteInfo.DEVICE_TYPE_TV)) return@runCatching Route.CAST
        outs.firstOrNull { it.type in BT }?.let { d -> val name = d.productName?.toString() ?: ""
            return@runCatching if (name.isNotBlank() && name in Prefs.trustedAudio(c)) Route.BT_MINE else if (CAR.containsMatchIn(name)) Route.CAR else Route.BT_OTHER }
        if (outs.any { it.type in WIRED }) return@runCatching Route.WIRED
        if (am.mode == AudioManager.MODE_IN_COMMUNICATION && !@Suppress("DEPRECATION") am.isSpeakerphoneOn) Route.EARPIECE else Route.SPEAKER
    }.getOrDefault(Route.UNKNOWN)
}
