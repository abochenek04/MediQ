import { api,backendEnabled,errorKey } from '../services/api';
import { useState, type FormEvent } from 'react';
import { useApp } from '../context/AppContext';
import { DemoBadge } from '../components/UI';
import { Link } from '../utils/navigation';

export function ContactPage() {
  const { t } = useApp();
  const [done, setDone] = useState(false);const [feedback,setFeedback]=useState('');const [feedbackBusy,setFeedbackBusy]=useState(false);const [feedbackStatus,setFeedbackStatus]=useState('');
  const reportIssue=async(event:FormEvent)=>{event.preventDefault();if(feedbackBusy)return;setFeedbackBusy(true);setFeedbackStatus('');try{await api('/accessibility-feedback','POST',{message:feedback});setFeedback('');setFeedbackStatus('Accessibility feedback received. Thank you.');}catch(error){setFeedbackStatus(errorKey(error));}finally{setFeedbackBusy(false);}};
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setDone(true); };
  return <div className="page-space"><div className="shell contact-shell">
    <div className="page-heading"><div><span className="eyebrow">{t('Contact Us')}</span><h1>{t('Let’s hear from you.')}</h1><p>{t('Questions, ideas, or a clinic partnership? Try the demo contact form.')}</p></div></div>
    <section className="profile-card"><DemoBadge label={t('Demo only · no message is sent')} />
      {done ? <div role="status"><h2>{t('Demo submission complete')}</h2><p>{t('Nothing was sent or saved. A connected contact service would deliver your message here.')}</p><button className="button button-secondary" onClick={() => setDone(false)}>{t('Try another message')}</button><Link className="text-link" to="/find">{t('findCare')}</Link></div> : <form className="contact-form" onSubmit={submit}>
        <label className="field-label"><span>{t('Category')}</span><select required defaultValue=""><option value="" disabled>{t('Choose a category')}</option>{['General questions', 'Feedback', 'Clinic partnerships', 'Technical issues', 'Other'].map(value => <option key={value} value={value}>{t(value)}</option>)}</select></label>
        <label className="field-label"><span>{t('Message')}</span><textarea required minLength={5} maxLength={1000} rows={6} placeholder={t('Share feedback without personal or medical details.')} /></label>
        <p>{t('Please use sample text. This form has no email or backend connection.')}</p>
        <button className="button button-primary" type="submit">{t('Submit demo message')}</button>
      </form>}
    </section>
<section className="profile-card" id="accessibility-feedback"><h2>{t('Report an accessibility issue')}</h2><p>{t('Describe the page, control and difficulty without including personal or medical information. The accessibility feedback form saves your message for the MediQ team.')}</p>{backendEnabled?<form className="contact-form" onSubmit={event=>void reportIssue(event)}><label className="field-label"><span>{t('Accessibility feedback')}</span><textarea required minLength={5} maxLength={1000} value={feedback} onChange={event=>setFeedback(event.target.value)}/></label><button disabled={feedbackBusy} className="button button-primary">{t('Send accessibility feedback')}</button>{feedbackStatus&&<p role="status">{t(feedbackStatus)}</p>}</form>:<p>{t('Accessibility feedback requires the configured backend. Start the local API to send an issue.')}</p>}</section>
  </div></div>;
}
