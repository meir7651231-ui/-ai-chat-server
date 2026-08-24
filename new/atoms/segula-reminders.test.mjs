import { segulaReminders } from './segula-reminders.mjs';
let f=0;
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const r=segulaReminders('2026-08-24');
if(r.length!==5){console.error('✗ length',r.length);f=1;}
const want=[
  {day:1,date:'2026-08-25',final:false},
  {day:7,date:'2026-08-31',final:false},
  {day:21,date:'2026-09-14',final:false},
  {day:35,date:'2026-09-28',final:false},
  {day:40,date:'2026-10-03',final:true},
];
for(let i=0;i<want.length;i++){if(!eq(r[i],want[i])){console.error('✗',JSON.stringify(r[i]),'≠',JSON.stringify(want[i]));f=1;}}
const c=segulaReminders('2026-01-01',[3]);
if(!eq(c,[{day:3,date:'2026-01-04',final:true}])){console.error('✗ custom',JSON.stringify(c));f=1;}
if(f)process.exit(1); console.log('✓ segula-reminders: 7 דוגמאות-חוזה — ירוק');
