import { ruleTypo as __pure_ruleTypo } from './rule-typo.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_rule_typo_T = {
  k1: 52,
};
const ruleTypo = (...a) => __pure_ruleTypo(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_rule_typo_T);
const dist=(a,b)=>{const la=a.length,lb=b.length;if(!la)return lb;if(!lb)return la;const dp=[];for(let j=0;j<=lb;j++)dp[j]=j;for(let i=1;i<=la;i++){let p=dp[0];dp[0]=i;for(let j=1;j<=lb;j++){const t=dp[j];dp[j]=Math.min(dp[j]+1,dp[j-1]+1,p+(a[i-1]===b[j-1]?0:1));p=t;}}return dp[lb];};
if (ruleTypo('golstein','goldstein',dist)!==48 || ruleTypo('כהנ','כהנ',dist)!==52 || ruleTypo('אבג','זחט',dist)!==null) { console.error('✗'); process.exit(1); }
console.log('✓ rule-typo — ירוק');
