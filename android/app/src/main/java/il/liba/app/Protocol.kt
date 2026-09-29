// GENERATED from protocol/protocol.json by tools/gen-protocol.mjs - do not edit; edit the contract and regenerate
package il.liba.app

object Protocol {
    const val VERSION = 1
    const val HASH = "759da17d5b1d"
    val CAPS = listOf("spoke", "beat", "trace", "proto", "clock")

    /** page -> app */
    object ToApp {
        const val READY = "ready"
        const val SAY = "say"
        const val SENT = "sent"
        const val ERROR = "error"
        const val QUEUED = "queued"
        const val OUTBOX = "outbox"
        const val TAP = "tap"
        const val CMD = "cmd"
        const val CRASH_SAVED = "crashSaved"
        const val TASKS = "tasks"
        const val TRACE_ACK = "traceAck"
    }
    /** app -> page */
    object ToPage {
        const val HELLO = "hello"
        const val CRASH = "crash"
        const val SPOKE = "spoke"
        const val SPEAKING = "speaking"
        const val INPUT = "input"
        const val TRACE = "trace"
    }

    /** Relay for the top frame's message listener: page -> LibaBridge. */
    const val RELAY = """
    if(d.liba==="ready"){ready=true;LibaBridge.ready();}
    else if(d.liba==="say"){LibaBridge.say(String(d.text||""),String(d.kind||"say"),JSON.stringify(d.options||[]),String(d.speaker||""),String(d.id||""));}
    else if(d.liba==="sent"){LibaBridge.sent(String(d.text||""));}
    else if(d.liba==="error"){LibaBridge.error(String(d.text||""),String(d.reason||""));}
    else if(d.liba==="queued"){LibaBridge.queued(String(d.text||""));}
    else if(d.liba==="outbox"){LibaBridge.outbox(String(d.text||""),Number(d.n||0),String(d.reason||""));}
    else if(d.liba==="tap"){LibaBridge.tap();}
    else if(d.liba==="cmd"){LibaBridge.cmd(String(d.cmd||""));}
    else if(d.liba==="crashSaved"){LibaBridge.crashSaved(String(d.id||""));}
    else if(d.liba==="tasks"){LibaBridge.tasks(String(d.summary||""),Number(d.n||0),Number(d.blocked||0));}
    else if(d.liba==="traceAck"){LibaBridge.traceAck(String(d.batch||""),JSON.stringify(d.ids||[]));}
"""
    /** Senders the app calls through evaluateJavascript: app -> page. */
    const val SENDERS = """
  window.__libaSend=function(k,o){Array.prototype.slice.call(document.querySelectorAll('iframe')).forEach(function(f){try{f.contentWindow.postMessage(Object.assign({liba:k},o),'*');}catch(e){}});};
  window.__libaHello=function(){window.__libaSend("hello",{ver:window.__libaVer||'',proto:"759da17d5b1d",pv:1,caps:["spoke","beat","trace","proto","clock"],wall:Date.now()});};
  window.__libaCrash=function(id,version,text){window.__libaSend("crash",{id:id,version:version,text:text});};
  window.__libaSpoke=function(id,startAt,endAt,cause){window.__libaSend("spoke",{id:id,startAt:startAt,endAt:endAt,cause:cause});};
  window.__libaSpeaking=function(id){window.__libaSend("speaking",{id:id});};
  window.__libaInput=function(text,source,stamps){window.__libaSend("input",{text:text,source:source,stamps:stamps});};
  window.__libaTrace=function(batch,events){window.__libaSend("trace",{batch:batch,events:events});};
"""
}

/** Every page -> app message in the contract. JsBridge implements this, so a message with no Kotlin side does not compile. */
interface ProtocolBridge {
    fun ready()
    fun say(text: String, kind: String, options: String, speaker: String, id: String)
    fun sent(text: String)
    fun error(text: String, reason: String)
    fun queued(text: String)
    fun outbox(text: String, n: Int, reason: String)
    fun tap()
    fun cmd(cmd: String)
    fun crashSaved(id: String)
    fun tasks(summary: String, n: Int, blocked: Int)
    fun traceAck(batch: String, ids: String)
}
