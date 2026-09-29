// @anchor: paths
// every database path the page touches, in one place (step page-kernel). No other file names a path.
const P={
  inbox:()=>db.collection('inbox'),inboxDoc:id=>db.doc('inbox/'+id),
  tasks:()=>db.collection('tasks'),task:id=>db.doc('tasks/'+id),
  sessions:()=>db.collection('sessions'),gallery:()=>db.collection('gallery'),
  owner:()=>db.doc('channel/owner'),quiet:()=>db.doc('channel/quiet'),device:()=>db.doc('channel/device'),
  current:()=>db.doc('chat/current'),settings:()=>db.doc('memory/settings'),
  crash:id=>db.doc('crashes/'+id),
  notes:()=>db.doc('memory/notes').collection('items'),prefs:()=>db.doc('memory/prefs').collection('items'),
  turns:()=>db.doc('chat/log').collection('turns'),decisions:()=>db.doc('decisions/log').collection('items'),
  telemetry:()=>db.doc('telemetry/events').collection('items'),
};
/* text from the database goes into the DOM through this, never raw: a task title is written by other
   sessions, and "<img onerror=…>" in one would otherwise run inside the page that holds the channel */
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
