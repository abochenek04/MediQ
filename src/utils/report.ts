import type { WaitReportDraft } from '../types';
export const localToday = () => { const now = new Date(); return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
export const initialDraft = (clinicId = ''): WaitReportDraft => ({
 timezoneOffsetMinutes:new Date().getTimezoneOffset(),clinicId,visitMode:null,visitDate:localToday(),arrivalTime:null,checkInTime:null,
 providerTime:null,departureTime:null,crossesMidnight:false,totalRange:'',accuracy:'',communication:null,rushed:'',note:'',anonymous:true,
 insurance:null,language:null,providerId:null,
});
export const reportRanges = ['0–30 minutes','30–60 minutes','60–90 minutes','90–120 minutes','120–180 minutes','180 minutes'];
export const timeMinutes = (value:string) => { const [h,m]=value.split(':').map(Number);return h*60+m; };
// The explicit next-day choice disambiguates a reversed time from a midnight crossing.
export function orderedVisitMinutes(draft:WaitReportDraft) {
 let day=0,previous=-1;
 const values=[draft.arrivalTime,draft.checkInTime,draft.providerTime,draft.departureTime].filter((v):v is string=>!!v);
 const ordered=values.map((value,index)=>{let minute=timeMinutes(value)+day*1440;if(draft.crossesMidnight&&index===values.length-1&&draft.departureTime)minute=timeMinutes(value)+1440;if(minute<previous&&draft.crossesMidnight&&day===0){day=1;minute+=1440;}previous=minute;return minute;});
 return ordered;
}
export function validateReport(draft:WaitReportDraft,mode:'exact'|'range'|'current',_full=true,today=localToday()) {
 const errors:Record<string,string>={};
 if(!draft.clinicId)errors.clinicId='Choose the clinic you visited.';
 if(!draft.visitDate)errors.visitDate='Add the visit date.';
 else if(draft.visitDate>today)errors.visitDate='Visit date cannot be in the future.';
 if(mode==='current') {
  if(!Number.isFinite(draft.elapsedMinutes)||draft.elapsedMinutes!<0||draft.elapsedMinutes!>1440)errors.elapsedMinutes='Enter minutes between 0 and 1440.';
 }else if(mode==='range') {
  if(!reportRanges.includes(draft.totalRange))errors.totalRange='Choose an approximate total time.';
 }else{
  if(!draft.arrivalTime)errors.arrivalTime='Add your approximate arrival time.';
  if(!draft.departureTime)errors.departureTime='Add your approximate departure time.';
  const ordered=orderedVisitMinutes(draft);
  const total=draft.arrivalTime&&draft.departureTime?timeMinutes(draft.departureTime)-timeMinutes(draft.arrivalTime)+(draft.crossesMidnight?1440:0):0;
  if(ordered.some((value,index)=>index>0&&value<ordered[index-1])||total<=0||total>1440||ordered.length>1&&ordered.at(-1)!-ordered[0]!==total)
   errors.times='Times should follow the visit order: arrival, check-in, provider, departure. Select next day for an overnight visit.';
 }
 // Experience and personal context are optional; null/empty UI choices carry no evidence.
 return errors;
}
