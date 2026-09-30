export interface Evidence { kind:string; total_minutes:number|null; elapsed_minutes:number|null; submitted_at:number; status:string; }
export interface EstimateResult { state:'insufficient'|'stale'|'ready'; totalMinutes:number|null; range:[number,number]|null; sampleSize:number; eligibleSamples:number; ongoingCount:number; longestOngoingMinutes:number|null; confidence:'low'|'medium'|'high'; excludedOutliers:number; calculatedAt:string; }
const median=(values:number[])=>{const v=[...values].sort((a,b)=>a-b);return v.length%2?v[(v.length-1)/2]:(v[v.length/2-1]+v[v.length/2])/2;};
// Per clinic and visit mode. Ongoing reports are lower bounds, never completed totals.
export function estimate(evidence: Evidence[], now=Date.now()):EstimateResult {
 const accepted=evidence.filter(r=>r.status==='accepted' && r.submitted_at<=now);
 const ongoing=accepted.filter(r=>r.kind==='current-wait' && now-r.submitted_at<=2*3600000);
 const complete=accepted.filter(r=>r.kind==='completed-visit' && (r.total_minutes??0)>0 && now-r.submitted_at<=7*86400000);
 const result:EstimateResult={state:'insufficient',totalMinutes:null,range:null,sampleSize:complete.length,eligibleSamples:0,ongoingCount:ongoing.length,longestOngoingMinutes:ongoing.length?Math.max(...ongoing.map(r=>r.elapsed_minutes??0)):null,confidence:'low',excludedOutliers:0,calculatedAt:new Date(now).toISOString()};
 if (complete.length<3) return {...result,state:accepted.some(r=>r.kind==='completed-visit'&&now-r.submitted_at>7*86400000)?'stale':'insufficient'};
 const center=median(complete.map(r=>r.total_minutes!));
 const mad=median(complete.map(r=>Math.abs(r.total_minutes!-center)));
 const kept=complete.filter(r=>Math.abs(r.total_minutes!-center)<=Math.max(30,3*mad));
 result.excludedOutliers=complete.length-kept.length; result.eligibleSamples=kept.length;
 if (kept.length<3) return result;
 const fresh=kept.filter(r=>now-r.submitted_at<24*3600000);
 if (!fresh.length) return {...result,state:'stale'};
 const weighted=kept.map(r=>({value:r.total_minutes!,weight:Math.exp(-(now-r.submitted_at)/(48*3600000))}));
 const sum=weighted.reduce((s,r)=>s+r.weight,0);
 const total=Math.round(weighted.reduce((s,r)=>s+r.value*r.weight,0)/sum);
 const spread=Math.max(10,Math.ceil(Math.sqrt(weighted.reduce((s,r)=>s+r.weight*(r.value-total)**2,0)/sum)*1.5),Math.ceil(total*(kept.length<10?.3:.15)));
 return {...result,state:'ready',totalMinutes:total,range:[Math.max(1,total-spread),total+spread],confidence:kept.length>=20&&fresh.length>=10&&spread/total<.35?'high':kept.length>=8&&fresh.length>=3?'medium':'low'};
}
