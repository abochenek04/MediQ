import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import type { LiveWaitEstimate } from '../types';
export {hasEstimate} from '../utils/estimates';
export function EstimateEvidence({estimate}:{estimate:LiveWaitEstimate}) {
 const {t,language}=useApp(); const [now,setNow]=useState(Date.now());
 useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),60000);return()=>clearInterval(timer);},[]);
 const relative=(iso:string)=>{const age=Math.max(0,Math.floor((now-Date.parse(iso))/60000));const format=new Intl.RelativeTimeFormat(language,{numeric:'auto'});return age<60?format.format(-age,'minute'):age<1440?format.format(-Math.floor(age/60),'hour'):format.format(-Math.floor(age/1440),'day');};
 const p=estimate.provenance;
 const sources=(p?.sources||[]).map(source=>source.kind==='patient-reports'?t('{count} recent patient reports',{count:source.count||0}):source.kind==='clinic-data'?t('Clinic-provided data'):source.kind==='historical-patterns'?t('Historical patterns'):t('Fictional reference model'));
 return <div className="estimate-evidence">
  {p?.fictional&&<p>{t('Fictional reference estimate. This is not a live clinic estimate.')}</p>}
  {estimate.evidenceState==='stale'&&<p className="evidence-warning">{t('Evidence is stale. A current estimate is unavailable.')}</p>}
  {estimate.evidenceState==='insufficient'&&<p className="evidence-warning">{t('Not enough recent evidence for a current estimate.')}</p>}
  {p?.calculatedAt&&<p>{t('Estimate calculated {time}',{time:relative(p.calculatedAt)})}</p>}
  {p?.evidenceUpdatedAt&&<p>{t('Latest contributing report {time}',{time:relative(p.evidenceUpdatedAt)})}</p>}
  {sources.length>0&&<p>{t('Based on: {sources}',{sources:sources.join(language==='ar'?'، ':', ')})}</p>}
  <p data-tour="reliability">{t('Estimate confidence: {level}',{level:t(estimate.evidenceState&&estimate.evidenceState!=='ready'?'Unavailable':estimate.reliability?.level||'low')})}</p>
 </div>;
}
export function ConceptHelp({label,text}:{label:string;text:string}) {
 const {t}=useApp();
 return <details className="concept-help"><summary>{t(label)}</summary><p>{t(text)}</p></details>;
}
export function EmergencyNotice() {const {t}=useApp();return <p className="emergency-notice" role="note">{t('MediQ is not an emergency service. For life-threatening symptoms, call 911 or go to the nearest emergency department.')}</p>;}
export function DiagnosisNotice() {const {t}=useApp();return <p className="diagnosis-notice">{t('MediQ does not diagnose conditions or determine emergencies. Search helps you find relevant care.')}</p>;}
export function InsuranceNotice() {const {t}=useApp();return <p className="insurance-notice">{t('Please confirm coverage with your insurer and clinic.')}</p>;}
