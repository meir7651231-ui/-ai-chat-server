import { progress as f } from './dialer-progress.mjs';
// עצמאי (חוק-1: אפס import-אח; שקעים/פיקסטורות inline). Golden נלכד מהרצה.
const CAMP={name:'C',startedAt:'2026-08-26',total:3,queue:['3','1'],log:[{id:'1',outcome:'noanswer',at:'2026-08-26T10:00'},{id:'2',outcome:'donated',at:'2026-08-26T10:05',note:'תרם 100'},{id:'1',outcome:'noanswer',at:'2026-08-26T10:10'}]};
const WANT="{\"total\":3,\"remaining\":2,\"finalized\":1,\"counts\":{\"donated\":1,\"noanswer\":1,\"refused\":0,\"callback\":0,\"done\":0,\"skip\":0}}";
const got=JSON.stringify(f(CAMP));
if(got!==WANT){console.error('✗ dialer-progress\n'+got+'\n≠\n'+WANT);process.exit(1);}
console.log('✓ dialer-progress: Golden — ירוק');
