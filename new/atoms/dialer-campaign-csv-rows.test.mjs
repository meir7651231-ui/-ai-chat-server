import { campaignCsvRows as f } from './dialer-campaign-csv-rows.mjs';
// עצמאי (חוק-1: אפס import-אח; שקעים/פיקסטורות inline). Golden נלכד מהרצה.
const CAMP={name:'C',startedAt:'2026-08-26',total:3,queue:['3','1'],log:[{id:'1',outcome:'noanswer',at:'2026-08-26T10:00'},{id:'2',outcome:'donated',at:'2026-08-26T10:05',note:'תרם 100'},{id:'1',outcome:'noanswer',at:'2026-08-26T10:10'}]};const nameOf=(id)=>'שם'+id;
const WANT="[[\"שם\",\"תוצאה\",\"הערה\",\"מתי\"],[\"שם1\",\"לא ענה\",\"\",\"2026-08-26T10:00\"],[\"שם2\",\"תרם/ה\",\"תרם 100\",\"2026-08-26T10:05\"],[\"שם1\",\"לא ענה\",\"\",\"2026-08-26T10:10\"]]";
const got=JSON.stringify(f(CAMP,nameOf));
if(got!==WANT){console.error('✗ dialer-campaign-csv-rows\n'+got+'\n≠\n'+WANT);process.exit(1);}
console.log('✓ dialer-campaign-csv-rows: Golden — ירוק');
