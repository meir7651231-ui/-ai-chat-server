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
  });
  window.__libaHello=function(){frames().forEach(function(f){try{f.contentWindow.postMessage({liba:'hello'},'*');}catch(e){}});};
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
        fun onTap()
    }

    private class JsBridge(val b: Bridge) {
        @JavascriptInterface fun ready() = b.onReady()
        @JavascriptInterface fun say(text: String, kind: String, optionsJson: String) {
            val opts = try { val a = org.json.JSONArray(optionsJson); List(a.length()) { a.getString(it) } } catch (e: Exception) { emptyList() }
            b.onSay(text, kind, opts)
        }
        @JavascriptInterface fun sent(text: String) = b.onSent(text)
        @JavascriptInterface fun error(text: String, reason: String) = b.onError(text, reason)
        @JavascriptInterface fun tap() = b.onTap()
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

    fun sendInput(web: WebView, text: String) {
        web.evaluateJavascript("window.__libaInput && window.__libaInput(${JSONObject.quote(text)})", null)
    }
    /** A real touch through the view pipeline gives the page user activation (needed for sending to Claude). */
    fun simulateTap(web: WebView) {
        val x = web.width / 2f; val y = web.height / 2f; val t = android.os.SystemClock.uptimeMillis()
        val down = android.view.MotionEvent.obtain(t, t, android.view.MotionEvent.ACTION_DOWN, x, y, 0)
        val up = android.view.MotionEvent.obtain(t, t + 60, android.view.MotionEvent.ACTION_UP, x, y, 0)
        web.dispatchTouchEvent(down); web.postDelayed({ web.dispatchTouchEvent(up); down.recycle(); up.recycle() }, 60)
    }
    fun hello(web: WebView) { web.evaluateJavascript("window.__libaHello && window.__libaHello()", null) }
}
