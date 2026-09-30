// GENERATED from protocol/protocol.json by tools/gen-protocol.mjs - do not edit; edit the contract and regenerate
package il.liba.app

object Protocol {
    const val VERSION = 1
    const val HASH = "95695855e8a0"
    val CAPS = listOf("beat", "clock", "proto", "pulse", "spoke", "state", "trace", "mem", "remind", "sense", "cal", "ctx", "holy", "mirror")

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
        const val STATE = "state"
        const val MEM_SYNC = "memSync"
        const val MEM_ACK = "memAck"
        const val REMIND = "remind"
        const val SENSE_ACK = "senseAck"
        const val SENSE_CFG = "senseCfg"
        const val PLACE = "place"
        const val MIRROR = "mirror"
    }
    /** app -> page */
    object ToPage {
        const val HELLO = "hello"
        const val CRASH = "crash"
        const val SPOKE = "spoke"
        const val SPEAKING = "speaking"
        const val INPUT = "input"
        const val TRACE = "trace"
        const val PULSE = "pulse"
        const val MEM_ASK = "memAsk"
        const val SENSE = "sense"
        const val CAL_SYNC = "calSync"
        const val CTX = "ctx"
    }

    /** Relay for the top frame's message listener: page -> LibaBridge. */
    const val RELAY = """
    if(d.liba==="ready"){ready=true;LibaBridge.ready();}
    else if(d.liba==="say"){LibaBridge.say(String(d.text||""),String(d.kind||"say"),JSON.stringify(d.options||[]),String(d.speaker||""),String(d.id||""),String(d.mid||""));}
    else if(d.liba==="sent"){LibaBridge.sent(String(d.text||""));}
    else if(d.liba==="error"){LibaBridge.error(String(d.text||""),String(d.reason||""));}
    else if(d.liba==="queued"){LibaBridge.queued(String(d.text||""));}
    else if(d.liba==="outbox"){LibaBridge.outbox(String(d.text||""),Number(d.n||0),String(d.reason||""));}
    else if(d.liba==="tap"){LibaBridge.tap();}
    else if(d.liba==="cmd"){LibaBridge.cmd(String(d.cmd||""),String(d.nonce||""),Number(d.exp||0),String(d.sig||""));}
    else if(d.liba==="crashSaved"){LibaBridge.crashSaved(String(d.id||""));}
    else if(d.liba==="tasks"){LibaBridge.tasks(String(d.summary||""),Number(d.n||0),Number(d.blocked||0));}
    else if(d.liba==="traceAck"){LibaBridge.traceAck(String(d.batch||""),JSON.stringify(d.ids||[]));}
    else if(d.liba==="state"){LibaBridge.state(String(d.state||""));}
    else if(d.liba==="memSync"){LibaBridge.memSync(String(d.body||""));}
    else if(d.liba==="memAck"){LibaBridge.memAck(JSON.stringify(d.ids||[]));}
    else if(d.liba==="remind"){LibaBridge.remind(String(d.items||""));}
    else if(d.liba==="senseAck"){LibaBridge.senseAck(JSON.stringify(d.ids||[]));}
    else if(d.liba==="senseCfg"){LibaBridge.senseCfg(JSON.stringify(d.apps||[]));}
    else if(d.liba==="place"){LibaBridge.place(String(d.body||""));}
    else if(d.liba==="mirror"){LibaBridge.mirror(String(d.body||""));}
"""
    /** Senders the app calls through evaluateJavascript: app -> page. */
    const val SENDERS = """
  window.__libaSend=function(k,o){Array.prototype.slice.call(document.querySelectorAll('iframe')).forEach(function(f){try{f.contentWindow.postMessage(Object.assign({liba:k},o),'*');}catch(e){}});};
  window.__libaHello=function(){window.__libaSend("hello",{ver:window.__libaVer||'',proto:"95695855e8a0",pv:1,caps:["beat","clock","proto","pulse","spoke","state","trace","mem","remind","sense","cal","ctx","holy","mirror"],wall:Date.now(),state:window.__libaState||'',urgent:window.__libaUrgent||'',spoken:window.__libaSpoken||''});};
  window.__libaCrash=function(id,version,text){window.__libaSend("crash",{id:id,version:version,text:text});};
  window.__libaSpoke=function(id,startAt,endAt,cause){window.__libaSend("spoke",{id:id,startAt:startAt,endAt:endAt,cause:cause});};
  window.__libaSpeaking=function(id){window.__libaSend("speaking",{id:id});};
  window.__libaInput=function(text,source,stamps){window.__libaSend("input",{text:text,source:source,stamps:stamps});};
  window.__libaTrace=function(batch,events){window.__libaSend("trace",{batch:batch,events:events});};
  window.__libaPulse=function(dev,name,body){window.__libaSend("pulse",{dev:dev,name:name,body:body});};
  window.__libaMemAsk=function(items){window.__libaSend("memAsk",{items:items});};
  window.__libaSense=function(items){window.__libaSend("sense",{items:items});};
  window.__libaCalSync=function(snapshot){window.__libaSend("calSync",{snapshot:snapshot});};
  window.__libaCtx=function(body){window.__libaSend("ctx",{body:body});};
"""
}

/** The one state table (protocol/protocol.json "states"), shared with the page. */
enum class LibaState { OFFLINE, IDLE, WAKE, LISTENING, THINKING, SENDING, SPEAKING, RINGING, QUIET, DEGRADED;
    companion object {
        val INITIAL = OFFLINE
        private val MOVES: Map<LibaState, Set<LibaState>> = mapOf(
            OFFLINE to setOf(IDLE, WAKE),
            IDLE to setOf(LISTENING, THINKING, SPEAKING, SENDING, RINGING, QUIET, DEGRADED, WAKE, OFFLINE),
            WAKE to setOf(LISTENING, IDLE, SPEAKING, SENDING, RINGING, OFFLINE),
            LISTENING to setOf(THINKING, SENDING, IDLE, SPEAKING, WAKE, OFFLINE),
            THINKING to setOf(SENDING, SPEAKING, IDLE, OFFLINE),
            SENDING to setOf(IDLE, SPEAKING, RINGING, THINKING, DEGRADED, WAKE, LISTENING, OFFLINE),
            SPEAKING to setOf(IDLE, LISTENING, SENDING, WAKE, RINGING, OFFLINE),
            RINGING to setOf(SPEAKING, IDLE, LISTENING, OFFLINE),
            QUIET to setOf(IDLE, SPEAKING, OFFLINE),
            DEGRADED to setOf(IDLE, SPEAKING, SENDING, OFFLINE)
        )
        fun canMove(from: LibaState, to: LibaState) = from == to || MOVES[from]?.contains(to) == true
    }
}

/** Every page -> app message in the contract. JsBridge implements this, so a message with no Kotlin side does not compile. */
interface ProtocolBridge {
    fun ready()
    fun say(text: String, kind: String, options: String, speaker: String, id: String, mid: String)
    fun sent(text: String)
    fun error(text: String, reason: String)
    fun queued(text: String)
    fun outbox(text: String, n: Int, reason: String)
    fun tap()
    fun cmd(cmd: String, nonce: String, exp: Int, sig: String)
    fun crashSaved(id: String)
    fun tasks(summary: String, n: Int, blocked: Int)
    fun traceAck(batch: String, ids: String)
    fun state(state: String)
    fun memSync(body: String)
    fun memAck(ids: String)
    fun remind(items: String)
    fun senseAck(ids: String)
    fun senseCfg(apps: String)
    fun place(body: String)
    fun mirror(body: String)
}
