package il.liba.app

import android.annotation.SuppressLint
import android.util.Log
import android.webkit.*
import android.webkit.WebResourceError
import androidx.webkit.WebViewCompat
import androidx.webkit.WebViewFeature
import org.json.JSONObject

/** Shared WebView setup for the claude.ai shell that hosts the ליבה page. */
object LibaWeb {
    const val TAG = "Liba"

    /** Runs at document start in the TOP frame only: fixes mic permission on artifact iframes and relays postMessage traffic to Android. */
    /** Runs at document start in the TOP frame only. The message relay and the senders are generated from
     *  protocol/protocol.json (Protocol.RELAY / Protocol.SENDERS) - nothing here names a message by hand. */
    private val TOP_SCRIPT = """
(function(){
  if(window!==window.top||window.__liba)return; window.__liba=true;
  var fix=function(f){try{var a=f.getAttribute('allow')||'';if(!/microphone/.test(a)){f.setAttribute('allow',(a+'; microphone; autoplay').replace(/^; /,''));}}catch(e){}};
  new MutationObserver(function(ms){ms.forEach(function(m){Array.prototype.forEach.call(m.addedNodes,function(n){if(n.tagName==='IFRAME')fix(n);else if(n.querySelectorAll)Array.prototype.forEach.call(n.querySelectorAll('iframe'),fix);});});}).observe(document.documentElement,{childList:true,subtree:true});
  var ready=false;
  window.addEventListener('message',function(e){var d=e.data;if(!d||!d.liba||!window.LibaBridge)return;
    ${Protocol.RELAY}
  });
  window.__libaRect=function(){var f=document.querySelector('iframe');if(!f)return '';var r=f.getBoundingClientRect();return JSON.stringify([r.left,r.top,r.width,r.height]);};
  ${Protocol.SENDERS}
  setInterval(function(){if(!ready)window.__libaHello();},3000);
})();
"""

    interface Bridge {
        fun onPage(url: String)
        fun onReady()
        fun onSay(text: String, kind: String, options: List<String>, speaker: String, id: String, mid: String)
        fun onSent(text: String)
        fun onError(text: String, reason: String)
        fun onPageTap()
        fun onTasks(summary: String, n: Int, blocked: Int)
        fun onCrashSaved(id: String)
        fun onCmd(cmd: String, nonce: String, exp: Long, sig: String)
        fun onTraceAck(batch: String, ids: List<String>)
        fun onQueued(text: String)
        fun onOutbox(text: String, n: Int, reason: String)
        fun onPageState(state: String)
        fun onMemSync(body: String)
        fun onMemAck(ids: List<String>)
        fun onRemind(items: String)
        fun onSenseAck(ids: List<String>)
        fun onSenseCfg(apps: List<String>)
        fun onPlace(body: String)
    }

    private class JsBridge(val b: Bridge) : ProtocolBridge {
        private fun list(json: String) = try { val a = org.json.JSONArray(json); List(a.length()) { a.getString(it) } } catch (e: Exception) { emptyList() }
        @JavascriptInterface override fun ready() = b.onReady()
        @JavascriptInterface override fun say(text: String, kind: String, options: String, speaker: String, id: String, mid: String) = b.onSay(text, kind, list(options), speaker, id, mid)
        @JavascriptInterface override fun sent(text: String) = b.onSent(text)
        @JavascriptInterface override fun error(text: String, reason: String) = b.onError(text, reason)
        @JavascriptInterface override fun queued(text: String) = b.onQueued(text)
        @JavascriptInterface override fun outbox(text: String, n: Int, reason: String) = b.onOutbox(text, n, reason)
        @JavascriptInterface override fun tap() = b.onPageTap()
        @JavascriptInterface override fun cmd(cmd: String, nonce: String, exp: Int, sig: String) = b.onCmd(cmd, nonce, exp.toLong(), sig)
        @JavascriptInterface override fun crashSaved(id: String) = b.onCrashSaved(id)
        @JavascriptInterface override fun tasks(summary: String, n: Int, blocked: Int) = b.onTasks(summary, n, blocked)
        @JavascriptInterface override fun traceAck(batch: String, ids: String) = b.onTraceAck(batch, list(ids))
        @JavascriptInterface override fun state(state: String) = b.onPageState(state)
        @JavascriptInterface override fun memSync(body: String) = b.onMemSync(body)
        @JavascriptInterface override fun memAck(ids: String) = b.onMemAck(list(ids))
        @JavascriptInterface override fun remind(items: String) = b.onRemind(items)
        @JavascriptInterface override fun senseAck(ids: String) = b.onSenseAck(list(ids))
        @JavascriptInterface override fun senseCfg(apps: String) = b.onSenseCfg(list(apps))
        @JavascriptInterface override fun place(body: String) = b.onPlace(body)
    }

    @SuppressLint("SetJavaScriptEnabled")
    fun setup(web: WebView, bridge: Bridge?) {
        web.settings.apply {
            javaScriptEnabled = true; domStorageEnabled = true; databaseEnabled = true
            mediaPlaybackRequiresUserGesture = false; javaScriptCanOpenWindowsAutomatically = true
            allowContentAccess = true; loadWithOverviewMode = true; useWideViewPort = true
            cacheMode = WebSettings.LOAD_DEFAULT
            userAgentString = userAgentString.replace("; wv", "")
        }
        CookieManager.getInstance().setAcceptCookie(true)
        CookieManager.getInstance().setAcceptThirdPartyCookies(web, true)
        web.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest) { web.post { request.grant(request.resources) } }
            override fun onConsoleMessage(m: ConsoleMessage): Boolean { Log.d(TAG, "js: ${m.message()} @${m.lineNumber()}"); return true }
        }
        web.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean = false
            override fun onPageFinished(view: WebView, url: String?) {
                if (bridge != null) view.evaluateJavascript(TOP_SCRIPT, null) // fallback when document-start injection is unsupported
                bridge?.onPage(url ?: "")
            }
            override fun onReceivedError(view: WebView, request: WebResourceRequest, error: WebResourceError) {
                if (request.isForMainFrame) bridge?.onPage("error:" + error.description)
            }
        }
        if (bridge != null) {
            web.addJavascriptInterface(JsBridge(bridge), "LibaBridge")
            if (WebViewFeature.isFeatureSupported(WebViewFeature.DOCUMENT_START_SCRIPT)) {
                WebViewCompat.addDocumentStartJavaScript(web, TOP_SCRIPT, setOf("*"))
            }
        }
    }

    fun injectTop(web: WebView) { web.evaluateJavascript(TOP_SCRIPT, null) }
    /** req-spine: source is how the sentence reached ליבה - "voice" or "share" from here; the page adds typed/option. */
    fun sendInput(web: WebView, text: String, source: String = "voice", stamps: String = "") {
        web.evaluateJavascript("window.__libaInput && window.__libaInput(${JSONObject.quote(text)},${JSONObject.quote(source)},${JSONObject.quote(stamps)})", null)
    }
    /** A real touch through the view pipeline gives the page user activation (needed for sending to Claude).
     *  Taps the artifact iframe itself (centre, then upper and lower thirds) rather than a blind screen centre. */
    fun simulateTap(web: WebView) {
        web.evaluateJavascript("window.__libaRect ? window.__libaRect() : ''") { raw ->
            val scale = web.scale
            var pts = listOf(Pair(web.width / 2f, web.height / 2f), Pair(web.width / 2f, web.height * 0.35f), Pair(web.width / 2f, web.height * 0.7f))
            try {
                val j = org.json.JSONArray(raw.trim('"').replace("\\\"", "\"").replace("\\", ""))
                if (j.length() == 4) { val l = j.getDouble(0).toFloat() * scale; val t = j.getDouble(1).toFloat() * scale; val w = j.getDouble(2).toFloat() * scale; val h = j.getDouble(3).toFloat() * scale
                    if (w > 10 && h > 10) pts = listOf(Pair(l + w / 2, t + h / 2), Pair(l + w / 2, t + h * 0.3f), Pair(l + w / 2, t + h * 0.75f)) }
            } catch (e: Exception) { Trace.e(Trace.Code.E_PAGE_TAP, e.javaClass.simpleName) }
            pts.forEachIndexed { i, (x, y) -> web.postDelayed({ tapAt(web, x, y) }, i * 140L) }
        }
    }
    private fun tapAt(web: WebView, x: Float, y: Float) {
        val t = android.os.SystemClock.uptimeMillis()
        val down = android.view.MotionEvent.obtain(t, t, android.view.MotionEvent.ACTION_DOWN, x, y, 0)
        val up = android.view.MotionEvent.obtain(t, t + 50, android.view.MotionEvent.ACTION_UP, x, y, 0)
        web.dispatchTouchEvent(down); web.postDelayed({ web.dispatchTouchEvent(up); down.recycle(); up.recycle() }, 50)
    }
    /** 3.14.0: tell the page that the utterance it sent has finished being spoken, so it acks in order. */
    /** step page-kernel: "still speaking" every 2 s, so a page that hears nothing for 6 s knows the voice stopped. */
    /** step fixed-cardinality-telemetry: one edge-triggered sign of life; the page keeps it in pulse/<dev> */
    fun sendPulse(web: WebView, dev: String, name: String, body: String) { web.evaluateJavascript("window.__libaPulse && window.__libaPulse(${JSONObject.quote(dev)},${JSONObject.quote(name)},${JSONObject.quote(body)})", null) }
    fun sendSense(web: WebView, items: String) { web.evaluateJavascript("window.__libaSense && window.__libaSense(${JSONObject.quote(items)})", null) }
    fun sendCal(web: WebView, snapshot: String) { web.evaluateJavascript("window.__libaCalSync && window.__libaCalSync(${JSONObject.quote(snapshot)})", null) }
    fun sendCtx(web: WebView, body: String) { web.evaluateJavascript("window.__libaCtx && window.__libaCtx(${JSONObject.quote(body)})", null) }
    fun sendMemAsk(web: WebView, items: String) { web.evaluateJavascript("window.__libaMemAsk && window.__libaMemAsk(${JSONObject.quote(items)})", null) }
    fun sendSpeaking(web: WebView, id: String) { web.evaluateJavascript("window.__libaSpeaking && window.__libaSpeaking(${JSONObject.quote(id)})", null) }
    /** step clock: when the phone really started and stopped saying it, and why it stopped (done/error/guard/stop). */
    fun sendSpoke(web: WebView, id: String, startAt: Long = 0, endAt: Long = 0, cause: String = "done") { web.evaluateJavascript("window.__libaSpoke && window.__libaSpoke(${JSONObject.quote(id)},$startAt,$endAt,${JSONObject.quote(cause)})", null) }
    fun sendCrash(web: WebView, id: String, ver: String, text: String) { web.evaluateJavascript("window.__libaCrash && window.__libaCrash(${JSONObject.quote(id)},${JSONObject.quote(ver)},${JSONObject.quote(text)})", null) }
    /** step blackbox: one batch of on-disk trace lines, short-key shape unchanged.
     *  Kotlin does not know the db schema; the page does not know the file format. */
    fun sendTrace(web: WebView, batch: String, json: String) { web.evaluateJavascript("window.__libaTrace && window.__libaTrace(${JSONObject.quote(batch)},${JSONObject.quote(json)})", null) }
    fun hello(web: WebView) {
        val ver = try { web.context.packageManager.getPackageInfo(web.context.packageName, 0).versionName } catch (e: Exception) { "?" }
        val ver2 = ver + (if (OrbView.shaderOk) "" else if (android.os.Build.VERSION.SDK_INT >= 33) "-canvas:" + OrbView.shaderErr.take(60).replace("'", " ") else "-canvas")
        // second-channel: what the bubble already spoke natively, so the page marks it and never says it again
        val urgent = Prefs.urgentDone(web.context).joinToString(",").replace("'", "")
        // turn-engine: inbox messages the phone finished speaking - a page that died before it heard "spoke" must not repeat them
        val spoken = Prefs.spokenMids(web.context).joinToString(",").replace("'", "")
        web.evaluateJavascript("window.__libaVer='" + ver2 + "';window.__libaUrgent='" + urgent + "';window.__libaSpoken='" + spoken + "';window.__libaHello && window.__libaHello()", null)
    }
}
