import { useId } from 'react';
import { useApp } from '../context/AppContext';
export function TimePicker({label,value,onChange,optional=false,error}:{label:string;value:string|null;onChange:(value:string|null)=>void;optional?:boolean;error?:string}) {
 const {t,language}=useApp();const id=useId();const formatter=new Intl.DateTimeFormat(language,{hour:'numeric'});const twelve=formatter.resolvedOptions().hour12;
 const parts=(value||`${String(new Date().getHours()).padStart(2,'0')}:${String(new Date().getMinutes()).padStart(2,'0')}`).split(':').map(Number);
 const hour=twelve?(parts[0]%12||12):parts[0];const period=parts[0]>=12?'pm':'am';const n=(number:number)=>new Intl.NumberFormat(language).format(number);
 const set=(part:'hour'|'minute'|'period',next:string)=>{if(next===''){onChange(null);return;}let h=parts[0],m=parts[1];if(part==='minute')m=Number(next);if(part==='hour')h=twelve?Number(next)%12+(period==='pm'?12:0):Number(next);if(part==='period')h=h%12+(next==='pm'?12:0);onChange(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);};
 const periodLabel=(h:number)=>new Intl.DateTimeFormat(language,{hour:'numeric',hour12:true}).formatToParts(new Date(2026,0,1,h)).find(p=>p.type==='dayPeriod')?.value||'';
 return <fieldset className="time-picker" aria-describedby={error?id+'-error':optional?id+'-optional':undefined}><legend>{t(label)}</legend>
  {optional&&<label className="unknown-time"><input type="checkbox" checked={!value} onChange={event=>onChange(event.target.checked?null:`${String(parts[0]).padStart(2,'0')}:${String(parts[1]).padStart(2,'0')}`)}/><span id={id+'-optional'}>{t("I don't remember / I don't know")}</span></label>}
  <div className="time-selects"><label><span>{t('Hour')}</span><select aria-label={t('{label} hour',{label:t(label)})} value={value||optional?hour:''} disabled={optional&&!value} aria-invalid={!!error} onChange={event=>set('hour',event.target.value)}>{!optional&&<option value="">{t('Choose')}</option>}{Array.from({length:twelve?12:24},(_,i)=>i+(twelve?1:0)).map(h=><option key={h} value={h}>{n(h)}</option>)}</select></label>
  <label><span>{t('Minute')}</span><select aria-label={t('{label} minute',{label:t(label)})} value={value||optional?parts[1]:''} disabled={optional&&!value} aria-invalid={!!error} onChange={event=>set('minute',event.target.value)}>{!optional&&<option value="">{t('Choose')}</option>}{Array.from({length:60},(_,i)=>i).map(m=><option key={m} value={m}>{new Intl.NumberFormat(language,{minimumIntegerDigits:2}).format(m)}</option>)}</select></label>
  {twelve&&<label><span>{t('AM/PM')}</span><select aria-label={t('{label} AM/PM',{label:t(label)})} value={period} disabled={optional&&!value} onChange={event=>set('period',event.target.value)}><option value="am">{periodLabel(0)}</option><option value="pm">{periodLabel(12)}</option></select></label>}</div>{error&&<p id={id+'-error'} className="field-error">{t(error)}</p>}
 </fieldset>;
}
