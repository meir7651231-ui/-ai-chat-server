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
    private const val TOP_SCRIPT = """
(function(){
  if(window!==window.top||window.__liba)return; window.__liba=true;
  var frames=function(){return Array.prototype.slice.call(document.querySelectorAll('iframe'));};
  var fix=function(f){try{var a=f.getAttribute('allow')||'';if(!/microphone/.test(a)){f.setAttribute('allow',(a+'; microphone; autoplay').replace(/^; /,''));}}catch(e){}};
  new MutationObserver(function(ms){ms.forEach(function(m){Array.prototype.forEach.call(m.addedNodes,function(n){if(n.tagName==='IFRAME')fix(n);else if(n.querySelectorAll)Array.prototype.forEach.call(n.querySelectorAll('iframe'),fix);});});}).observe(document.documentElement,{childList:true,subtree:true});
  var ready=false;
  window.addEventListener('message',function(e){var d=e.data;if(!d||!d.liba||!window.LibaBridge)return;
    if(d.liba==='ready'){ready=true;LibaBridge.ready();}
    else if(d.liba==='say'){LibaBridge.say(String(d.text||''),String(d.kind||'say'),JSON.stringify(d.options||[]));}
    else if(d.liba==='sent'){LibaBridge.sent(String(d.text||''));}
    else if(d.liba==='error'){LibaBridge.error(String(d.text||''),String(d.reason||''));}
    else if(d.liba==='tap'){LibaBridge.tap();}
    else if(d.liba==='cmd'){LibaBridge.cmd(String(d.cmd||''));}
    else if(d.liba==='crashSaved'){LibaBridge.crashSaved(String(d.id||''));}
    else if(d.liba==='tasks'){LibaBridge.tasks(String(d.summary||''),Number(d.n||0),Number(d.blocked||0));}
  });
  window.__libaRect=function(){var f=document.querySelector('iframe');if(!f)return '';var r=f.getBoundingClientRect();return JSON.stringify([r.left,r.top,r.width,r.height]);};
  window.__libaHello=function(){frames().forEach(function(f){try{f.contentWindow.postMessage({liba:'hello'},'*');}catch(e){}});};
  window.__libaCrash=function(id,ver,t){frames().forEach(function(f){try{f.contentWindow.postMessage({liba:'crash',id:id,version:ver,text:t},'*');}catch(e){}});};
  window.__libaInput=function(t){frames().forEach(function(f){try{f.contentWindow.postMessage({liba:'input',text:t},'*');}catch(e){}});};
  setInterval(function(){if(!ready)window.__libaHello();},3000);
})();
"""

    interface Bridge {
        fun onPage(url: String)
        fun onReady()
        fun onSay(text: String, kind: String, options: List<String>)
        fun onSent(text: String)
        fun onError(text: String, reason: String)
        fun onPageTap()
        fun onTasks(summary: String, n: Int, blocked: Int)
        fun onCrashSaved(id: String)
        fun onCmd(cmd: String)
    }

    private class JsBridge(val b: Bridge) {
        @JavascriptInterface fun ready() = b.onReady()
        @JavascriptInterface fun say(text: String, kind: String, optionsJson: String) {
            val opts = try { val a = org.json.JSONArray(optionsJson); List(a.length()) { a.getString(it) } } catch (e: Exception) { emptyList() }
            b.onSay(text, kind, opts)
        }
        @JavascriptInterface fun sent(text: String) = b.onSent(text)
        @JavascriptInterface fun error(text: String, reason: String) = b.onError(text, reason)
        @JavascriptInterface fun tap() = b.onPageTap()
        @JavascriptInterface fun tasks(summary: String, n: Int, blocked: Int) = b.onTasks(summary, n, blocked)
        @JavascriptInterface fun crashSaved(id: String) = b.onCrashSaved(id)
        @JavascriptInterface fun cmd(cmd: String) = b.onCmd(cmd)
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
    fun sendInput(web: WebView, text: String) {
        web.evaluateJavascript("window.__libaInput && window.__libaInput(${JSONObject.quote(text)})", null)
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
            } catch (e: Exception) {}
            pts.forEachIndexed { i, (x, y) -> web.postDelayed({ tapAt(web, x, y) }, i * 140L) }
        }
    }
    private fun tapAt(web: WebView, x: Float, y: Float) {
        val t = android.os.SystemClock.uptimeMillis()
        val down = android.view.MotionEvent.obtain(t, t, android.view.MotionEvent.ACTION_DOWN, x, y, 0)
        val up = android.view.MotionEvent.obtain(t, t + 50, android.view.MotionEvent.ACTION_UP, x, y, 0)
        web.dispatchTouchEvent(down); web.postDelayed({ web.dispatchTouchEvent(up); down.recycle(); up.recycle() }, 50)
    }
    fun sendCrash(web: WebView, id: String, ver: String, text: String) { web.evaluateJavascript("window.__libaCrash && window.__libaCrash(${JSONObject.quote(id)},${JSONObject.quote(ver)},${JSONObject.quote(text)})", null) }
    fun hello(web: WebView) { web.evaluateJavascript("window.__libaHello && window.__libaHello()", null) }
}
