import { isDone as f } from './dialer-is-done.mjs';
// עצמאי (חוק-1: אפס import-אח; שקעים/פיקסטורות inline). Golden נלכד מהרצה.
const START=JSON.parse("{\"name\":\"C\",\"startedAt\":\"2026-08-26\",\"queue\":[\"1\",\"2\",\"3\"],\"total\":3,\"log\":[]}");
const WANT="[false,true]";
const got=JSON.stringify([f(START),f({queue:[]})]);
if(got!==WANT){console.error('✗ dialer-is-done\n'+got+'\n≠\n'+WANT);process.exit(1);}
console.log('✓ dialer-is-done: Golden — ירוק');
