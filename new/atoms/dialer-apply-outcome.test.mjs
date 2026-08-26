import { applyOutcome as f } from './dialer-apply-outcome.mjs';
// עצמאי (חוק-1: אפס import-אח; שקעים/פיקסטורות inline). Golden נלכד מהרצה.
const START=JSON.parse("{\"name\":\"C\",\"startedAt\":\"2026-08-26\",\"queue\":[\"1\",\"2\",\"3\"],\"total\":3,\"log\":[]}");const currentId=(c)=>c.queue.length?c.queue[0]:null;
const WANT="{\"name\":\"C\",\"startedAt\":\"2026-08-26\",\"queue\":[\"2\",\"3\",\"1\"],\"total\":3,\"log\":[{\"id\":\"1\",\"outcome\":\"noanswer\",\"at\":\"2026-08-26T09\",\"note\":\"לא בבית\"}]}";
const got=JSON.stringify(f(START,'noanswer','לא בבית','2026-08-26T09',{currentId}));
if(got!==WANT){console.error('✗ dialer-apply-outcome\n'+got+'\n≠\n'+WANT);process.exit(1);}
console.log('✓ dialer-apply-outcome: Golden — ירוק');
