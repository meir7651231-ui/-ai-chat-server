import { startCampaign as f } from './dialer-start-campaign.mjs';
// עצמאי (חוק-1: אפס import-אח; שקעים/פיקסטורות inline). Golden נלכד מהרצה.

const WANT="{\"name\":\"C\",\"startedAt\":\"2026-08-26\",\"queue\":[\"1\",\"2\",\"3\"],\"total\":3,\"log\":[]}";
const got=JSON.stringify(f('C',['1','1','','2','3'],'2026-08-26'));
if(got!==WANT){console.error('✗ dialer-start-campaign\n'+got+'\n≠\n'+WANT);process.exit(1);}
console.log('✓ dialer-start-campaign: Golden — ירוק');
