import { useState, type FormEvent } from 'react';
import { useApp } from '../context/AppContext';
import { specialtyOptions } from '../data/mockData';
import { Link, navigate } from '../utils/navigation';
import { EmergencyNotice } from '../components/CareInformation';
export function OnboardingPage(){
 const {t}=useApp();const [location,setLocation]=useState('');const [specialty,setSpecialty]=useState('');
 const find=(event:FormEvent)=>{event.preventDefault();const query=new URLSearchParams();if(location.trim())query.set('location',location.trim());if(specialty)query.set('specialty',specialty);navigate(`/find${query.size?'?'+query:''}`);};
 return <div className="homepage"><section className="home-search-section shell"><h1>{t('Find care that fits your schedule')}</h1>
  <form className="home-search" role="search" onSubmit={find}><label className="field-label"><span>{t('Location')}</span><input value={location} onChange={event=>setLocation(event.target.value)} placeholder={t('Durham neighborhood or ZIP')}/></label><label className="field-label"><span>{t('What kind of care are you looking for?')}</span><select aria-label={t('What kind of care are you looking for?')} value={specialty} onChange={event=>setSpecialty(event.target.value)}><option value="">{t('All care categories')}</option>{specialtyOptions.map(value=><option key={value} value={value}>{t(value==='Urgent care'?'Urgent Care':value)}</option>)}</select></label><button className="button button-primary" type="submit">{t('Find Care')}</button></form>
  <EmergencyNotice/><p>{t('Fictional Durham directory. No medical history is needed to browse.')}</p>
 </section><section className="shell home-options"><h2>{t('Plan your care, your way')}</h2><div className="home-option-grid"><article><h3>{t('Continue as a guest')}</h3><p>{t('Browse and plan as a guest. Guest changes reset when you reload or close the tab.')}</p><Link className="button button-secondary" to="/find">{t('Explore as a guest')}</Link></article><article><h3>{t('Create a free account')}</h3><p>{t('Verified accounts sync saved clinics, visit plans and preferences across devices.')}</p><Link className="button button-secondary" to="/signup">{t('Sign up')}</Link></article><article><h3>{t('Explore future Plus')}</h3><p>{t('See the questions MediQ must answer before any optional planning tier is defined.')}</p><Link className="text-link" to="/know#access">{t('View the concept')}</Link></article></div></section></div>;
}
