import { undoLast as f } from './dialer-undo-last.mjs';
// עצמאי (חוק-1: אפס import-אח; שקעים/פיקסטורות inline). Golden נלכד מהרצה.
const CAMP={name:'C',startedAt:'2026-08-26',total:3,queue:['3','1'],log:[{id:'1',outcome:'noanswer',at:'2026-08-26T10:00'},{id:'2',outcome:'donated',at:'2026-08-26T10:05',note:'תרם 100'},{id:'1',outcome:'noanswer',at:'2026-08-26T10:10'}]};
const WANT="{\"name\":\"C\",\"startedAt\":\"2026-08-26\",\"total\":3,\"queue\":[\"1\",\"3\"],\"log\":[{\"id\":\"1\",\"outcome\":\"noanswer\",\"at\":\"2026-08-26T10:00\"},{\"id\":\"2\",\"outcome\":\"donated\",\"at\":\"2026-08-26T10:05\",\"note\":\"תרם 100\"}]}";
const got=JSON.stringify(f(CAMP));
if(got!==WANT){console.error('✗ dialer-undo-last\n'+got+'\n≠\n'+WANT);process.exit(1);}
console.log('✓ dialer-undo-last: Golden — ירוק');
