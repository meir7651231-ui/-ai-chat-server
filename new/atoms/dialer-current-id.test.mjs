import { currentId as f } from './dialer-current-id.mjs';
// עצמאי (חוק-1: אפס import-אח; שקעים/פיקסטורות inline). Golden נלכד מהרצה.
const START=JSON.parse("{\"name\":\"C\",\"startedAt\":\"2026-08-26\",\"queue\":[\"1\",\"2\",\"3\"],\"total\":3,\"log\":[]}");
const WANT="[\"1\",null]";
const got=JSON.stringify([f(START),f({queue:[]})]);
if(got!==WANT){console.error('✗ dialer-current-id\n'+got+'\n≠\n'+WANT);process.exit(1);}
console.log('✓ dialer-current-id: Golden — ירוק');
